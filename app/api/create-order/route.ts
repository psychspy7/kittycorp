import { recordPayment } from "@/lib/payment-ledger";
import { cookies } from "next/headers";
import { failure, HttpError, privateJson, readBody, verifyOrigin } from "@/lib/kitty-server";
import { verifyTurnstile } from "@/lib/turnstile-server";
import {
  checkoutAmount, createOrderSchema, createReceipt, ORDER_COOKIE_PREFIX, ORDER_LIFETIME_SECONDS,
  orderCookieName, orderIdSchema, resolvedRazorpayConfiguration, providerFailure, razorpayClient, readOrder, sealOrder,
} from "@/lib/razorpay-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const value = createOrderSchema.parse(await readBody(request));
    const config = await resolvedRazorpayConfiguration();
    // Project totals are server controlled. A voluntary contribution may be selected
    // by the visitor; it never settles an invoice or triggers project delivery.
    const amount = checkoutAmount(value, config);
    await verifyTurnstile(request, value.turnstileToken, "payment-order");
    let order;
    try {
      order = await razorpayClient(config).orders.create({
        amount, currency: config.currency, receipt: value.receipt || createReceipt(), partial_payment: false,
        notes: { purpose: value.purpose, project_reference: value.purpose === "project" ? value.reference : "" },
      });
    } catch (error) { providerFailure(error); }
    if (!orderIdSchema.safeParse(order.id).success || Number(order.amount) !== amount || order.currency !== config.currency) {
      throw new HttpError("The payment provider returned an invalid order. Please try again.", 500);
    }
    await recordPayment({provider:"razorpay",order_id:order.id,environment:config.testMode?"sandbox":"live",purpose:value.purpose,reference:value.purpose==="project"?value.reference:"",amount_minor:amount,currency:config.currency,status:"created",payment_id:null});
    const jar = await cookies();
    // Keep up to five concurrent checkouts without allowing cookies to grow unbounded.
    const previous = jar.getAll().filter(cookie => cookie.name.startsWith(ORDER_COOKIE_PREFIX))
      .map(cookie => ({ ...cookie, context: readOrder(cookie.value, config.keySecret, config.keyId) }))
      .sort((a, b) => (b.context?.expires || 0) - (a.context?.expires || 0));
    for (const cookie of previous.filter((cookie, index) => !cookie.context || index >= 4)) {
      jar.set(cookie.name, "", { path: "/api", httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 0 });
    }
    jar.set(orderCookieName(order.id), sealOrder({
      orderId: order.id, amount, currency: config.currency, keyId: config.keyId,
      purpose: value.purpose, reference: value.purpose === "project" ? value.reference : "",
      expires: Date.now() + ORDER_LIFETIME_SECONDS * 1000,
    }, config.keySecret), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api", maxAge: ORDER_LIFETIME_SECONDS,
    });
    return privateJson({ order_id: order.id, amount: Number(order.amount), currency: order.currency });
  } catch (error) { return failure(error); }
}

import { randomUUID } from "node:crypto";
import { reserveQuote,quoteAction } from "@/lib/project-quotes-server";
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
    if(value.purpose==="project"&&!value.quoteToken&&/^Q-/i.test(value.reference))throw new HttpError("Use your private quote link for this project payment.",400);
    let config = await resolvedRazorpayConfiguration();
    let reserved:Awaited<ReturnType<typeof reserveQuote>>|null=null;
    const reservation=randomUUID();
    if(value.quoteToken) {
      if(value.purpose!=="project"||!value.paymentChoice||config.testMode)throw new HttpError("A project quote requires live checkout and a payment schedule.",400);
      await verifyTurnstile(request,value.turnstileToken,"payment-order");
      reserved=await reserveQuote(value.quoteToken,value.paymentChoice,reservation,value.amount);
      config={...config,amount:reserved.amount};value.reference=reserved.reference;
    }
    // Project totals are server controlled. A voluntary contribution may be selected
    // by the visitor; it never settles an invoice or triggers project delivery.
    const amount = checkoutAmount(value, config);
    if(!value.quoteToken)await verifyTurnstile(request, value.turnstileToken, "payment-order");
    let order;
    const quoteReservation=reserved?.quote.reservation_id;
    const quoteReceipt=quoteReservation?`quote_${quoteReservation.replaceAll("-","")}`:"";
    try {
      if(reserved&&!reserved.quote.order_id&&quoteReservation!==reservation) {
        const previous=await razorpayClient(config).orders.all({receipt:quoteReceipt,count:2});
        if(previous.items.length!==1)throw new HttpError("Your checkout is still being prepared. Wait a moment and refresh the quote; no new order was created.",409);
        order=previous.items[0];
      } else {
      order = reserved?.quote.order_id ? await razorpayClient(config).orders.fetch(reserved.quote.order_id) : await razorpayClient(config).orders.create({
        amount, currency: config.currency, receipt: quoteReceipt || value.receipt || createReceipt(), partial_payment: false,
        notes: { purpose: value.purpose, project_reference: value.purpose === "project" ? value.reference : "",...(quoteReservation?{quote_reservation:quoteReservation}:{}) },
      });
      }
    } catch (error) {
      // Only an explicit provider rejection can release a new reservation. A timeout
      // may have created an order; leave it locked for owner reconciliation.
      if(error instanceof HttpError)throw error;
      const status=error&&typeof error==="object"&&"statusCode" in error?Number(error.statusCode):0;
      if(value.quoteToken&&reserved&&!reserved.quote.order_id&&status>=400&&status<500)await quoteAction("release",value.quoteToken,{reservation});
      providerFailure(error);
    }
    if (!orderIdSchema.safeParse(order.id).success || Number(order.amount) !== amount || order.currency !== config.currency) {
      throw new HttpError("The payment provider returned an invalid order. Please try again.", 500);
    }
    if(reserved&&(order.receipt!==quoteReceipt||order.notes?.quote_reservation!==quoteReservation||order.notes?.project_reference!==reserved.reference||(reserved.quote.order_id&&order.id!==reserved.quote.order_id)))throw new HttpError("The provider order does not match this project quote. Contact KITTY CORP before paying.",409);
    await recordPayment({provider:"razorpay",order_id:order.id,environment:config.testMode?"sandbox":"live",purpose:value.purpose,reference:value.purpose==="project"?value.reference:"",amount_minor:amount,currency:config.currency,status:"created",payment_id:null});
    if(value.quoteToken&&reserved&&!reserved.quote.order_id)await quoteAction("attach",value.quoteToken,{reservation:quoteReservation,orderId:order.id});
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

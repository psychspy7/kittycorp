import { recordPayment,storedPayment } from "@/lib/payment-ledger";
import { cookies } from "next/headers";
import { failure, HttpError, privateJson, readBody, verifyOrigin } from "@/lib/kitty-server";
import {
  orderCookieName, resolvedRazorpayConfiguration, providerFailure, razorpayClient, readOrder, validPaymentSignature, verifyPaymentSchema,
} from "@/lib/razorpay-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const value = verifyPaymentSchema.parse(await readBody(request));
    const ledger=await storedPayment("razorpay",value.razorpay_order_id);
    if(!ledger)throw new HttpError("This order could not be found. Contact KITTY CORP if you paid.",400);
    const config = await resolvedRazorpayConfiguration(ledger.environment);
    const stored = (await cookies()).get(orderCookieName(value.razorpay_order_id))?.value;
    const order = readOrder(stored, config.keySecret, config.keyId);
    if (!order || order.orderId !== value.razorpay_order_id) {
      throw new HttpError("This checkout session expired or could not be verified. If you were charged, contact KITTY CORP with your payment ID.", 400);
    }
    // Use the order ID issued by our server, not an untrusted Checkout callback.
    if (!validPaymentSignature(order.orderId, value.razorpay_payment_id, value.razorpay_signature, config.keySecret)) {
      throw new HttpError("Payment signature verification failed. The payment has not been marked as paid.", 400);
    }
    let payment;
    try { payment = await razorpayClient(config).payments.fetch(value.razorpay_payment_id); }
    catch (error) { providerFailure(error); }
    if (payment.id !== value.razorpay_payment_id || payment.order_id !== order.orderId
      || Number(payment.amount) !== order.amount || payment.currency !== order.currency || Number(payment.amount_refunded || 0) !== 0) {
      throw new HttpError("The payment details do not match this order. The payment has not been marked as paid.", 400);
    }
    if ((payment.status !== "captured" && payment.status !== "authorized")
      || (payment.status === "captured" && payment.captured !== true)) {
      throw new HttpError("This payment is not complete. The payment has not been marked as paid.", 400);
    }
    const paid = payment.status === "captured" && payment.captured === true;
    if(paid)await recordPayment({provider:"razorpay",order_id:order.orderId,environment:config.testMode?"sandbox":"live",purpose:order.purpose,reference:order.reference,amount_minor:order.amount,currency:order.currency,status:"paid",payment_id:payment.id});
    // Provider confirmation is recorded; no product membership is granted here.
    return privateJson({
      success: paid, verified: true, paid, status: paid ? "captured" : "authorized",
      payment_id: payment.id, order_id: order.orderId, amount: order.amount, currency: order.currency,
      purpose: order.purpose, reference: order.reference,
    });
  } catch (error) { return failure(error); }
}

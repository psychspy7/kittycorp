import "server-only";
import Razorpay from "razorpay";
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { HttpError } from "./kitty-server";

const MAX_AMOUNT = 100_000_000;
export const MAX_DONATION_PAISE = 1_000_000;
export type PaymentPurpose = "checkout" | "project" | "donation" | "lisa_preorder";
export const ORDER_LIFETIME_SECONDS = 3600;
export const ORDER_COOKIE_PREFIX = "kitty_rzp_";
export const orderIdSchema = z.string().regex(/^order_[A-Za-z0-9]{6,64}$/, "Invalid order ID.");
export const createOrderSchema = z.object({
  amount: z.number().int("Amount must be an integer in paise.").min(100, "The minimum payment is 100 paise.").max(MAX_AMOUNT),
  currency: z.literal("INR"),
  accountQuoteId: z.string().uuid().optional(),
  quoteToken: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  paymentChoice: z.enum(["full","split","after_review"]).optional(),
  receipt: z.string().trim().min(1).max(40).regex(/^[A-Za-z0-9_-]+$/, "Invalid receipt.").optional(),
  turnstileToken: z.string().max(2048).optional(),
  purpose: z.enum(["checkout", "project", "donation"]).optional().default("checkout"),
  reference: z.string().trim().max(80).regex(/^[\p{L}\p{N} ._\/-]*$/u, "Use letters, numbers, spaces or a simple project reference.").optional().default(""),
}).strict();
export const verifyPaymentSchema = z.object({
  razorpay_order_id: orderIdSchema,
  razorpay_payment_id: z.string().regex(/^pay_[A-Za-z0-9]{6,64}$/, "Invalid payment ID."),
  razorpay_signature: z.string().regex(/^[a-fA-F0-9]{64}$/, "Invalid payment signature."),
}).strict();

const contextSchema = z.object({
  orderId: orderIdSchema,
  amount: z.number().int().min(100).max(MAX_AMOUNT),
  currency: z.literal("INR"),
  keyId: z.string(),
  expires: z.number().int().positive(),
  purpose: z.enum(["checkout", "project", "donation", "lisa_preorder"]).optional().default("checkout"),
  reference: z.string().max(80).optional().default(""),
}).strict();
export type OrderContext = z.infer<typeof contextSchema>;

export function paymentConfiguration() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
  const amount = Number(process.env.RAZORPAY_CHECKOUT_AMOUNT_PAISE || "100");
  if (!keyId || !keySecret || !/^rzp_(test|live)_[A-Za-z0-9]+$/.test(keyId)
    || (publicKey && publicKey !== keyId) || !Number.isSafeInteger(amount) || amount < 100 || amount > MAX_AMOUNT) {
    throw new HttpError("Payments are not configured. Please contact KITTY CORP.", 503);
  }
  return { keyId, keySecret, amount, currency: "INR" as const, testMode: keyId.startsWith("rzp_test_") };
}

export function razorpayClient(config = paymentConfiguration()) {
  const { keyId, keySecret } = config;
  const client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  // The pinned SDK uses Axios internally but does not expose a timeout option.
  (client.api as unknown as { rq: { defaults: { timeout: number } } }).rq.defaults.timeout = 10_000;
  return client;
}

export function checkoutAmount(value: z.infer<typeof createOrderSchema>, config: ReturnType<typeof paymentConfiguration>) {
  if (value.purpose === "donation") {
    if (value.amount > MAX_DONATION_PAISE) throw new HttpError("Please choose a contribution between ₹1 and ₹10,000.", 400);
    return value.amount;
  }
  if (value.purpose === "project" && !config.testMode && !value.reference) {
    throw new HttpError("Enter the project or invoice reference we gave you.", 400);
  }
  if (value.amount !== config.amount) throw new HttpError("The payment amount has changed. Refresh this page and try again.", 400);
  return config.amount;
}

export function providerFailure(error: unknown): never {
  const status = error && typeof error === "object" && "statusCode" in error ? error.statusCode : undefined;
  if (status === 401) throw new HttpError("Payment provider authentication failed. Please contact KITTY CORP.", 401);
  // Never log the SDK error: it can include the HTTP authentication configuration.
  throw new HttpError("The payment provider is temporarily unavailable. Please try again.", 500);
}

export function createReceipt() {
  return `kitty_${randomUUID().replaceAll("-", "")}`;
}

export function orderCookieName(orderId: string) {
  return ORDER_COOKIE_PREFIX + createHash("sha256").update(orderId).digest("hex").slice(0, 16);
}

export function constantTimeHexEqual(expected: string, actual: string) {
  if (!/^[a-fA-F0-9]{64}$/.test(actual)) return false;
  const left = Buffer.from(expected, "hex");
  const right = Buffer.from(actual, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

export function sealOrder(context: OrderContext, secret: string) {
  const payload = Buffer.from(JSON.stringify(contextSchema.parse(context))).toString("base64url");
  const signature = createHmac("sha256", secret).update(`kitty-razorpay-order:${payload}`).digest("hex");
  return `${payload}.${signature}`;
}

export function readOrder(value: string | undefined, secret: string, keyId: string): OrderContext | null {
  if (!value || value.length > 2048) return null;
  const [payload, signature, extra] = value.split(".");
  if (!payload || !signature || extra !== undefined) return null;
  const expected = createHmac("sha256", secret).update(`kitty-razorpay-order:${payload}`).digest("hex");
  if (!constantTimeHexEqual(expected, signature)) return null;
  try {
    const context = contextSchema.parse(JSON.parse(Buffer.from(payload, "base64url").toString()));
    if (context.expires <= Date.now() || context.keyId !== keyId) return null;
    return context;
  } catch { return null; }
}

export function validPaymentSignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return constantTimeHexEqual(expected, signature);
}

export async function resolvedRazorpayConfiguration(environment?:"sandbox"|"live"){const {providerConfiguration}=await import("./commerce-server");const config=await providerConfiguration("razorpay",environment);return {keyId:config.clientId,keySecret:config.secret,amount:config.amount,currency:"INR" as const,testMode:config.testMode};}

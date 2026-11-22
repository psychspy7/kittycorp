import "server-only";
import { getRuntimeConfiguration } from "./runtime-configuration";
import { createHmac } from "node:crypto";
import { z } from "zod";
import { HttpError } from "./kitty-server";
import {
  razorpayClient,
  validPaymentSignature,
  constantTimeHexEqual,
  orderIdSchema,
  verifyPaymentSchema,
  providerFailure,
  resolvedRazorpayConfiguration,
} from "./razorpay-server";
import { draftMemberships, type MembershipCatalog } from "./membership-types";
import { priceEstimate } from "./currency-server";
import { recordPayment } from "./payment-ledger";

const uuid = z.string().uuid();
const providerSchema = z.object({
  keyId: z.string().regex(/^rzp_(test|live)_[A-Za-z0-9]+$/),
  keySecret: z.string().min(8),
  webhookSecret: z.string().min(16),
  previousWebhookSecret: z.string().optional(),
  testMode: z.boolean(),
  enabled: z.boolean(),
});

type Intent = {
  id: string;
  uid: string;
  product: string;
  plan_id: string;
  provider_order_id?: string;
  provider_key_id: string;
  status: string;
  terms: { amount: number; months: number; chatLimit: number; speechLimit: number };
};

async function endpoint() {
  const runtime = await getRuntimeConfiguration();
  const value = runtime.KITTY_MEMBERSHIP_BACKEND?.trim(),
    token = runtime.KITTY_COMMERCE_GATEWAY_TOKEN?.trim();
  if (!value || !token || token.length < 32)
    throw new HttpError("Membership checkout is being prepared. Please try later.", 503);
  const url = new URL(value);
  if (
    url.origin !== "https://kitty-ai-v2.kitty-ai.workers.dev" &&
    !(process.env.MEMBERSHIP_LOCAL_PREVIEW === "1" && url.hostname === "127.0.0.1" && url.protocol === "http:")
  )
    throw new HttpError("Membership connection needs setup.", 503);
  return { url: url.origin, token };
}

export async function commerce<T = Record<string, unknown>>(
  path: string,
  method = "GET",
  payload?: unknown,
  userToken?: string,
): Promise<T> {
  const { url, token } = await endpoint();
  const r = await fetch(url + "/api/" + path, {
    method,
    ...(method === "GET" ? { next: { revalidate: 3600 } } : { cache: "no-store" as const }),
    redirect: "error",
    signal: AbortSignal.timeout(15000),
    headers: {
      "Content-Type": "application/json",
      "X-Kitty-Commerce-Token": token,
      ...(userToken ? { Authorization: "Bearer " + userToken } : {}),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const text = await r.text();
  if (text.length > 128000) throw new HttpError("Membership response was too large.", 502);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new HttpError("Membership service is temporarily unavailable.", 502);
  }
  if (!r.ok) throw new HttpError(typeof data.error === "string" ? data.error : "Membership request failed.", r.status);
  return data as T;
}

export async function membershipCatalog(): Promise<MembershipCatalog> {
  try {
    return await commerce<MembershipCatalog>("memberships/catalog");
  } catch {
    return draftMemberships;
  }
}

export function customerToken(request: Request) {
  const token = request.headers.get("Authorization");
  if (!token?.startsWith("Bearer ") || token.length > 12000)
    throw new HttpError("Sign in with the Google account you use in KITTY AI.", 401);
  return token.slice(7);
}

function extractCustomerIdentity(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
      if (payload.email && (payload.user_id || payload.sub)) {
        return { uid: String(payload.user_id || payload.sub), email: String(payload.email) };
      }
    }
  } catch {}
  return null;
}

type ProviderInfo = {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  previousWebhookSecret?: string;
  testMode: boolean;
  enabled: boolean;
};

async function provider(): Promise<{ p: ProviderInfo; client: ReturnType<typeof razorpayClient> }> {
  try {
    const p = providerSchema.parse(await commerce("commerce/provider"));
    const config = { keyId: p.keyId, keySecret: p.keySecret, amount: 24_900, currency: "USD" as const, testMode: p.testMode };
    return { p, client: razorpayClient(config) };
  } catch {
    const config = await resolvedRazorpayConfiguration();
    const p: ProviderInfo = {
      keyId: config.keyId,
      keySecret: config.keySecret,
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
      previousWebhookSecret: undefined,
      testMode: config.testMode,
      enabled: true,
    };
    return {
      p,
      client: razorpayClient({
        keyId: p.keyId,
        keySecret: p.keySecret,
        amount: 24_900,
        currency: "USD",
        testMode: p.testMode,
      }),
    };
  }
}

export async function createMembership(request: Request, value: unknown) {
  const input = z
    .object({
      id: uuid,
      planId: z.string().regex(/^[a-zA-Z0-9-]{1,80}$/),
      currency: z.string().regex(/^[A-Z]{3}$/).optional().default("USD"),
      amount: z.number().int().positive().optional(),
    })
    .strict()
    .parse(value);

  const token = customerToken(request);
  const customerIdentity = extractCustomerIdentity(token);

  // BASE SUBSCRIPTION PRICE: $249 USD (24,900 cents)
  const basePriceUsd = 249;
  const basePriceUsdCents = 24_900;
  const requestedCurrency = input.currency || "USD";

  let finalAmount = basePriceUsdCents;
  if (requestedCurrency !== "USD") {
    try {
      const est = await priceEstimate({ amount: basePriceUsdCents, base: "USD", currency: requestedCurrency });
      finalAmount = Math.round(est.amount * 100);
    } catch {
      if (input.amount && Number.isSafeInteger(input.amount) && input.amount > 0) {
        finalAmount = input.amount;
      } else {
        // Fallback to USD base
        finalAmount = basePriceUsdCents;
      }
    }
  }

  const { p, client } = await provider();
  if (!p.enabled) throw new HttpError("Membership checkout is paused.", 503);

  let order;
  try {
    order = await client.orders.create({
      amount: finalAmount,
      currency: requestedCurrency,
      receipt: `member_${input.id.replaceAll("-", "").slice(0, 30)}`,
      partial_payment: false,
      notes: {
        purpose: "subscription",
        product: "kitty-one",
        intent_id: input.id,
        base_price_usd: String(basePriceUsd),
        charged_currency: requestedCurrency,
        charged_amount: String(finalAmount),
        customer_email: customerIdentity?.email || "",
      },
    });
  } catch (error) {
    providerFailure(error);
  }

  if (
    !orderIdSchema.safeParse(order.id).success ||
    Number(order.amount) !== finalAmount ||
    order.currency !== requestedCurrency
  ) {
    throw new HttpError("The provider returned an invalid membership order.", 502);
  }

  // Record initial order in payment ledger
  try {
    await recordPayment(
      {
        provider: "razorpay",
        order_id: order.id,
        environment: p.testMode ? "sandbox" : "live",
        purpose: "subscription",
        reference: "KITTY-ONE",
        amount_minor: finalAmount,
        currency: requestedCurrency,
        status: "created",
        payment_id: null,
      },
      customerIdentity,
    );
  } catch {}

  // Sync with worker intent if reachable
  try {
    await commerce("commerce/intents/" + input.id, "PUT", { orderId: order.id, amount: finalAmount, currency: requestedCurrency }, token);
  } catch {}

  return {
    intentId: input.id,
    keyId: p.keyId,
    orderId: order.id,
    amount: finalAmount,
    currency: requestedCurrency,
    testMode: p.testMode,
  };
}

type Payment = {
  id: string;
  order_id?: string;
  amount: number | string;
  currency: string;
  status: string;
  captured: boolean;
  amount_refunded?: number | string;
};

async function record(payment: Payment, eventId?: string) {
  try {
    return await commerce("commerce/reconcile", "POST", {
      orderId: payment.order_id,
      paymentId: payment.id,
      amount: Number(payment.amount),
      currency: payment.currency,
      captured: payment.captured === true,
      refunded: Number(payment.amount_refunded || 0),
      status: payment.status,
      ...(eventId ? { eventId } : {}),
    });
  } catch {
    return null;
  }
}

export async function verifyMembership(request: Request, value: unknown) {
  const input = verifyPaymentSchema.extend({ intentId: uuid }).strict().parse(value);
  const token = customerToken(request);
  const customerIdentity = extractCustomerIdentity(token);

  const { p, client } = await provider();
  if (
    !validPaymentSignature(
      input.razorpay_order_id,
      input.razorpay_payment_id,
      input.razorpay_signature,
      p.keySecret,
    )
  ) {
    throw new HttpError("Payment signature could not be verified.", 400);
  }

  let payment: Payment;
  try {
    payment = (await client.payments.fetch(input.razorpay_payment_id)) as unknown as Payment;
  } catch (error) {
    providerFailure(error);
  }

  if (
    payment.order_id !== input.razorpay_order_id ||
    !/^pay_[A-Za-z0-9]{6,64}$/.test(payment.id)
  ) {
    throw new HttpError("Payment does not match this membership order.", 409);
  }

  // Record verified payment in database
  try {
    await recordPayment(
      {
        provider: "razorpay",
        order_id: payment.order_id,
        environment: p.testMode ? "sandbox" : "live",
        purpose: "subscription",
        reference: "KITTY-ONE",
        amount_minor: Number(payment.amount),
        currency: payment.currency,
        status: "paid",
        payment_id: payment.id,
      },
      customerIdentity,
    );
  } catch {}

  // Attempt external worker reconciliation
  void record(payment).catch(() => {});

  return {
    active: true,
    paid: true,
    testMode: p.testMode,
    orderId: payment.order_id,
    paymentId: payment.id,
    amount: Number(payment.amount),
    currency: payment.currency,
  };
}

export async function membershipPaymentStatus(request: Request, value: unknown) {
  const input = z.object({ intentId: uuid, orderId: z.string().optional() }).strict().parse(value);
  const { p, client } = await provider();

  if (input.orderId) {
    try {
      const payments = await client.orders.fetchPayments(input.orderId);
      const payment =
        payments.items?.find((x) => x.status === "captured" || x.status === "authorized") ||
        payments.items?.at(-1);
      if (payment && (payment.status === "captured" || payment.status === "authorized")) {
        return { status: payment.status, paid: true, active: true, testMode: p.testMode };
      }
    } catch {}
  }

  return { status: "pending", paid: false, active: false };
}

export async function cancelMembership(request: Request, value: unknown) {
  const input = z.object({ intentId: uuid }).strict().parse(value);
  try {
    return await commerce("commerce/intents/" + input.intentId, "DELETE", undefined, customerToken(request));
  } catch {
    return { cancelled: true };
  }
}

export async function webhookMembership(raw: string, signature: string, eventId: string) {
  const { p, client } = await provider();
  const valid = [p.webhookSecret, p.previousWebhookSecret]
    .filter(Boolean)
    .some((secret) =>
      constantTimeHexEqual(createHmac("sha256", secret!).update(raw).digest("hex"), signature),
    );
  if (!valid) throw new HttpError("Webhook signature could not be verified.", 400);

  const event = z
    .object({ event: z.string(), payload: z.record(z.string(), z.unknown()) })
    .passthrough()
    .parse(JSON.parse(raw));
  if (
    ![
      "payment.captured",
      "payment.authorized",
      "payment.failed",
      "order.paid",
      "refund.processed",
      "payment.refunded",
    ].includes(event.event)
  )
    return { received: true, ignored: true };

  const payload = event.payload as {
    payment?: { entity?: { id?: string } };
    refund?: { entity?: { payment_id?: string } };
  };
  const paymentId = payload.payment?.entity?.id || payload.refund?.entity?.payment_id;
  if (!paymentId || !/^pay_[A-Za-z0-9]{6,64}$/.test(paymentId))
    throw new HttpError("Missing webhook payment.", 400);

  let payment: Payment;
  try {
    payment = (await client.payments.fetch(paymentId)) as unknown as Payment;
  } catch (error) {
    providerFailure(error);
  }
  if (!payment.order_id) return { received: true, ignored: true };

  await record(payment, eventId || undefined);
  return { received: true };
}

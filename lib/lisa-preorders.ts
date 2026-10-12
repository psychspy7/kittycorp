import { z } from "zod";
export const LISA_TERMS_VERSION = "2026-10-12-v1";
export const LISA_TERMS = "No delivery date is promised yet. A full refund of the amount paid is available before early access is provided. This preorder includes lifetime access to the purchased version; major future upgrades may be sold separately. Perks include early LISA updates, invitations to test upcoming KITTY products when available, and development news. Invitations do not include free access to every paid product.";
export const preorderTokenSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const preorderRequestSchema = z.object({name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254),termsVersion:z.literal(LISA_TERMS_VERSION),accepted:z.literal(true),turnstileToken:z.string().max(2048).optional()}).strict();
export type LisaPreorder = {id:string;amount_minor:number;price_usd_minor:number;rate_date:string;terms_version:string;terms:string;reservation_id:string|null;order_id:string|null;status:"created"|"paid"|"refunded";access_provided_at:string|null;refund_requested_at:string|null;created_at:string;payment_id:string|null};

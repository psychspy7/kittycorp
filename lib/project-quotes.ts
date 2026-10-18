import { z } from "zod";
export const paymentChoices = ["full", "split", "after_review"] as const;
export type ProjectPaymentChoice = typeof paymentChoices[number];
export const quoteTokenSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const quoteChoiceSchema = z.enum(paymentChoices);
export type ProjectQuote = { id:string; scope:string; service:string; amount_minor:number; status:"draft"|"approved"|"closed"; review_ready:boolean; choice:ProjectPaymentChoice|null; paid_minor:number; order_id:string|null; order_amount:number|null; reservation_id:string|null; split_discount_bps?:number; reward_discount_bps?:number; created_at:string; updated_at:string };
export function projectPaymentTerms(amount:number, choice:ProjectPaymentChoice, splitBps=100, rewardBps=0) {
 if(!Number.isSafeInteger(amount)||amount<100||amount>100000000)throw new Error("Invalid quote amount.");
 // A quote stores its policy so a later offer cannot change an existing agreement.
 if(![100,120].includes(splitBps))throw new Error("Invalid split discount.");
 if(![0,500,700].includes(rewardBps))throw new Error("Invalid reward discount.");
 const discountBps=Math.max(rewardBps,choice==="full"?250:choice==="split"?splitBps:0);
 const total=Math.round(amount*(10000-discountBps)/10000);
 return {discountBps,total,advance:choice==="split"?Math.ceil(total/2):choice==="full"?total:0};
}
export function quoteAmountDue(quote:ProjectQuote, choice:ProjectPaymentChoice) {
 if(quote.status!=="approved"||quote.amount_minor<100)throw new Error("Your quote is still being prepared.");
 if(quote.choice&&quote.choice!==choice)throw new Error("This quote already uses another payment schedule.");
 const terms=projectPaymentTerms(quote.amount_minor,choice,quote.split_discount_bps??120,quote.reward_discount_bps||0);
 if(quote.paid_minor>=terms.total)throw new Error("This quote has already been paid.");
 if(choice==="after_review"&&!quote.review_ready)throw new Error("Your preview is being prepared. Payment opens after the review.");
 if(choice==="split"&&quote.paid_minor>=terms.advance&&!quote.review_ready)throw new Error("Your advance is paid. The balance opens after the review.");
 const due=choice==="split"&&quote.paid_minor<terms.advance?terms.advance-quote.paid_minor:terms.total-quote.paid_minor;
 if(due<100)throw new Error("This payment is below the ₹1 checkout minimum. Contact KITTY CORP.");
 return due;
}

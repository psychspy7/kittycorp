import type {ProjectQuote} from "./project-quotes";
import type {LedgerOrder} from "./payment-ledger";
export type AccountOverview={identity:{uid:string;email:string};records:{projects:ProjectQuote[];preorders?: unknown[];payments:LedgerOrder[]};membership:{paid:boolean;expiresAt:number;freeRemainingSeconds:number;chatLimit:number;speechLimit:number}|null;subscription?:{plan:string;name:string;status:string;amount:number;currency:string;inclusions:string[]}|null;membershipError?:string};

import type {ProjectQuote} from "./project-quotes";
import type {LisaPreorder} from "./lisa-preorders";
import type {LedgerOrder} from "./payment-ledger";
export type AccountOverview={identity:{uid:string;email:string};records:{projects:ProjectQuote[];preorders:LisaPreorder[];payments:LedgerOrder[]};membership:{paid:boolean;expiresAt:number;freeRemainingSeconds:number;chatLimit:number;speechLimit:number}|null;membershipError?:string};

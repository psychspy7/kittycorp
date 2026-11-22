export type MembershipPlan={id:string;product:"kitty";name:string;amount:number|null;months:number;chatLimit:number;speechLimit:number;approved:boolean;enabled:boolean;purchasable:boolean;benefits:string[]};
export type MembershipCatalog={freeSeconds:number;freeResets:string;plans:MembershipPlan[];testMode:boolean;purchasesEnabled:boolean;reward:{enabled:boolean;proposedMessages:number;cooldownDays:number}};
export const draftMemberships:MembershipCatalog={freeSeconds:300,freeResets:"daily UTC",testMode:false,purchasesEnabled:true,reward:{enabled:false,proposedMessages:5,cooldownDays:30},plans:[
 {id:"kitty-plus",product:"kitty",name:"KITTY Plus",amount:24900,months:12,chatLimit:100,speechLimit:10,approved:true,enabled:true,purchasable:true,benefits:["100 chat requests per day","10 cloud-speech requests per day","Personal memory and saved context"]},
]};

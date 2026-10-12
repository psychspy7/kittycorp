export type MembershipPlan={id:string;product:"kitty"|"lisa";name:string;amount:number|null;months:number;chatLimit:number;speechLimit:number;approved:boolean;enabled:boolean;purchasable:boolean;benefits:string[]};
export type MembershipCatalog={freeSeconds:number;freeResets:string;plans:MembershipPlan[];testMode:boolean;purchasesEnabled:boolean;reward:{enabled:boolean;proposedMessages:number;cooldownDays:number}};
export const draftMemberships:MembershipCatalog={freeSeconds:300,freeResets:"daily UTC",testMode:false,purchasesEnabled:false,reward:{enabled:false,proposedMessages:5,cooldownDays:30},plans:[
 {id:"kitty-plus",product:"kitty",name:"KITTY Plus",amount:9900,months:1,chatLimit:100,speechLimit:10,approved:true,enabled:false,purchasable:false,benefits:["100 chat requests per day","10 cloud-speech requests per day","Personal memory and saved context"]},
 {id:"lisa-premium",product:"lisa",name:"LISA Premium",amount:null,months:1,chatLimit:100,speechLimit:10,approved:false,enabled:false,purchasable:false,benefits:["Separate LISA membership","Pricing and benefits to be confirmed"]},
]};

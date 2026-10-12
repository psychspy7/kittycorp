"use client";
import {LocalPrice} from "./local-currency";
import Script from "next/script";
import {useEffect,useRef,useState} from "react";
import type {User} from "firebase/auth";
import {Check,ArrowUpRight,ShieldCheck} from "lucide-react";
import {kittyCustomerAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged} from "@/lib/kitty-customer";
import type {MembershipCatalog} from "@/lib/membership-types";
import {Turnstile} from "./turnstile";
type Callback={razorpay_order_id:string;razorpay_payment_id:string;razorpay_signature:string};
type AccountStatus={paid:boolean;expiresAt:number;freeRemainingSeconds:number};
async function accountStatus(user:User,signal:AbortSignal){const bearer=await user.getIdToken();const response=await fetch("/api/memberships/me",{headers:{Authorization:"Bearer "+bearer},cache:"no-store",signal});const data=await response.json() as AccountStatus&{error?:string};if(!response.ok)throw Error(data.error||"Your current membership could not be checked.");return data;}
type Order={intentId:string;keyId:string;orderId:string;amount:number;currency:string;testMode:boolean};
export function Memberships({catalog,securityEnabled}:{catalog:MembershipCatalog;securityEnabled:boolean}) {
 const [account,setAccount]=useState<AccountStatus|null>(null);
 const [user,setUser]=useState<User|null>(null),[busy,setBusy]=useState(false),[ready,setReady]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState(""),[token,setToken]=useState(""),[revision,setRevision]=useState(0);
 const [pending,setPending]=useState<{id:string;uid:string}|null>(null);
 const epoch=useRef(0),lock=useRef(false),current=useRef<User|null>(null),callbackUsed=useRef(false);
 useEffect(()=>{let unlisten:(()=>void)|undefined,alive=true;
  void kittyCustomerAuth().then(auth=>{if(!alive)return;unlisten=onAuthStateChanged(auth,next=>{if(current.current?.uid!==next?.uid){epoch.current++;setMessage("");setError("");setPending(null);setAccount(null);}current.current=next;setUser(next);});}).catch(()=>{});
  return ()=>{alive=false;unlisten?.();};
 },[]);
 useEffect(()=>{if(!user)return;const controller=new AbortController();void accountStatus(user,controller.signal).then(status=>{if(!controller.signal.aborted&&current.current?.uid===user.uid)setAccount(status);}).catch(()=>{});return()=>controller.abort();},[user]);
 async function request<T=Record<string,unknown>>(path:string,body?:unknown) {
  const account=current.current;if(!account)throw new Error("Sign in with the Google account you use in KITTY AI.");
  const uid=account.uid,bearer=await account.getIdToken();if(current.current?.uid!==uid)throw new Error("Account changed. Start again.");
  const response=await fetch("/api/memberships/"+path,{method:body?"POST":"GET",headers:{"Content-Type":"application/json",Authorization:"Bearer "+bearer},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});
  const data=await response.json() as T & {error?:string};if(!response.ok)throw new Error(data.error||"Membership request failed.");
  if(current.current?.uid!==uid)throw new Error("Account changed. Check the purchase with its original account.");
  return data as T;
 }
 async function login() {
  if(lock.current)return;setError("");
  try {const auth=await kittyCustomerAuth();await signInWithPopup(auth,new GoogleAuthProvider());}catch{setError("Google sign-in could not finish. Check that this website is authorized in Firebase and try again.");}
 }
 async function status() {
  if(!pending||pending.uid!==current.current?.uid||lock.current)return;
  lock.current=true;setBusy(true);setError("");const generation=epoch.current;
  try{const r=await request("status",{intentId:pending.id});if(generation===epoch.current){setMessage(r.active?(r.testMode?"Test membership verified. This does not unlock production KITTY.":"Membership active. Reopen KITTY using this Google account."):r.status==="authorized"?"Payment authorized; capture is pending. Please do not pay again.":"No captured payment is confirmed yet. You can check again.");if(r.active)setPending(null);}}
  catch(e){if(generation===epoch.current)setError((e as Error).message);}finally{lock.current=false;setBusy(false);}
 }
 async function pay(planId:string) {
  if(lock.current||pending)return;if(!user){await login();return;}
  if(!window.Razorpay||!ready){setError("Checkout is still loading.");return;}
  if(securityEnabled&&!token){setError("Complete the security check first.");return;}
  lock.current=true;setBusy(true);setError("");setMessage("");callbackUsed.current=false;
  const generation=epoch.current,uid=user.uid,id=crypto.randomUUID();
  try {
   const order=await request<Order>("order",{id,planId,turnstileToken:token});
   if(generation!==epoch.current)return;
   setPending({id:order.intentId,uid});
   const checkout=new window.Razorpay({key:order.keyId,order_id:order.orderId,amount:order.amount,currency:order.currency,name:"KITTY CORP",description:(order.testMode?"TEST · ":"")+"KITTY Plus membership",image:window.location.origin+"/brand/monogram-small-v1.webp",theme:{color:"#252720"},retry:{enabled:true},
    handler:(value:Callback)=>{
     if(callbackUsed.current||generation!==epoch.current)return;callbackUsed.current=true;lock.current=true;setBusy(true);
     void request("verify",{...value,intentId:order.intentId}).then(r=>{
      if(generation!==epoch.current)return;
      if(r.active&&r.paid){setPending(null);setMessage(r.testMode?"Test membership verified. No production access or real charge.":"KITTY Plus is active. Open KITTY with this Google account.");}
      else setMessage("Payment is awaiting capture or reconciliation. Please do not pay again; check its status.");
     }).catch(e=>{if(generation===epoch.current)setError((e as Error).message);}).finally(()=>{lock.current=false;setBusy(false);});
    },
    modal:{ondismiss:()=>{if(callbackUsed.current)return;lock.current=false;setBusy(false);if(generation===epoch.current){setMessage("Checkout closed. No membership was activated by closing it. Check status if you attempted a payment.");void request("cancel",{intentId:order.intentId}).catch(()=>{});}}},
   });
   checkout.on("payment.failed",()=>{if(generation===epoch.current)setError("Payment failed. Retry in Razorpay or close checkout. Access remains unchanged.");});
   checkout.open();
  } catch(e){if(generation===epoch.current)setError((e as Error).message);lock.current=false;setBusy(false);}
  finally{setToken("");setRevision(x=>x+1);}
 }
 return <>
 <section className="membership-account" aria-label="Membership account"><div><ShieldCheck size={19}/><span>{user?"Buying for "+(user.email||"your signed-in account"):"Use the same Google account as KITTY AI."}</span></div>{user?<button disabled={busy} onClick={()=>void kittyCustomerAuth().then(signOut)}>Switch account</button>:<button onClick={()=>void login()}>Sign in with Google</button>}</section>
 {account&&<p className="membership-current" role="status">{account.paid?`KITTY Plus active until ${new Date(account.expiresAt).toLocaleDateString()}. A new purchase extends your current access.`:"Your account is connected to KITTY AI. No paid membership is active."}</p>}
 {!catalog.purchasesEnabled&&<p className="membership-paused" role="status">Purchases are not open yet. The KITTY price and limits are prepared; checkout remains paused until payment setup and release approval.</p>}
 {catalog.testMode&&catalog.purchasesEnabled&&<p className="membership-paused">TEST MODE · No real money is charged. Test membership access is isolated from production.</p>}
 <div className="membership-grid">
 <article className="membership-card"><span className="eyebrow">KITTY AI / START HERE</span><h2>Free</h2><div className="membership-price">₹0</div><p>Five minutes a day to get acquainted.</p><ul><li><Check size={16}/>Daily five-minute window</li><li><Check size={16}/>Saved chats on your device</li><li><Check size={16}/>Your personal memories</li></ul><a className="button button-outline" href="/kitty-ai">Get KITTY AI <ArrowUpRight size={16}/></a></article>
 {catalog.plans.map(plan=><article key={plan.id} className={"membership-card "+(plan.product==="kitty"?"is-featured":"")}><span className="eyebrow">{plan.product==="kitty"?"KITTY AI / MORE ROOM":"LISA AI / SEPARATE PRODUCT"}</span><h2>{plan.name}</h2><div className="membership-price">{plan.amount===null?"To be confirmed":"₹"+(plan.amount/100).toLocaleString("en-IN")}<small>{plan.amount!==null?"/"+(plan.months===1?"month":plan.months+" months"):""}</small></div>{plan.amount!==null&&<LocalPrice amount={plan.amount}/>}<p>{plan.product==="kitty"?"For longer conversations, with clear daily limits.":"Premium LISA is being prepared separately."}</p><ul>{plan.benefits.map(b=><li key={b}><Check size={16}/>{b}</li>)}</ul><button className={"button "+(plan.product==="kitty"?"button-gold":"button-outline")} disabled={!plan.purchasable||busy||!!pending||!!user&&(!ready||securityEnabled&&!token)} onClick={()=>void pay(plan.id)}>{!plan.purchasable?"Not available yet":busy?"Checkout in progress…":user&&(!ready||securityEnabled&&!token)?"Preparing secure checkout…":user?"Choose "+plan.name:"Sign in to choose"}</button></article>)}
 </div>
 {catalog.plans.some(p=>p.purchasable)&&<><Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onReady={()=>setReady(true)} onError={()=>setError("Razorpay checkout could not load.")}/>{securityEnabled&&<Turnstile action="payment-order" onToken={setToken} resetKey={revision}/>}</>}
 {message&&<p className="membership-result" role="status">{message}</p>}{error&&<p className="membership-error" role="alert">{error}</p>}
 {pending&&<button className="button button-outline" disabled={busy} onClick={()=>void status()}>Check payment status</button>}
 </>;
}

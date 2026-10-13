"use client";
import {useEffect,useRef,useState} from "react";
import type {User} from "firebase/auth";
import Link from "next/link";
export function CustomerSignIn({onUser,disabled=false}:{onUser?:(user:User|null)=>void;disabled?:boolean}){
 const callback=useRef(onUser);useEffect(()=>{callback.current=onUser;},[onUser]);
 const [user,setUser]=useState<User|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 useEffect(()=>{let active=true,unsubscribe:(()=>void)|undefined;void import("@/lib/kitty-customer").then(async lib=>{const auth=await lib.kittyCustomerAuth();if(!active)return;unsubscribe=lib.onAuthStateChanged(auth,u=>{setUser(u);callback.current?.(u);});}).catch(()=>{});return()=>{active=false;unsubscribe?.();};},[]);
 async function login(){setBusy(true);setError("");try{const lib=await import("@/lib/kitty-customer");const auth=await lib.kittyCustomerAuth();await lib.signInWithPopup(auth,new lib.GoogleAuthProvider());}catch(error){const lib=await import("@/lib/kitty-customer");setError(lib.customerSignInError(error)+" Guest checkout is still available.");}finally{setBusy(false);}}
 async function guest(){setBusy(true);setError("");try{const lib=await import("@/lib/kitty-customer");await lib.signOut(await lib.kittyCustomerAuth());}catch{setError("Sign-out could not finish. Please try again.");}finally{setBusy(false);}}
 return <div className="customer-sign-in"><div><strong>{user?"Connected to your Google account":"Keep this in your account"}</strong><p>{user?user.email:"Sign in with Google to track requests and purchases. Guest checkout is still available."}</p></div>{user?<div className="customer-sign-in-actions"><Link className="text-link" href="/account">My account →</Link><button type="button" className="text-link" disabled={busy||disabled} onClick={()=>void guest()}>Use guest mode</button></div>:<button type="button" className="button button-outline" disabled={busy||disabled} onClick={()=>void login()}>{busy?"Opening Google…":"Sign in with Google"}</button>}{error&&<p className="form-error" role="alert">{error}</p>}</div>;
}

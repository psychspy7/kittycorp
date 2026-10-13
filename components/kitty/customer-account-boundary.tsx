"use client";
import {useEffect,useState,type ReactNode} from "react";
import {CustomerSignIn} from "./customer-sign-in";
export function CustomerAccountBoundary({children}:{children:ReactNode}){const [uid,setUid]=useState<string|null>(null),[ready,setReady]=useState(false);useEffect(()=>{let active=true,off:(()=>void)|undefined;void import("@/lib/kitty-customer").then(async lib=>{const auth=await lib.kittyCustomerAuth();if(!active)return;off=lib.onAuthStateChanged(auth,user=>{setUid(user?.uid||null);setReady(true);});}).catch(()=>{if(active)setReady(true);});return()=>{active=false;off?.();};},[]);return !ready?<p role="status">Checking your Google account…</p>:uid?<div key={uid}>{children}</div>:<CustomerSignIn/>;}

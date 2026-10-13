"use client";
import {announceCustomerSession} from "./customer-session";
import {getApps,initializeApp,type FirebaseOptions} from "firebase/app";
import {getAuth,browserSessionPersistence,setPersistence,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,type Auth} from "firebase/auth";
let pending:Promise<Auth>|undefined;
export function kittyCustomerAuth():Promise<Auth> {
 if(!pending)pending=(async()=>{
  const response=await fetch("/kitty-firebase-config.json");if(!response.ok)throw new Error("Google sign-in is being prepared.");
  const config=await response.json() as FirebaseOptions;if(config.projectId!=="kittyai-f743c")throw new Error("The customer sign-in configuration is invalid.");
  const app=getApps().find(x=>x.name==="kitty-customer")||initializeApp(config,"kitty-customer");
  const auth=getAuth(app);await setPersistence(auth,browserSessionPersistence);onAuthStateChanged(auth,user=>announceCustomerSession(!!user));return auth;
 })().catch(error=>{pending=undefined;throw error;});
 return pending;
}
export {GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged};

export function customerSignInError(error:unknown){
 const code=error&&typeof error==="object"&&"code"in error?String(error.code):"";
 if(code==="auth/unauthorized-domain")return "Google sign-in isn’t enabled for this website address yet. Please use kittycorp.vercel.app.";
 if(code==="auth/popup-blocked")return "Your browser blocked the Google window. Allow popups for this website and try again.";
 if(code==="auth/popup-closed-by-user"||code==="auth/cancelled-popup-request")return "The Google window closed before sign-in finished. Please try again.";
 if(code==="auth/network-request-failed")return "Google couldn’t connect. Check your connection and try again.";
 if(process.env.NODE_ENV==="development"&&/^auth\/[a-z-]+$/.test(code))return "Google sign-in could not finish ("+code+"). Please try again.";
 return "Google sign-in could not finish. Please try again.";
}

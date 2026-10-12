"use client";
import {getApps,initializeApp,type FirebaseOptions} from "firebase/app";
import {getAuth,browserSessionPersistence,setPersistence,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,type Auth} from "firebase/auth";
let pending:Promise<Auth>|undefined;
export function kittyCustomerAuth():Promise<Auth> {
 if(!pending)pending=(async()=>{
  const response=await fetch("/kitty-firebase-config.json");if(!response.ok)throw new Error("Google sign-in is being prepared.");
  const config=await response.json() as FirebaseOptions;if(config.projectId!=="kittyai-f743c")throw new Error("The customer sign-in configuration is invalid.");
  const app=getApps().find(x=>x.name==="kitty-customer")||initializeApp(config,"kitty-customer");
  const auth=getAuth(app);await setPersistence(auth,browserSessionPersistence);return auth;
 })().catch(error=>{pending=undefined;throw error;});
 return pending;
}
export {GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged};

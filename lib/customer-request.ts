"use client";
async function customerSession(required:boolean){
 const {kittyCustomerAuth}=await import("./kitty-customer");let auth;
 try{auth=await kittyCustomerAuth();await auth.authStateReady();}catch{let expected=false;try{expected=sessionStorage.getItem("kitty-customer-connected")==="1";}catch{}if(required||expected)throw Error("Your Google account could not be checked. Please sign in again.");return {headers:{} as Record<string,string>,uid:null};}
 const user=auth.currentUser;try{sessionStorage.setItem("kitty-customer-connected",user?"1":"0");}catch{}
 if(!user){if(required)throw Error("Sign in with Google to open your account.");return {headers:{} as Record<string,string>,uid:null};}
 const uid=user.uid,token=await user.getIdToken();if(auth.currentUser?.uid!==uid)throw Error("Your account changed. Please try again.");
 return {headers:{Authorization:"Bearer "+token},uid};
}
export async function customerAuthorization(required=false):Promise<Record<string,string>>{return (await customerSession(required)).headers;}
export async function accountRequest<T>(path:string,body?:unknown):Promise<T>{const {headers,uid}=await customerSession(true);const {kittyCustomerAuth}=await import("./kitty-customer");const auth=await kittyCustomerAuth();if(auth.currentUser?.uid!==uid)throw Error("Your account changed. Please refresh.");
 const response=await fetch(path,{method:body?"POST":"GET",headers:{"Content-Type":"application/json",...headers},body:body?JSON.stringify(body):undefined,credentials:"same-origin",cache:"no-store",signal:AbortSignal.timeout(30000)});
 const value=await response.json()as T&{error?:string};if(auth.currentUser?.uid!==uid)throw Error("Your account changed. Please refresh.");if(!response.ok)throw Error(value.error||"Your account could not be loaded.");return value;
}

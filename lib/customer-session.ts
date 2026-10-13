"use client";
// A presentation hint only; the server verifies the Google token for every private request.
export function customerSignedIn(){try{return sessionStorage.getItem("kitty-customer-connected")==="1";}catch{return false;}}
export function subscribeCustomerSession(callback:()=>void){window.addEventListener("kitty:customer-session",callback);return()=>window.removeEventListener("kitty:customer-session",callback);}
export function announceCustomerSession(connected:boolean){try{sessionStorage.setItem("kitty-customer-connected",connected?"1":"0");}catch{}window.dispatchEvent(new Event("kitty:customer-session"));}

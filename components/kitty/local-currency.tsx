"use client";
import {createContext,useContext,useEffect,useId,useState} from "react";
const options=["INR","USD","EUR","GBP","AUD","CAD","JPY","AED","SGD","CHF","CNY","HKD","NZD","ZAR","BRL","MXN","KRW","IDR","MYR","PHP","THB","BDT","PKR","NPR","LKR","SAR","QAR","KWD","NGN","TRY","SEK","NOK","DKK","PLN"];
const countries:Record<string,string>={IN:"INR",US:"USD",GB:"GBP",AU:"AUD",CA:"CAD",JP:"JPY",AE:"AED",SG:"SGD",CH:"CHF",CN:"CNY",HK:"HKD",NZ:"NZD",ZA:"ZAR",BR:"BRL",MX:"MXN",KR:"KRW",ID:"IDR",MY:"MYR",PH:"PHP",TH:"THB",BD:"BDT",PK:"PKR",NP:"NPR",LK:"LKR",SA:"SAR",QA:"QAR",KW:"KWD",NG:"NGN",TR:"TRY",SE:"SEK",NO:"NOK",DK:"DKK",PL:"PLN",DE:"EUR",FR:"EUR",IT:"EUR",ES:"EUR",NL:"EUR",IE:"EUR",PT:"EUR",BE:"EUR",AT:"EUR",FI:"EUR",GR:"EUR",EE:"EUR",LT:"EUR",LV:"EUR",CY:"EUR",MT:"EUR",SK:"EUR",SI:"EUR",HR:"EUR",LU:"EUR"};
const CurrencyContext=createContext({currency:"",choose:(value:string)=>{void value;}});
export function LocalCurrencyProvider({country,children}:{country:string;children:React.ReactNode}){
 const [currency,setCurrency]=useState("");
 useEffect(()=>{let selected="";try{selected=window.localStorage.getItem("kitty-display-currency")||"";}catch{}if(!options.includes(selected)){let region=country;try{region||=new Intl.Locale(navigator.language).region||"";}catch{}selected=countries[region]||"USD";}Promise.resolve().then(()=>setCurrency(selected));},[country]);
 function choose(value:string){if(!options.includes(value))return;setCurrency(value);try{window.localStorage.setItem("kitty-display-currency",value);}catch{}}
 return <CurrencyContext.Provider value={{currency,choose}}>{children}</CurrencyContext.Provider>;
}
export function CurrencySelector(){const {currency,choose}=useContext(CurrencyContext);const id=useId();return <div className="currency-selector"><label htmlFor={id}>Display currency</label><select id={id} value={currency||"USD"} onChange={e=>choose(e.target.value)}>{options.map(value=><option key={value}>{value}</option>)}</select><span>Reference estimates. Checkout shows the charged currency.</span></div>;}
type Estimate={amount:number;currency:string;date:string|null;originalAmount?:number;originalBase?:string};
const pending=new Map<string,Promise<Estimate>>();
function estimate(amount:number,base:string,currency:string){const query=new URLSearchParams({amount:String(amount),base,currency}).toString();let task=pending.get(query);if(!task){task=fetch("/api/price-estimate?"+query).then(async response=>{if(!response.ok)throw Error("Rate unavailable");return await response.json() as Estimate;});pending.set(query,task);task.catch(()=>pending.delete(query));}return task;}
export function LocalPrice({amount,base="INR",charged=true,quoteOnly=false}:{amount:number;base?:"INR"|"USD";charged?:boolean;quoteOnly?:boolean}){
 const {currency}=useContext(CurrencyContext);const [data,setData]=useState<Estimate|null>(null);
 useEffect(()=>{if(!currency||currency===base)return;let active=true;void estimate(amount,base,currency).then(value=>{if(active)setData({...value,originalAmount:amount,originalBase:base});}).catch(()=>{if(active)setData(null);});return()=>{active=false;};},[amount,base,currency]);
 if(!currency||currency===base)return null;
 return <small className="local-price">{data?.currency===currency&&data.originalAmount===amount&&data.originalBase===base?<>≈ {new Intl.NumberFormat(undefined,{style:"currency",currency}).format(data.amount)} in {currency}<span>{quoteOnly?"Estimated local price; your quote confirms the amount. ":charged?`Charged in ${base}. `:"Planned price; no charge. "}Reference rate {data.date}. Your bank’s rate and fees may differ. <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates by Exchange Rate API</a></span></>:<span>Estimate in {currency} unavailable. {quoteOnly?"Your quote confirms the final price.":charged?`Checkout charges ${base}.`: `Planned price is in ${base}.`}</span>}</small>;
}

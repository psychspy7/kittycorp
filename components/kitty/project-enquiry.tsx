"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { customerAuthorization } from "@/lib/customer-request";
import { enquirySchema, enquiryServices } from "@/lib/enquiries";
import { CONTACT_EMAIL } from "@/lib/company-contact";
import { trackConversion } from "@/lib/site-analytics";
import { Turnstile } from "./turnstile";
const CustomerSignIn=dynamic(()=>import("./customer-sign-in").then(value=>value.CustomerSignIn));

export function ProjectEnquiry({initialService="Website"}:{initialService?:typeof enquiryServices[number]}) {
 const id=useId(),formRef=useRef<HTMLFormElement>(null),started=useRef(0),hasStarted=useRef(false);
 const [detailsOpen,setDetailsOpen]=useState(false),[analysisOpen,setAnalysisOpen]=useState(false);
 const [analysisToken,setAnalysisToken]=useState(""),[analysisBusy,setAnalysisBusy]=useState(false),[analysis,setAnalysis]=useState(""),[analysisError,setAnalysisError]=useState(""),[analysisRevision,setAnalysisRevision]=useState(0);
 const [customerEmail,setCustomerEmail]=useState(""),[accountLinked,setAccountLinked]=useState(false),[requestReference,setRequestReference]=useState(""),[quoteToken,setQuoteToken]=useState("");
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[sent,setSent]=useState(false),[turnstileToken,setTurnstileToken]=useState(""),[verificationAttempt,setVerificationAttempt]=useState(0);
 useEffect(()=>{started.current=Date.now();},[]);
 function began(){if(!hasStarted.current){hasStarted.current=true;trackConversion("project_form_start","projects");}}
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();const form=new FormData(event.currentTarget);
  const parsed=enquirySchema.safeParse({...Object.fromEntries(form),startedAt:started.current});
  if(!parsed.success){setError(parsed.error.issues[0]?.message||"Check your details.");trackConversion("form_error","projects");return;}
  setBusy(true);setError("");
  try{
   const headers=customerEmail?await customerAuthorization():{};
   const res=await fetch("/api/enquiries",{method:"POST",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify({...parsed.data,turnstileToken}),signal:AbortSignal.timeout(65000)});
   const data=await res.json() as {error?:string;quoteToken?:string;reference?:string;accountLinked?:boolean};
   if(!res.ok)throw Error(data.error||"Couldn’t send your project.");
   if(!data.quoteToken||!data.reference)throw Error("The request could not be confirmed. Please email us before resending.");
   setQuoteToken(data.quoteToken);setRequestReference(data.reference);setAccountLinked(data.accountLinked===true);setSent(true);
   trackConversion("enquiry_submit","projects");
  }catch(cause){setError(cause instanceof Error?cause.message:"Couldn’t send your project.");trackConversion("form_error","projects");}
  finally{setBusy(false);setTurnstileToken("");setVerificationAttempt(value=>value+1);}
 }
 async function analyse(){
  if(!formRef.current)return;const details=new FormData(formRef.current),brief=String(details.get("message")||"").trim();
  if(brief.length<20){setAnalysisError("Describe your idea first, then ask KITTY AI to help.");return;}
  setAnalysisBusy(true);setAnalysisError("");
  try{const response=await fetch("/api/assistant/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:`Help refine this ${details.get("service")} project brief. Summarize the scope and ask up to three important questions. Do not invent or promise a payable price or free development. Brief: ${brief.slice(0,580)}`,history:[],page:"/projects",turnstileToken:analysisToken}),signal:AbortSignal.timeout(30000)});const data=await response.json() as {answer?:string;error?:string};if(!response.ok)throw Error(data.error||"KITTY AI could not analyse this just now.");setAnalysis(data.answer||"");}catch(cause){setAnalysisError(cause instanceof Error?cause.message:"KITTY AI could not reply.");}finally{setAnalysisBusy(false);setAnalysisToken("");setAnalysisRevision(value=>value+1);}
 }
 if(sent)return <div className="project-success" role="status"><span className="eyebrow">YOUR REQUEST IS WITH US</span><h2>Thanks for the introduction.</h2><p>We’ll review the brief and reply to the email you supplied. Your request does not start paid development.</p><p>Request reference <strong>{requestReference}</strong></p><p>Save your private request link. Your scope, confirmed price and payment options will appear there after we discuss the work.</p><Link className="button button-gold" href={`/projects/quote#quote=${quoteToken}`}>View my project request</Link>{accountLinked&&<Link className="text-link" href="/account">Track this in My account →</Link>}</div>;
 return <form ref={formRef} className="project-enquiry-form quick-enquiry-form" onSubmit={submit} onFocusCapture={began} onInvalidCapture={()=>trackConversion("form_error","projects")}>
  <div className="project-form-grid">
   <div className="form-field"><label htmlFor={id+"-name"}>Your name</label><input id={id+"-name"} name="name" autoComplete="name" required minLength={2} maxLength={100} disabled={busy}/></div>
   <div className="form-field"><label htmlFor={id+"-email"}>Email address</label><input id={id+"-email"} name="email" type="email" autoComplete="email" readOnly={!!customerEmail} required maxLength={254} disabled={busy}/></div>
  </div>
  <div className="form-field"><label htmlFor={id+"-service"}>What do you need?</label><select id={id+"-service"} name="service" defaultValue={initialService} disabled={busy}>{enquiryServices.map(service=><option key={service}>{service}</option>)}</select></div>
  <div className="form-field"><label htmlFor={id+"-message"}>A short project description</label><textarea id={id+"-message"} name="message" rows={4} required minLength={20} maxLength={3500} disabled={busy} placeholder="What does your business do, and what would you like the website, app or workflow to help with?"/></div>
  <details className="enquiry-optional" onToggle={event=>setDetailsOpen(event.currentTarget.open)}><summary>Add context or connect an account <span>Optional</span></summary><div className="project-form-grid">
   <div className="form-field"><label htmlFor={id+"-organization"}>Business / project name</label><input id={id+"-organization"} name="organization" maxLength={120} disabled={busy}/></div>
   <div className="form-field"><label htmlFor={id+"-budget"}>Budget, if known</label><input id={id+"-budget"} name="budget" maxLength={100} disabled={busy}/></div>
   <div className="form-field"><label htmlFor={id+"-timeline"}>Timing, if known</label><input id={id+"-timeline"} name="timeline" maxLength={100} disabled={busy}/></div>
  </div><p className="studio-field-help">You can submit as a guest. Connecting Google is optional and adds this request to your account.</p>{detailsOpen&&<CustomerSignIn disabled={busy} onUser={user=>{setCustomerEmail(user?.email||"");const field=formRef.current?.elements.namedItem("email") as HTMLInputElement|null;if(field&&user?.email)field.value=user.email;}}/>}
   <div className="project-ai-helper"><button type="button" className="text-link" aria-expanded={analysisOpen} onClick={()=>setAnalysisOpen(value=>!value)}>Refine this description with KITTY AI</button>{analysisOpen&&<><p>Optional AI suggestions use your description. Keep confidential details out; the team approves the final scope and price.</p><Turnstile action="assistant" onToken={setAnalysisToken} resetKey={analysisRevision}/><button className="button button-outline" type="button" disabled={analysisBusy||!analysisToken} onClick={()=>void analyse()}>{analysisBusy?"Reviewing…":"Ask KITTY AI"}</button>{analysis&&<p className="project-ai-answer" role="status">{analysis}</p>}{analysisError&&<p className="form-error" role="alert">{analysisError}</p>}</>}</div>
  </details>
  <div className="honeypot" aria-hidden="true"><label htmlFor={id+"-website"}>Leave this empty</label><input id={id+"-website"} name="website" tabIndex={-1} autoComplete="off"/></div>
  <Turnstile action="project-enquiry" onToken={setTurnstileToken} resetKey={verificationAttempt}/>
  {error&&<div className="form-error" role="alert"><p>{error}</p><a href={`mailto:${CONTACT_EMAIL}`}>Email {CONTACT_EMAIL} instead</a></div>}
  <div className="project-form-submit"><p>Free to enquire. No account required.<br/>We use your email to discuss this request. <Link href="/privacy">Privacy</Link></p><button className="button button-gold" disabled={busy}>{busy?"Sending…":"Send project enquiry"}</button></div>
 <p className="enquiry-direct-fallback">Prefer email? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
 </form>;
}

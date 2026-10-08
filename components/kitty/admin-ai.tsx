"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { assistantSettingsSchema, defaultAssistantSettings, type AssistantSettings } from "@/lib/assistant-settings";

type Security = {googleReady?:boolean;googleRequired?:boolean};
type SettingsReply = {settings:Record<string,unknown>;connectionConfigured:boolean;verificationConfigured:boolean;error?:string};
export default function AdminAI() {
  const [settings,setSettings]=useState<AssistantSettings>(defaultAssistantSettings);
  const [ready,setReady]=useState({connection:false,verification:false});
  const [security,setSecurity]=useState<Security>({});
  const [loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState("");
  useEffect(()=>{const controller=new AbortController();
    Promise.all([fetch("/api/admin/assistant",{signal:controller.signal}).then(async response=>{const value=await response.json() as SettingsReply;if(!response.ok)throw Error(value.error||"Could not load assistant settings.");return value;}),fetch("/api/admin/security",{signal:controller.signal}).then(async response=>response.ok?await response.json() as Security:{} as Security)])
      .then(([value,status])=>{setSettings(assistantSettingsSchema.parse(Object.fromEntries(Object.keys(defaultAssistantSettings).map(key=>[key,value.settings[key]]))));setReady({connection:value.connectionConfigured,verification:value.verificationConfigured});setSecurity(status);setLoading(false);})
      .catch(failure=>{if(!controller.signal.aborted){setError(failure instanceof Error?failure.message:"Could not load settings.");setLoading(false);}});
    return()=>controller.abort();
  },[]);
  async function save(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setSaving(true);setError("");try{
    const response=await fetch("/api/admin/assistant",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(settings)});const value=await response.json() as {error?:string};if(!response.ok)throw Error(value.error||"Could not save settings.");toast.success("KITTY AI settings saved.");
  }catch(failure){setError(failure instanceof Error?failure.message:"Could not save settings.");}finally{setSaving(false);}}
  if(loading)return <p className="empty-message">Opening KITTY AI settings…</p>;
  return <section className="studio-ai-settings"><style>{`.studio-ai-status{display:flex;gap:15px;flex-wrap:wrap;padding:18px 0;border-bottom:1px solid var(--border);margin-bottom:25px;font-size:12px}.studio-ai-form{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:850px}.studio-ai-form .wide{grid-column:1/-1}.studio-ai-form label{font-size:12px;display:flex;flex-direction:column;gap:8px}.studio-ai-form input:not([type=checkbox]),.studio-ai-form textarea{width:100%;border:1px solid var(--border);border-radius:5px;padding:11px;background:var(--surface);color:inherit;font:inherit}.studio-ai-form textarea{min-height:110px;resize:vertical}.studio-ai-form .checkbox-field{flex-direction:row;align-items:center}.studio-ai-form small{color:var(--muted);font-size:11px;line-height:1.7}.studio-ai-form .button{justify-self:start}.studio-ai-security{margin-top:35px;border-top:1px solid var(--border);padding-top:23px;font-size:13px;line-height:1.8}@media(max-width:650px){.studio-ai-form{grid-template-columns:1fr}}`}</style>
    <span className="micro-label">WEBSITE ASSISTANT</span><h2>Make KITTY helpful.</h2><p>Adjust how KITTY introduces itself, explains your work and guides visitors.</p>
    <div className="studio-ai-status"><span>AI connection: <strong>{ready.connection?"Configured":"Setup needed"}</strong></span><span>Cloudflare verification: <strong>{ready.verification?"Configured":"Setup needed"}</strong></span></div>
    {error&&<p className="form-error" role="alert">{error}</p>}
    <form className="studio-ai-form" onSubmit={save}>
      <label className="wide checkbox-field"><input type="checkbox" checked={settings.enabled} disabled={!ready.connection||!ready.verification} onChange={event=>setSettings({...settings,enabled:event.target.checked})}/>Show KITTY AI on the public website</label>
      <label className="wide">Assistant name<input required minLength={2} maxLength={40} value={settings.title} onChange={event=>setSettings({...settings,title:event.target.value})}/></label>
      <label className="wide">Welcome message<textarea required minLength={10} maxLength={400} value={settings.greeting} onChange={event=>setSettings({...settings,greeting:event.target.value})}/></label>
      <label className="wide">Tone and instructions<textarea maxLength={2500} value={settings.guidance} onChange={event=>setSettings({...settings,guidance:event.target.value})}/><small>Explain your preferred tone and how to guide visitors. KITTY uses your published website content and follows fixed privacy and accuracy limits. This changes instructions, not model training.</small></label>
      <label>Messages per conversation<input type="number" required min={3} max={20} value={settings.max_messages} onChange={event=>setSettings({...settings,max_messages:Number(event.target.value)})}/><small>The conversation interface caps messages here. Server limits remain 12 questions per visitor per hour, 30 per day and 150 total per day.</small></label>
      <label>Reply length<input type="number" required min={128} max={600} step={1} value={settings.max_output_tokens} onChange={event=>setSettings({...settings,max_output_tokens:Number(event.target.value)})}/><small>Lower values keep replies short and use less of the daily AI allowance.</small></label>
      <label>Response variation<input type="number" required min={.1} max={.8} step={.05} value={settings.temperature} onChange={event=>setSettings({...settings,temperature:Number(event.target.value)})}/><small>Lower values give more consistent replies.</small></label>
      <button type="submit" className="button button-gold wide" disabled={saving}>{saving?"Saving…":"Save KITTY AI settings"}</button>
    </form>
    <div className="studio-ai-security"><h3>Studio security</h3><p>Google sign-in: <strong>{security.googleReady?"Approved owner account only" : "Google setup needed"}</strong></p><p>The website assistant has no access to Studio, private app memories or unpublished content. Its usage is limited separately from the Android app.</p></div>
  </section>;
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ASSISTANT_OPEN_EVENT, takeAssistantIntent } from "@/lib/assistant-events";
import { usePathname } from "next/navigation";
import { ArrowUp, MessageCircle, RotateCcw, X } from "lucide-react";
import { Turnstile } from "@/components/kitty/turnstile";
import { websiteAssistantSuggestions, type WebsiteAssistantMessage, type WebsiteAssistantPublic, type WebsiteAssistantReply, type WebsiteAssistantSource } from "@/lib/website-assistant-types";

function subscribeFeedbackPreference() { return () => {}; }
function feedbackPreference() { try { return sessionStorage.getItem("kitty-feedback-dismissed") === "yes"; } catch { return false; } }

type DisplayMessage = WebsiteAssistantMessage & { id: string; sources?: WebsiteAssistantSource[] };

export function WebsiteAssistant({ settings, turnstileSiteKey }: { settings: WebsiteAssistantPublic; turnstileSiteKey?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedbackDismissed,setFeedbackDismissed]=useState(false);
  const savedFeedbackDismissed=useSyncExternalStore(subscribeFeedbackPreference,feedbackPreference,()=>false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationRevision, setVerificationRevision] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const conversation = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const limitReached = messages.filter(message => message.role === "user").length >= settings.max_messages;

  useEffect(() => {
    const receive = () => {
      const question = takeAssistantIntent();
      if (question === null) return;
      setOpen(true);
      if (question) setInput(question);
    };
    window.addEventListener(ASSISTANT_OPEN_EVENT, receive);
    receive();
    return () => window.removeEventListener(ASSISTANT_OPEN_EVENT, receive);
  }, []);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (!open) return;
    field.current?.focus({ preventScroll: true });
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, [open]);
  useEffect(() => {
    if (conversation.current) conversation.current.scrollTop = conversation.current.scrollHeight;
  }, [messages, busy]);

  if (!settings.enabled || pathname.startsWith("/admins") || pathname.startsWith("/kitten") || pathname.startsWith("/auth/") || pathname === "/payments") return null;

  function close() { setOpen(false); trigger.current?.focus(); }
  function reset() { if (busy) return; setMessages([]); setError(""); setInput(""); field.current?.focus(); }

  async function send(value: string) {
    const question = value.trim();
    if (!question || busy || limitReached || (turnstileSiteKey && !turnstileToken)) return;
    if (question.length > 800) { setError("Keep your question to 800 characters or fewer."); return; }
    const controller = new AbortController();
    request.current = controller;
    const userMessage: DisplayMessage = { id: crypto.randomUUID(), role: "user", content: question };
    const history = messages.slice(-6).map(({ role, content }) => ({ role, content: content.slice(0, 1000) }));
    setMessages(current => [...current, userMessage]);
    setInput(""); setError(""); setBusy(true);
    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history, page: pathname, turnstileToken }),
        signal: controller.signal,
      });
      const data = await response.json() as WebsiteAssistantReply & { error?: string };
      if (!response.ok) throw new Error(data.error || "KITTY could not reply just now. Please try again.");
      if (typeof data.answer !== "string" || !data.answer.trim()) throw new Error("KITTY returned an empty reply. Please try again.");
      const sources = Array.isArray(data.sources) ? data.sources.filter(source => typeof source.label === "string" && typeof source.href === "string" && /^\/(?!\/)[a-z0-9/#?=&._-]*$/i.test(source.href)).slice(0, 3) : [];
      setMessages(current => [...current, { id: crypto.randomUUID(), role: "assistant", content: data.answer, sources }]);
    } catch (failure) {
      if (!controller.signal.aborted) {
        setError(failure instanceof Error ? failure.message : "KITTY could not reply just now.");
        setInput(question);
        setMessages(current => current.filter(message => message.id !== userMessage.id));
      }
    } finally {
      if (request.current === controller) { request.current = null; setBusy(false); }
      setTurnstileToken("");
      setVerificationRevision(current => current + 1);
    }
  }

  return <aside className="website-assistant" aria-label="KITTY AI website guide">
    {open && <section id="kitty-website-assistant" className="website-assistant-panel" aria-labelledby="kitty-assistant-title">
      <header className="website-assistant-header">
        <Image src="/brand/monogram-small-v1.webp" alt="" width={36} height={36} />
        <div><h2 id="kitty-assistant-title">{settings.title}</h2><p>Your guide to KITTY CORP</p></div>
        <button type="button" onClick={reset} disabled={busy || messages.length === 0} className="website-assistant-icon" aria-label="Start a new conversation" title="Start a new conversation"><RotateCcw size={17} /></button>
        <button type="button" onClick={close} className="website-assistant-icon" aria-label="Close KITTY AI"><X size={19} /></button>
      </header>
      <div ref={conversation} className="website-assistant-conversation" role="log" aria-label="Conversation with KITTY AI" aria-live="polite" aria-relevant="additions">
        <div className="website-assistant-message is-assistant"><span className="website-assistant-speaker">KITTY AI</span><p>{settings.greeting}</p></div>
        {!feedbackDismissed && !savedFeedbackDismissed && messages.some(message => message.role === "assistant") && <div className="website-assistant-message is-assistant"><p>Enjoying KITTY AI? Visit KITTY CORP and tell us what you think. Your feedback helps us improve.</p><a href="/contact?subject=Review" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Visit KITTY CORP &amp; share feedback</a><button type="button" className="website-assistant-icon" aria-label="Dismiss feedback invitation" onClick={()=>{setFeedbackDismissed(true);try{sessionStorage.setItem("kitty-feedback-dismissed","yes");}catch{/* Session storage can be unavailable in private browsers. */}}}><X size={16}/></button></div>}
        {messages.length === 0 && <div className="website-assistant-suggestions" aria-label="Suggested questions">{websiteAssistantSuggestions.map(question => <button type="button" key={question} disabled={busy || !!(turnstileSiteKey && !turnstileToken)} onClick={() => void send(question)}>{question}<span aria-hidden="true">↗</span></button>)}</div>}
        {messages.map(message => <div key={message.id} className={`website-assistant-message is-${message.role}`}><span className="website-assistant-speaker">{message.role === "assistant" ? "KITTY AI" : "You"}</span><p>{message.content}</p>{message.sources && message.sources.length > 0 && <div className="website-assistant-sources">{message.sources.map(source => <Link key={source.href} href={source.href} onClick={close}>{source.label}<span aria-hidden="true">↗</span></Link>)}</div>}</div>)}
        {busy && <p className="website-assistant-thinking" role="status"><span aria-hidden="true" />KITTY is thinking…</p>}
      </div>
      <div className="website-assistant-compose">
        <Turnstile action="assistant" onToken={setTurnstileToken} resetKey={verificationRevision} siteKey={turnstileSiteKey} />
        {error && <p className="website-assistant-error" role="alert">{error}</p>}
        {limitReached && <p className="website-assistant-error" role="status">That’s the website guide’s limit for this conversation. <a href="/contact?subject=Review" target="_blank" rel="noopener noreferrer">Share honest feedback</a> or <a href="/memberships" target="_blank" rel="noopener noreferrer">view KITTY app plans</a>. App memberships do not increase this website guide’s allowance.</p>}
        <form onSubmit={event => { event.preventDefault(); void send(input); }}>
          <label htmlFor="kitty-assistant-input" className="sr-only">Your question for KITTY AI</label>
          <textarea ref={field} id="kitty-assistant-input" value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(input); } }} rows={2} maxLength={800} placeholder="Ask about products or your project…" disabled={busy || limitReached} />
          <button type="submit" aria-label="Send question" disabled={busy || limitReached || !input.trim() || !!(turnstileSiteKey && !turnstileToken)}><ArrowUp size={19} /></button>
        </form>
        <p className="website-assistant-disclosure">AI answers can be imperfect. Please don’t share private details. <Link href="/privacy">Privacy</Link></p>
      </div>
    </section>}
    <button ref={trigger} type="button" className="website-assistant-trigger" aria-expanded={open} aria-controls="kitty-website-assistant" onClick={() => { if (open) close(); else setOpen(true); }}><Image src="/brand/monogram-small-v1.webp" alt="" width={25} height={25} /><span>{settings.title}</span>{open ? <X size={17} /> : <MessageCircle size={17} />}</button>
  </aside>;
}

"use client";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { openWebsiteAssistant } from "@/lib/assistant-events";
export function AssistantEntry({ question = "", children, className = "button button-outline" }: { question?: string; children?: React.ReactNode; className?: string }) {
  return <button type="button" className={className} onClick={() => openWebsiteAssistant(question)}>
    <MessageCircle size={17} aria-hidden="true" />{children || "Ask KITTY AI"}<ArrowUpRight size={16} aria-hidden="true" />
  </button>;
}

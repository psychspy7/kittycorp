"use client";
import { useEffect, useRef, useState } from "react";

type WidgetAPI = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};
declare global { interface Window { turnstile?: WidgetAPI; } }

let script: Promise<void> | undefined;
function loadScript() {
  if (window.turnstile) return Promise.resolve();
  if (!script) script = new Promise<void>((resolve, reject) => {
    const element = document.createElement("script");
    element.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    element.async = true;
    element.onload = () => resolve();
    element.onerror = () => { script = undefined; reject(new Error("Security check could not load.")); };
    document.head.appendChild(element);
  });
  return script;
}

type Props = {
  action: string;
  onToken: (token: string) => void;
  resetKey?: number;
  siteKey?: string;
};

export function Turnstile({ action, onToken, resetKey = 0, siteKey }: Props) {
  const element = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  useEffect(() => { callback.current = onToken; }, [onToken]);
  const [config, setConfig] = useState<{ siteKey: string; enabled: boolean } | null>(siteKey ? { siteKey, enabled: true } : null);
  const [error, setError] = useState("");
  const effectiveConfig = siteKey ? { siteKey, enabled: true } : config;
  useEffect(() => {
    if (siteKey) return;
    const controller = new AbortController();
    fetch("/api/security/turnstile", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw Error("Security check unavailable.");
        return response.json() as Promise<{ siteKey: string; enabled: boolean }>;
      })
      .then((value: { siteKey: string; enabled: boolean }) => setConfig(value))
      .catch(() => { if (!controller.signal.aborted) setError("Security check could not load. Please refresh and try again."); });
    return () => controller.abort();
  }, [siteKey]);

  useEffect(() => {
    if (!effectiveConfig?.enabled) return;
    callback.current("");
    if (!effectiveConfig.siteKey) return;
    let active = true;
    let widget: string | undefined;
    let size: "compact" | "flexible" | undefined;
    let observer: ResizeObserver | undefined;
    loadScript().then(() => {
      if (!active || !element.current || !window.turnstile) return;
      setError("");
      const render = () => {
        if (!active || !element.current || !window.turnstile) return;
        const nextSize = element.current.clientWidth < 300 ? "compact" : "flexible";
        if (widget && nextSize === size) return;
        if (widget) window.turnstile.remove(widget);
        size = nextSize;
        callback.current("");
        widget = window.turnstile.render(element.current, {
        sitekey: effectiveConfig.siteKey,
        action,
        theme: "light",
        size,
        appearance: "interaction-only",
        callback: (token: string) => { if (active) { setError(""); callback.current(token); } },
        "expired-callback": () => {
          callback.current("");
          if (widget && window.turnstile) window.turnstile.reset(widget);
        },
        "error-callback": () => { if (active) { callback.current(""); setError("Please retry the security check or refresh this page."); } },
        });
      };
      render();
      observer = new ResizeObserver(render);
      observer.observe(element.current);
    }).catch(() => { if (active) setError("Security check could not load. Please refresh and try again."); });
    return () => {
      active = false;
      observer?.disconnect();
      if (widget && window.turnstile) window.turnstile.remove(widget);
    };
  }, [effectiveConfig?.enabled, effectiveConfig?.siteKey, action, resetKey]);

  if (effectiveConfig && !effectiveConfig.enabled) return null;
  return <div className="security-check" style={{ marginBlock: "12px", maxWidth: "100%" }}>
    <div ref={element} />
    {(error || (effectiveConfig?.enabled && !effectiveConfig.siteKey)) && <p className="form-error" role="alert">{error || "Security verification is being configured. Please try again shortly."}</p>}
  </div>;
}

"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

type WidgetAPI = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};
declare global { interface Window { turnstile?: WidgetAPI; } }

type Props = {
  action: string;
  onToken: (token: string) => void;
  onStatusChange?: (status: TurnstileStatus) => void;
  resetKey?: number;
  siteKey?: string;
  appearance?: "always" | "execute" | "interaction-only";
};

export type TurnstileStatus = "loading" | "ready" | "verified" | "disabled" | "error";

export function Turnstile({ action, onToken, onStatusChange, resetKey = 0, siteKey, appearance = "always" }: Props) {
  const element = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  const statusCallback = useRef(onStatusChange);
  useEffect(() => { callback.current = onToken; }, [onToken]);
  useEffect(() => { statusCallback.current = onStatusChange; }, [onStatusChange]);
  const reportStatus = useCallback((status: TurnstileStatus) => statusCallback.current?.(status), []);
  const [config, setConfig] = useState<{ siteKey: string; enabled: boolean } | null>(siteKey ? { siteKey, enabled: true } : null);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const enabled = siteKey ? true : config?.enabled;
  const activeSiteKey = siteKey || config?.siteKey || "";

  useEffect(() => {
    if (siteKey) return;
    const controller = new AbortController();
    reportStatus("loading");
    fetch("/api/security/turnstile", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw Error("Security check unavailable.");
        return response.json() as Promise<{ siteKey: string; enabled: boolean }>;
      })
      .then((value: { siteKey: string; enabled: boolean }) => {
        if (typeof value.enabled !== "boolean" || typeof value.siteKey !== "string") throw Error("Security check unavailable.");
        if (controller.signal.aborted) return;
        setError("");
        setConfig(value);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Security check could not load. Please refresh and try again.");
          reportStatus("error");
        }
      });
    return () => controller.abort();
  }, [siteKey, reportStatus]);

  useEffect(() => {
    if (enabled === undefined) { reportStatus("loading"); return; }
    if (!enabled) { reportStatus("disabled"); return; }
    callback.current("");
    if (!activeSiteKey) {
      setError("Security verification is being configured. Please try again shortly.");
      reportStatus("error");
      return;
    }
    if (!scriptReady) { reportStatus("loading"); return; }
    let active = true;
    let widget: string | undefined;
    let observer: ResizeObserver | undefined;
    let themeObserver: MutationObserver | undefined;
    try {
      if (!element.current || !window.turnstile) throw Error("Cloudflare verification did not initialise.");
      setError("");
      const render = () => {
        if (!active || !element.current || !window.turnstile) return;
        const size = element.current.clientWidth < 300 ? "compact" : "flexible";
        const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
        if (widget) window.turnstile.remove(widget);
        callback.current("");
        reportStatus("ready");
        widget = window.turnstile.render(element.current, {
          sitekey: activeSiteKey,
          action,
          theme,
          size,
          appearance,
          callback: (token: string) => {
            if (active) {
              setError("");
              callback.current(token);
              reportStatus("verified");
            }
          },
          "expired-callback": () => {
            callback.current("");
            reportStatus("ready");
            if (widget && window.turnstile) window.turnstile.reset(widget);
          },
          "error-callback": () => {
            if (active) {
              callback.current("");
              setError("Please retry the security check or refresh this page.");
              reportStatus("error");
            }
          },
        });
      };
      render();
      if (typeof ResizeObserver !== "undefined" && element.current) {
        observer = new ResizeObserver(render);
        observer.observe(element.current);
      }
      themeObserver = new MutationObserver(render);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    } catch {
      setError("Security check could not initialise. Please refresh and try again.");
      reportStatus("error");
    }
    return () => {
      active = false;
      observer?.disconnect();
      themeObserver?.disconnect();
      if (widget && window.turnstile) window.turnstile.remove(widget);
    };
  }, [enabled, activeSiteKey, action, appearance, resetKey, reportStatus, scriptReady]);

  if (enabled === false) return null;
  return (
    <div className="security-check" style={{ marginBlock: "12px", maxWidth: "100%" }}>
      {enabled && activeSiteKey && (
        <Script
          id="kitty-cloudflare-turnstile"
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={() => {
            setScriptReady(false);
            setError("Cloudflare security check could not load. Disable content blockers for this site or refresh and try again.");
            reportStatus("error");
          }}
        />
      )}
      {enabled && !scriptReady && !error && (
        <p className="text-xs text-[#62676D]" role="status">Loading security check…</p>
      )}
      <div ref={element} />
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}

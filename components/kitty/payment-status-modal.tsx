"use client";

import { useEffect } from "react";
import { Check, X, Loader2, ArrowRight, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

export type PaymentModalState = "idle" | "pending" | "success" | "failed";

export interface PaymentStatusModalProps {
  state: PaymentModalState;
  title?: string;
  message?: string;
  amount?: string;
  reference?: string;
  error?: string;
  onRetry?: () => void;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function PaymentStatusModal({
  state,
  title,
  message,
  amount,
  reference,
  error,
  onRetry,
  onClose,
  actionLabel,
  onAction,
}: PaymentStatusModalProps) {
  useEffect(() => {
    if (state === "idle") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state !== "pending") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, onClose]);

  if (state === "idle") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <style jsx global>{`
        @keyframes kc-stroke-draw {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes kc-scale-pop {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes kc-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-6deg); }
          75% { transform: rotate(6deg); }
        }
        @keyframes kc-pulse-subtle {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.04); opacity: 1; }
        }
        .animate-kc-pop {
          animation: kc-scale-pop 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-kc-check {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: kc-stroke-draw 0.6s 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-kc-wiggle {
          animation: kc-wiggle 0.5s ease-in-out;
        }
      `}</style>

      <div
        className="relative w-full max-w-md rounded-3xl bg-[#FBFAF7] border border-[#D9D6CF] shadow-[0_24px_64px_rgba(0,0,0,0.28)] p-6 sm:p-8 overflow-hidden text-center animate-kc-pop select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle background ambient glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-500 ${
            state === "success"
              ? "bg-emerald-400"
              : state === "failed"
              ? "bg-rose-400"
              : "bg-blue-400"
          }`}
        />

        {/* =========================================================================
            STATE 1: SUCCESS (Green Animated Checkmark + Cute Feedback)
            ========================================================================= */}
        {state === "success" && (
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Vector Checkmark */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/15 animate-ping opacity-30" />
              <svg
                className="w-10 h-10 text-emerald-600 drop-shadow-sm"
                viewBox="0 0 52 52"
                fill="none"
              >
                <circle
                  cx="26"
                  cy="26"
                  r="23"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="opacity-30"
                />
                <path
                  d="M15 27l8 8 16-16"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-kc-check"
                />
              </svg>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono tracking-wider uppercase font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PAYMENT CONFIRMED</span>
            </div>

            <h3
              id="payment-modal-title"
              className="text-2xl sm:text-[26px] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-2"
            >
              {title || "Thank You for Your Purchase!"}
            </h3>

            <p className="text-sm sm:text-[15px] text-[#62676D] font-light leading-relaxed mb-6">
              {message ||
                "Your payment was received successfully. You are officially part of our journey, and our engineers and robots are doing a happy dance! 🐾✨"}
            </p>

            {/* Receipt Summary Card */}
            {(amount || reference) && (
              <div className="w-full bg-[#F5F2EA] border border-[#D9D6CF] rounded-2xl p-4 mb-6 text-left text-xs font-mono text-[#292D31] space-y-2">
                {amount && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#73777C]">Amount Paid:</span>
                    <strong className="text-[#191B1D] text-sm font-semibold">{amount}</strong>
                  </div>
                )}
                {reference && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#73777C]">Payment ID:</span>
                    <code className="text-[#2457D6] bg-white px-2 py-0.5 rounded border border-[#D9D6CF]">
                      {reference}
                    </code>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3">
              {onAction && actionLabel && (
                <button
                  type="button"
                  onClick={onAction}
                  className="w-full py-3.5 px-5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-sm font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.25)] flex items-center justify-center gap-2"
                >
                  <span>{actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className={`w-full py-3.5 px-5 rounded-full border border-[#D9D6CF] bg-white hover:bg-[#F5F2EA] text-[#191B1D] text-sm font-medium transition-colors ${
                  !onAction ? "bg-[#2457D6] !text-white !border-transparent hover:!bg-[#1D46B0]" : ""
                }`}
              >
                {onAction ? "Done" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: FAILED / CANCELLED (Red Animated Cross + Retry Option)
            ========================================================================= */}
        {state === "failed" && (
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Vector Cross */}
            <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5 relative animate-kc-wiggle">
              <svg
                className="w-10 h-10 text-rose-600 drop-shadow-sm"
                viewBox="0 0 52 52"
                fill="none"
              >
                <circle
                  cx="26"
                  cy="26"
                  r="23"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="opacity-30"
                />
                <path
                  d="M17 17l18 18M35 17L17 35"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="animate-kc-check"
                />
              </svg>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-mono tracking-wider uppercase font-semibold mb-3">
              <X className="w-3.5 h-3.5" />
              <span>TRANSACTION INCOMPLETE</span>
            </div>

            <h3
              id="payment-modal-title"
              className="text-2xl sm:text-[26px] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-2"
            >
              {title || "Oopsy! Payment Failed"}
            </h3>

            <p className="text-sm sm:text-[15px] text-[#62676D] font-light leading-relaxed mb-4">
              {message ||
                "We could not complete your payment or the gateway window was closed. No money was charged to your account."}
            </p>

            {error && (
              <div className="w-full bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs mb-6 font-mono text-left">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3 mt-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="w-full py-3.5 px-5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-sm font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.25)] flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Payment</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 px-5 rounded-full border border-[#D9D6CF] bg-white hover:bg-[#F5F2EA] text-[#191B1D] text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 3: PENDING (Animated Clean Loader)
            ========================================================================= */}
        {state === "pending" && (
          <div className="relative z-10 flex flex-col items-center py-4">
            {/* Animated Pulsing Rings + Spinner */}
            <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 relative">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <ShieldCheck className="w-8 h-8 text-[#2457D6]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-mono tracking-wider uppercase font-semibold mb-3">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>VERIFYING PAYMENT</span>
            </div>

            <h3
              id="payment-modal-title"
              className="text-2xl sm:text-[26px] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-2"
            >
              {title || "Verifying Your Payment..."}
            </h3>

            <p className="text-sm sm:text-[15px] text-[#62676D] font-light leading-relaxed max-w-sm mb-6">
              {message ||
                "Communicating securely with the payment provider. Please keep this tab open while we confirm your transaction."}
            </p>

            {/* Shimmer progress bar */}
            <div className="w-full h-1.5 bg-[#E9E6E0] rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 w-1/3 bg-[#2457D6] rounded-full animate-[kc-slide_1.5s_infinite_linear]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

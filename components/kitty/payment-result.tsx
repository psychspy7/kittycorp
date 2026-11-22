type PaymentResultProps = { status: "success" | "failure"; title: string; description: string; reference?: string; };
export function PaymentResult({ status, title, description, reference }: PaymentResultProps) {
  const success = status === "success";
  return (
    <section className={`payment-result payment-result--${status}`} role={success ? "status" : "alert"} aria-live={success ? "polite" : "assertive"}>
      <div className="payment-result__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" focusable="false">
          <circle className="payment-result__circle" cx="32" cy="32" r="29" />
          <path className="payment-result__symbol" d={success ? "M18 33l9 9 20-21" : "M21 21l22 22M43 21L21 43"} />
        </svg>
      </div>
      <span className="payment-result__eyebrow">{success ? "PAYMENT CONFIRMED" : "PAYMENT NOT COMPLETED"}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {reference && <p className="payment-result__reference">Payment reference <code>{reference}</code></p>}
    </section>
  );
}

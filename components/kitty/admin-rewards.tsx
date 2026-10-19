"use client";

import { useState, type FormEvent } from "react";
import { studioRequest } from "./studio-content-helpers";

type Reward = { id: string; percent: number; expires_at: string; redeemed_at: string | null; redeemed_note: string; quote_id: string | null };

export default function AdminRewards() {
  const [code, setCode] = useState(""), [quoteId, setQuoteId] = useState(""), [note, setNote] = useState("");
  const [reward, setReward] = useState<Reward | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState(""), [confirmed, setConfirmed] = useState(false);
  const [checkedAt, setCheckedAt] = useState(0);
  async function check(event?: FormEvent, redeem = false) {
    event?.preventDefault(); setBusy(true); setError("");
    try {
      const data = await studioRequest<{ reward: Reward | null }>("/api/admin/rewards", "POST", { code, redeem, ...(quoteId.trim() ? { quoteId: quoteId.trim().replace(/^Q-/, "") } : {}), note });
      setReward(data.reward); setConfirmed(false); setCheckedAt(Date.now());
      if (!data.reward) setError("No issued reward matches this code.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not check this code."); }
    finally { setBusy(false); }
  }
  const available = reward && !reward.redeemed_at && new Date(reward.expires_at).getTime() > checkedAt;
  return <section className="studio-rewards"><div className="panel-heading"><h2>Game reward codes</h2><p>Verify a customer’s game reward code before payment. Apply it once to an unlocked website quote, or record a product redemption only after arranging it through the product’s own access system.</p></div>
    <form onSubmit={event => void check(event)}><div className="form-field"><label htmlFor="reward-code">Customer’s code</label><input id="reward-code" value={code} maxLength={80} required autoComplete="off" onChange={event => { setCode(event.target.value); setReward(null); }}/></div><button className="button button-outline" disabled={busy}>{busy ? "Checking…" : "Check code"}</button></form>
    {reward && <div className="studio-reward-result"><span className="quiet-status">{reward.redeemed_at ? "USED" : available ? "AVAILABLE" : "EXPIRED"}</span><h3>{reward.percent}% reward</h3><p>Expires {new Date(reward.expires_at).toLocaleString()}. {reward.redeemed_at && `Used ${new Date(reward.redeemed_at).toLocaleString()}.`}</p>{reward.redeemed_note && <p>{reward.redeemed_note}</p>}
      {available && <><div className="form-field"><label htmlFor="reward-quote">Website quote ID (optional, without Q-)</label><input id="reward-quote" value={quoteId} maxLength={38} onChange={event => setQuoteId(event.target.value)}/><p className="studio-field-help">For a website, copy the quote UUID from Project quotes. The server applies this offer to the quote and replaces a smaller payment discount. An order already in progress cannot be changed.</p></div><div className="form-field"><label htmlFor="reward-note">Redemption / order note</label><textarea id="reward-note" rows={3} minLength={5} maxLength={300} value={note} onChange={event => setNote(event.target.value)}/></div><label className="studio-check"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)}/>I have confirmed the eligible quote or product order. For products without a website quote, the discount and access are handled in that product’s system.</label><button className="button button-gold" type="button" disabled={busy || !confirmed || note.trim().length < 5} onClick={() => void check(undefined, true)}>{quoteId ? "Apply to quote & use code" : "Record manual product redemption"}</button></>}
    </div>}
    {error && <p role="alert" className="form-error">{error}</p>}
  </section>;
}

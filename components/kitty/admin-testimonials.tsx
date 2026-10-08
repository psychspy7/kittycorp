"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { testimonialSchema, type Testimonial } from "@/lib/testimonials";
import { studioRequest } from "./studio-content-helpers";

const blank: Testimonial = {id: "new", reviewer_name: "", reviewer_role: "", company: "", quote: "", source_url: "", permission_confirmed: false, published: false, sort_order: 0};

export default function AdminTestimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [draft, setDraft] = useState<Testimonial | null>(null);
  const [remove, setRemove] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try { const data = await studioRequest<{testimonials: Testimonial[]}>("/api/admin/testimonials"); setReviews(data.testimonials); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Couldn’t load reviews."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    let active = true;
    void studioRequest<{testimonials: Testimonial[]}>("/api/admin/testimonials")
      .then(data => { if (active) setReviews(data.testimonials); })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : "Couldn’t load reviews."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;
    const parsed = testimonialSchema.safeParse(draft);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || "Check the review details."); return; }
    setBusy(true); setError("");
    try {
      await studioRequest(draft.id === "new" ? "/api/admin/testimonials" : `/api/admin/testimonials/${draft.id}`, draft.id === "new" ? "POST" : "PATCH", parsed.data);
      setDraft(null); toast.success(parsed.data.published ? "Review published. Refresh the website to see it." : "Private review draft saved."); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn’t save the review."); }
    finally { setBusy(false); }
  }
  async function deleteReview() {
    if (!remove) return;
    setBusy(true);
    try { await studioRequest(`/api/admin/testimonials/${remove.id}`, "DELETE"); setRemove(null); toast.success("Review removed."); await load(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Couldn’t remove the review."); }
    finally { setBusy(false); }
  }
  const field = (key: "reviewer_name" | "reviewer_role" | "company" | "source_url", label: string, max: number) => draft && <div className="form-field"><label htmlFor={`review-${key}`}>{label}</label><input id={`review-${key}`} type={key === "source_url" ? "url" : "text"} required={key === "reviewer_name"} minLength={key === "reviewer_name" ? 2 : undefined} maxLength={max} value={draft[key]} disabled={busy} onChange={e => setDraft({...draft, [key]: e.target.value})}/></div>;

  return <>
    <div className="admin-content-toolbar"><div className="panel-heading"><h2>Reviews & testimonials</h2><p>Add genuine feedback from clients or product users, in their own words. Drafts stay private. The first six published reviews appear on the homepage and Services page.</p></div><button className="button button-gold" onClick={() => { setError(""); setDraft({...blank, sort_order: reviews.length}); }}>Add a review</button></div>
    {error && !draft && <p className="form-error" role="alert">{error} <button onClick={() => void load()}>Try again</button></p>}
    {loading ? <p className="empty-message">Loading reviews…</p> : reviews.length === 0 ? <div className="studio-reviews-empty"><h3>Ready when you have a real quote.</h3><p>Ask a client or someone who has used your product for honest feedback and permission to share it. Add their name, role and a public source link if available. The website keeps this section hidden until you publish.</p></div> : <div className="studio-review-list">{reviews.map(review => <article key={review.id}><div><span className="quiet-status">{review.published ? "PUBLISHED" : "PRIVATE DRAFT"}</span><blockquote>{review.quote}</blockquote><h3>{review.reviewer_name}</h3><p>{[review.reviewer_role, review.company].filter(Boolean).join(" · ") || "Product / project feedback"}</p>{review.source_url && <a className="text-link" href={review.source_url} target="_blank" rel="noopener noreferrer">View source ↗</a>}</div><div className="studio-row-actions"><button className="button button-outline" onClick={() => { setError(""); setDraft(structuredClone(review)); }}>Edit</button><button className="text-link" onClick={() => setRemove(review)}>Remove</button></div></article>)}</div>}
    <Dialog open={!!draft} onOpenChange={open => { if (!open && !busy) { setDraft(null); setError(""); } }}><DialogContent className="editor-dialog studio-content-editor"><DialogTitle>{draft?.id === "new" ? "Add a genuine review" : "Edit review"}</DialogTitle><DialogDescription>Use the reviewer’s actual words and only publish with their permission.</DialogDescription>{draft && <form onSubmit={save}>
      <div className="form-field"><label htmlFor="review-quote">Their review</label><textarea id="review-quote" rows={6} required minLength={20} maxLength={1500} value={draft.quote} disabled={busy} onChange={e => setDraft({...draft, quote: e.target.value})}/></div>
      {field("reviewer_name", "Reviewer’s name", 100)}{field("reviewer_role", "Role (optional)", 120)}{field("company", "Company or product used (optional)", 160)}{field("source_url", "Public source link (optional)", 1000)}
      <p className="studio-field-help">Link to the original public review or case study when available. Keep private messages and email addresses out of the quote.</p>
      <div className="form-field"><label htmlFor="review-order">Display order (lower appears first)</label><input id="review-order" type="number" required min={0} max={1000} value={draft.sort_order} disabled={busy} onChange={e => setDraft({...draft, sort_order: Number(e.target.value)})}/></div>
      <label className="studio-check"><input type="checkbox" checked={draft.permission_confirmed} disabled={busy} onChange={e => setDraft({...draft, permission_confirmed: e.target.checked, published: e.target.checked && draft.published})}/>This is genuine feedback, and I have the reviewer’s permission to publish it.</label>
      <label className="studio-check"><input type="checkbox" checked={draft.published} disabled={busy || !draft.permission_confirmed} onChange={e => setDraft({...draft, published: e.target.checked})}/>Publish on the website</label>
      {error && <p className="form-error" role="alert">{error}</p>}<button className="button button-gold" disabled={busy}>{busy ? "Saving…" : draft.published ? "Save & publish review" : "Save private draft"}</button>
    </form>}</DialogContent></Dialog>
    <AlertDialog open={!!remove} onOpenChange={open => { if (!open && !busy) setRemove(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove this review?</AlertDialogTitle><AlertDialogDescription>This removes {remove?.reviewer_name}’s review from Studio and the website. You can unpublish it instead to keep a private copy.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy}>Keep review</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={e => { e.preventDefault(); void deleteReview(); }}>Remove review</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </>;
}

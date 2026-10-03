"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, LoaderCircle, Pencil, Plus, Rocket, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { fileSize, launchHref, MAX_APK_BYTES, type Launch } from "@/lib/launches";

type Draft = Pick<Launch, "slug" | "name" | "tagline" | "description" | "release_notes" | "version" | "android" | "apk_path" | "apk_sha256" | "apk_bytes" | "published" | "show_popup">;
const emptyDraft: Draft = { slug: "", name: "", tagline: "", description: "", release_notes: "", version: "1.0.0", android: "Android 7.0+", apk_path: null, apk_sha256: null, apk_bytes: null, published: false, show_popup: true };
async function api(url: string, method = "GET", value?: unknown) {
  const res = await fetch(url, { method, ...(value !== undefined ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) } : {}) });
  if (res.status === 401) { window.location.reload(); throw new Error("Please sign in again."); }
  const data = await res.json() as { error?: string; launches: Launch[]; path: string; uploadUrl: string };
  if (!res.ok) throw new Error(data.error || "The request failed. Please try again.");
  return data;
}
function upload(url: string, file: File, progress: (percent: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.timeout = 300000;
    xhr.setRequestHeader("Content-Type", "application/vnd.android.package-archive");
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (event) => { if (event.lengthComputable) progress(Math.round(event.loaded / event.total * 100)); };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed. Please check your connection and try again."));
    xhr.onerror = xhr.ontimeout = () => reject(new Error("Upload interrupted. Please try again."));
    xhr.send(file);
  });
}

export default function AdminLaunches() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editor, setEditor] = useState<Launch | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formError, setFormError] = useState("");
  const [remove, setRemove] = useState<Launch | null>(null);
  const pendingUpload = useRef<string | null>(null);
  const load = useCallback(async () => {
    try { setLaunches((await api("/api/admin/launches")).launches); setLoadError(""); }
    catch (error) { setLoadError(error instanceof Error ? error.message : "Could not load launches."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    let active = true;
    void api("/api/admin/launches")
      .then((data) => { if (active) setLaunches(data.launches); })
      .catch((error) => { if (active) setLoadError(error instanceof Error ? error.message : "Could not load launches."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function discardUpload() {
    const path = pendingUpload.current;
    pendingUpload.current = null;
    if (path) { try { await api("/api/admin/launches/upload", "DELETE", { path }); } catch { toast.error("An unused upload remains in storage. You can retry deleting it later."); } }
  }
  function edit(launch?: Launch) {
    setDraft(launch ? { slug: launch.slug, name: launch.name, tagline: launch.tagline, description: launch.description, release_notes: launch.release_notes, version: launch.version, android: launch.android, apk_path: launch.apk_path, apk_sha256: launch.apk_sha256, apk_bytes: launch.apk_bytes, published: launch.published, show_popup: launch.show_popup } : { ...emptyDraft });
    setFormError(""); setEditor(launch || "new");
  }
  async function pickApk(file?: File) {
    if (!file) return;
    setFormError("");
    if (!file.name.toLowerCase().endsWith(".apk") || file.size < 4 || file.size > MAX_APK_BYTES) { setFormError("Choose an APK file up to 50 MB."); return; }
    setUploading(true); setProgress(0);
    try {
      const bytes = await file.arrayBuffer();
      const signature = new Uint8Array(bytes, 0, 4);
      if (signature[0] !== 0x50 || signature[1] !== 0x4b || signature[2] !== 3 || signature[3] !== 4) throw new Error("This file is not an Android APK.");
      const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map((byte) => byte.toString(16).padStart(2, "0")).join("");
      const target = await api("/api/admin/launches/upload", "POST", { filename: file.name, bytes: file.size });
      await upload(target.uploadUrl, file, setProgress);
      await discardUpload();
      pendingUpload.current = target.path;
      setDraft((current) => ({ ...current, apk_path: target.path, apk_sha256: hash, apk_bytes: file.size }));
      toast.success("APK uploaded. Save your launch to finish.");
    } catch (error) { setFormError(error instanceof Error ? error.message : "Upload failed."); }
    finally { setUploading(false); }
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); if (!editor || uploading) return;
    setBusy(true); setFormError("");
    try {
      await api(editor === "new" ? "/api/admin/launches" : `/api/admin/launches/${editor.id}`, editor === "new" ? "POST" : "PATCH", draft);
      pendingUpload.current = null;
      setEditor(null); toast.success(draft.published ? "Launch published on your website" : "Private draft saved"); await load();
    } catch (error) { setFormError(error instanceof Error ? error.message : "Could not save launch."); }
    finally { setBusy(false); }
  }
  async function deleteLaunch() {
    if (!remove) return; setBusy(true);
    try { await api(`/api/admin/launches/${remove.id}`, "DELETE"); setRemove(null); toast.success("Launch removed"); await load(); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not remove launch."); }
    finally { setBusy(false); }
  }
  const field = (key: "name" | "slug" | "tagline" | "version" | "android", label: string, max: number, min = 1) => <div className="form-field"><label htmlFor={`launch-${key}`}>{label}</label><input id={`launch-${key}`} value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} required minLength={min} maxLength={max} disabled={busy || uploading || (key === "slug" && editor !== "new" && editor?.slug === "secretchat")} /></div>;
  return <>
    <div className="launch-admin-heading"><div className="panel-heading"><h2>From your studio to their phone.</h2><p>Upload an APK, write the announcement, and publish. No GitHub update needed. The newest published launch with its popup enabled appears when visitors open your homepage.</p></div><button className="button button-gold" onClick={() => edit()}><Plus size={17} /> New launch</button></div>
    {loadError && <p className="form-error" role="alert">{loadError} <button onClick={() => void load()}>Try again</button></p>}
    {loading ? <p className="empty-message">Opening your launches…</p> : !launches.length ? <p className="empty-message">Your next app starts here. Add a launch to get its own download page.</p> : <div className="admin-launch-list">{launches.map((launch) => <article key={launch.id}><Rocket size={25} /><div><span className={`admin-status ${launch.published ? "published" : ""}`}>{launch.published ? "Published" : "Private draft"}{launch.show_popup ? " · Popup enabled" : ""}</span><h3>{launch.name} <small>v{launch.version}</small></h3><p>{launch.tagline}</p><span className="download-meta">{fileSize(launch.apk_bytes)} · {launch.android}</span></div><div className="table-actions">{launch.published && <a href={launchHref(launch)} target="_blank" rel="noreferrer" aria-label={`View ${launch.name}`}><ArrowUpRight size={18} /></a>}<button onClick={() => edit(launch)} aria-label={`Edit launch ${launch.name}`}><Pencil size={17} /></button><button onClick={() => setRemove(launch)} aria-label={`Delete launch ${launch.name}`}><Trash2 size={17} /></button></div></article>)}</div>}
    <Dialog open={!!editor} onOpenChange={(open) => { if (!open && !busy && !uploading) { setEditor(null); void discardUpload(); } }}><DialogContent className="editor-dialog launch-editor" showCloseButton={!busy && !uploading}><DialogTitle>{editor === "new" ? "A new launch." : "Update your launch."}</DialogTitle><DialogDescription>Drafts and their APKs stay private until published. Use a signed release APK you trust, and test it on a phone before publishing.</DialogDescription><form onSubmit={save}>
      {field("name", "App name", 80, 2)}{field("slug", "Page address (lowercase, e.g. my-new-app)", 60, 3)}{field("tagline", "Short headline", 140, 3)}
      <div className="form-field"><label htmlFor="launch-description">Announcement & app description</label><textarea id="launch-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} minLength={10} maxLength={2000} required rows={4} disabled={busy || uploading} /></div>
      <div className="launch-form-grid">{field("version", "Version", 40)}{field("android", "Android requirement", 60, 3)}</div>
      <div className="form-field"><label htmlFor="launch-notes">Release notes</label><textarea id="launch-notes" value={draft.release_notes} onChange={(event) => setDraft({ ...draft, release_notes: event.target.value })} maxLength={4000} rows={4} disabled={busy || uploading} /></div>
      <div className="apk-upload"><label htmlFor="launch-apk"><Upload size={20} /> {draft.apk_path ? "Replace APK" : "Upload Android APK"} <span>Up to 50 MB · signed release builds</span></label><input id="launch-apk" type="file" accept=".apk,application/vnd.android.package-archive" disabled={busy || uploading} onChange={(event) => { void pickApk(event.target.files?.[0]); event.target.value = ""; }} />{uploading && <p role="status">Uploading… {progress}% <progress value={progress} max={100} /></p>}{draft.apk_path && <p>APK ready · {fileSize(draft.apk_bytes)}<code>{draft.apk_sha256}</code></p>}</div>
      <div className="publish-toggle"><div><label htmlFor="launch-popup">Show launch popup</label><p>Announce this launch on the homepage.</p></div><Switch id="launch-popup" checked={draft.show_popup} disabled={busy || uploading} onCheckedChange={(value) => setDraft({ ...draft, show_popup: value })} /></div>
      <div className="publish-toggle"><div><label htmlFor="launch-published">Publish on the website</label><p>Turn off to hide the page, announcement, and download link.</p></div><Switch id="launch-published" checked={draft.published} disabled={busy || uploading} onCheckedChange={(value) => setDraft({ ...draft, published: value })} /></div>
      {formError && <p className="form-error" role="alert">{formError}</p>}<button className="button button-gold" disabled={busy || uploading}>{busy ? "Verifying & saving…" : draft.published ? "Publish launch" : "Save private draft"}{busy ? <LoaderCircle size={17} className="animate-spin" /> : <Check size={17} />}</button>
    </form></DialogContent></Dialog>
    <AlertDialog open={!!remove} onOpenChange={(open) => { if (!open && !busy) setRemove(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove this launch?</AlertDialogTitle><AlertDialogDescription>“{remove?.name}” will be removed from your website and Studio. Its uploaded APK will be deleted if no other launch uses it. Installed apps are unaffected.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy}>Keep launch</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={(event) => { event.preventDefault(); void deleteLaunch(); }}>Remove launch</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </>;
}

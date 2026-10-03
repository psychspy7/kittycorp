"use client";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const AdminLaunches = dynamic(() => import("./admin-launches"), { loading: () => <p className="empty-message">Opening launches…</p> });
const AdminJournal = dynamic(() => import("./admin-journal"), { loading: () => <p className="empty-message">Opening journal…</p> });
const AdminEarlyAccess = dynamic(() => import("./admin-early-access"), { loading: () => <p className="empty-message">Opening early access…</p> });
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Eye,
  FileText,
  LoaderCircle,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { categories, type Feedback, type Notice } from "@/lib/kitty-types";

async function request(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const data = (await res.json()) as {
    error?: string;
    notices: Notice[];
    feedback: Feedback[];
    nextCursor: string | null;
  };
  if (!res.ok) {
    if (res.status === 401 && url !== "/api/admin/login")
      window.location.assign("/admins");
    throw Error(data.error || "The request failed. Try again.");
  }
  return data;
}
const jsonOptions = (method: string, value: unknown) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(value),
});
const date = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
export function AdminLogin({ unavailable = false }: { unavailable?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      await request(
        "/api/admin/login",
        jsonOptions("POST", {
          username: form.get("username"),
          password: form.get("password"),
        }),
      );
      window.location.assign("/admins");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  }
  return (
    <main id="main" className="admin-login">
      <a href="/" className="back-link">
        <ArrowLeft size={15} /> Back to Kitty Corp
      </a>
      <div className="login-card">
        <img
          src="/brand/monogram.png"
          alt="Kitty Corp"
          width="78"
          height="78"
        />
        <span className="micro-label">THE PRIVATE SIDE OF THE STUDIO</span>
        <h1>Welcome back.</h1>
        <p>Good things are a work in progress.</p>
        {unavailable ? (
          <p className="form-error" role="alert">
            Studio access is temporarily unavailable. Please try again shortly.
          </p>
        ) : (
          <form onSubmit={login}>
            <div className="form-field">
              <label htmlFor="admin-id">Admin ID</label>
              <input
                id="admin-id"
                name="username"
                autoComplete="username"
                required
                maxLength={100}
              />
            </div>
            <div className="form-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                maxLength={200}
              />
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button button-gold" disabled={busy}>
              {busy ? "Signing in…" : "Enter the studio"}
              {busy ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <ArrowUpRight size={18} />
              )}
            </button>
          </form>
        )}
        <span className="login-footnote">PRIVATE ACCESS · KITTY CORP</span>
      </div>
    </main>
  );
}
type Draft = {
  title: string;
  body: string;
  category: (typeof categories)[number];
  published: boolean;
};
const emptyDraft: Draft = {
  title: "",
  body: "",
  category: "Studio note",
  published: false,
};
export function AdminDashboard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editor, setEditor] = useState<Notice | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [remove, setRemove] = useState<Notice | null>(null);
  const [message, setMessage] = useState<Feedback | null>(null);
  const load = useCallback(async () => {
    setLoadError("");
    try {
      const [a, b] = await Promise.all([
        request("/api/admin/notices"),
        request("/api/admin/feedback"),
      ]);
      setNotices(a.notices);
      setFeedback(b.feedback);
      setNextCursor(b.nextCursor);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Couldn’t load studio data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const edit = (notice?: Notice) => {
    setDraft(
      notice
        ? {
            title: notice.title,
            body: notice.body,
            category: notice.category as Draft["category"],
            published: notice.published,
          }
        : emptyDraft,
    );
    setFormError("");
    setEditor(notice || "new");
  };
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editor) return;
    setBusy(true);
    setFormError("");
    try {
      await request(
        editor === "new"
          ? "/api/admin/notices"
          : `/api/admin/notices/${editor.id}`,
        jsonOptions(editor === "new" ? "POST" : "PATCH", draft),
      );
      setEditor(null);
      toast.success(draft.published ? "Notice published" : "Draft saved");
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn’t save.");
    } finally {
      setBusy(false);
    }
  }
  async function deleteNotice() {
    if (!remove) return;
    setBusy(true);
    try {
      await request(`/api/admin/notices/${remove.id}`, { method: "DELETE" });
      setRemove(null);
      toast.success("Notice deleted");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t delete.");
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    try {
      await request("/api/admin/logout", { method: "POST" });
      window.location.assign("/admins");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t sign out.");
      setBusy(false);
    }
  }
  async function moreFeedback() {
    if (!nextCursor) return;
    setBusy(true);
    try {
      const data = await request(
        `/api/admin/feedback?before=${encodeURIComponent(nextCursor)}`,
      );
      setFeedback((items) => [...items, ...data.feedback]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t load more.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <header className="admin-header">
        <a className="brand" href="/">
          <img src="/brand/monogram.png" width="40" height="40" alt="" />
          <span>
            KITTY CORP <small>STUDIO</small>
          </span>
        </a>
        <div>
          <a href="/" target="_blank" rel="noreferrer">
            View website <ArrowUpRight size={15} />
          </a>
          <button onClick={() => void logout()} disabled={busy}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>
      <main id="main" className="admin-main">
        <div className="admin-title">
          <div>
            <span className="micro-label">YOUR WORK, IN ONE PLACE</span>
            <h1>Inside the studio.</h1>
            <p>A little housekeeping. Then back to building.</p>
          </div>
        </div>
        {loadError && (
          <div className="form-error" role="alert">
            {loadError} <button onClick={() => void load()}>Try again</button>
          </div>
        )}
        <div className="admin-stats">
          <div>
            <FileText size={22} />
            <strong>{notices.filter((n) => n.published).length}</strong>
            <span>Published notices</span>
          </div>
          <div>
            <Pencil size={22} />
            <strong>{notices.filter((n) => !n.published).length}</strong>
            <span>Drafts in progress</span>
          </div>
          <div>
            <Mail size={22} />
            <strong>
              {feedback.length}
              {nextCursor ? "+" : ""}
            </strong>
            <span>Messages from people</span>
          </div>
        </div>
        <Tabs defaultValue="journal">
          <TabsList className="admin-tabs">
            <TabsTrigger value="journal">Build journal</TabsTrigger>
            <TabsTrigger value="launches">Apps & launches</TabsTrigger>
            <TabsTrigger value="early-access">Early access</TabsTrigger>
            <TabsTrigger value="feedback">Inbox</TabsTrigger>
            <TabsTrigger value="notices">Legacy notices</TabsTrigger>
          </TabsList>
          <TabsContent value="launches" className="admin-panel"><AdminLaunches /></TabsContent>
          <TabsContent value="journal" className="admin-panel"><AdminJournal /></TabsContent>
          <TabsContent value="early-access" className="admin-panel"><AdminEarlyAccess /></TabsContent>
          <TabsContent value="notices" className="admin-panel">
            <p className="public-note">Existing notices are kept here. Use Build journal for the new homepage development feed and full articles.</p>
            <button className="button button-outline" onClick={() => edit()}><Plus size={17} /> New legacy notice</button>
            <div className="panel-heading">
              <h2>The studio notebook</h2>
              <p>Published notes appear on the website immediately.</p>
            </div>
            {loading ? (
              <Skeleton className="h-40 w-full" />
            ) : notices.length === 0 ? (
              <div className="empty-message">
                A blank page, ready for your first note.{" "}
                <button className="text-link" onClick={() => edit()}>
                  Write one <Plus size={16} />
                </button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notices.map((n) => (
                    <TableRow key={n.id}>
                      <TableCell>
                        <span className="micro-label">{n.category}</span>
                        <strong className="table-title">{n.title}</strong>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`admin-status ${n.published ? "published" : ""}`}
                        >
                          {n.published ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="table-date">
                        {date(n.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="table-actions">
                          <button
                            onClick={() => edit(n)}
                            aria-label={`Edit ${n.title}`}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setRemove(n)}
                            aria-label={`Delete ${n.title}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          <TabsContent value="feedback" className="admin-panel">
            <div className="panel-heading">
              <h2>From the other side of the screen</h2>
              <p>Messages are visible only in your studio.</p>
            </div>
            {loading ? (
              <Skeleton className="h-40 w-full" />
            ) : feedback.length === 0 ? (
              <p className="empty-message">
                Quiet for now. New contact messages will land here.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right">Read</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <strong className="table-title">{f.name}</strong>
                        <span className="table-email">{f.email}</span>
                      </TableCell>
                      <TableCell className="message-excerpt">
                        {f.message.slice(0, 90)}
                        {f.message.length > 90 ? "…" : ""}
                      </TableCell>
                      <TableCell className="table-date">
                        {date(f.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="table-actions">
                          <button
                            onClick={() => setMessage(f)}
                            aria-label={`Read message from ${f.name}`}
                          >
                            <Eye size={17} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {nextCursor && (
              <button
                className="button button-outline"
                disabled={busy}
                onClick={() => void moreFeedback()}
              >
                Load earlier messages
              </button>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Dialog
        open={!!editor}
        onOpenChange={(open) => {
          if (!open && !busy) setEditor(null);
        }}
      >
        <DialogContent className="editor-dialog">
          <DialogTitle>
            {editor === "new"
              ? "A new studio note."
              : "Make it a little better."}
          </DialogTitle>
          <DialogDescription>
            Save a draft or share an update with everyone.
          </DialogDescription>
          <form onSubmit={save}>
            <div className="form-field">
              <label htmlFor="notice-title">Title</label>
              <input
                id="notice-title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                required
                minLength={3}
                maxLength={120}
              />
            </div>
            <div className="form-field">
              <label htmlFor="notice-category">Category</label>
              <Select
                value={draft.category}
                onValueChange={(value) =>
                  setDraft({ ...draft, category: value as Draft["category"] })
                }
              >
                <SelectTrigger id="notice-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="form-field">
              <label htmlFor="notice-body">The update</label>
              <textarea
                id="notice-body"
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                rows={7}
                required
                minLength={10}
                maxLength={4000}
              />
            </div>
            <div className="publish-toggle">
              <div>
                <label htmlFor="notice-published">Publish on the website</label>
                <p>Turn off to keep this as a private draft.</p>
              </div>
              <Switch
                id="notice-published"
                checked={draft.published}
                onCheckedChange={(value) =>
                  setDraft({ ...draft, published: value })
                }
              />
            </div>
            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}
            <button className="button button-gold" disabled={busy}>
              {busy
                ? "Saving…"
                : draft.published
                  ? "Publish notice"
                  : "Save draft"}
              {busy ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Check size={17} />
              )}
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!remove}
        onOpenChange={(open) => {
          if (!open && !busy) setRemove(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this notice?</AlertDialogTitle>
            <AlertDialogDescription>
              “{remove?.title}” will be permanently removed from the studio and
              the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Keep notice</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(e) => {
                e.preventDefault();
                void deleteNotice();
              }}
            >
              {busy ? "Deleting…" : "Delete notice"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={!!message}
        onOpenChange={(open) => {
          if (!open) setMessage(null);
        }}
      >
        <DialogContent className="notice-dialog">
          <span className="micro-label">A MESSAGE FOR KITTY CORP</span>
          <DialogTitle>{message?.name}</DialogTitle>
          <DialogDescription>
            {message?.email} · {message ? date(message.created_at) : ""}
          </DialogDescription>
          <div className="notice-body">{message?.message}</div>
          <a
            className="button button-gold"
            href={`mailto:${encodeURIComponent(message?.email || "")}?subject=Re%3A%20Your%20message%20to%20Kitty%20Corp`}
          >
            Reply by email <ArrowUpRight size={17} />
          </a>
        </DialogContent>
      </Dialog>
    </>
  );
}

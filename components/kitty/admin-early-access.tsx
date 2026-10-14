"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type EarlyAccessEntry, entryDate } from "@/lib/journal";
async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const data = (await res.json()) as {
    error?: string;
    entries: EarlyAccessEntry[];
    nextCursor: string | null;
  };
  if (!res.ok) {
    if (res.status === 401) window.location.reload();
    throw Error(data.error || "Please try again.");
  }
  return data;
}
export default function AdminEarlyAccess() {
  const [entries, setEntries] = useState<EarlyAccessEntry[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api("/api/admin/early-access")
      .then((data) => {
        if (active) {
          setEntries(data.entries);
          setCursor(data.nextCursor);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function more() {
    if (!cursor) return;
    setBusy(true);
    try {
      const data = await api(
        `/api/admin/early-access?before=${encodeURIComponent(cursor)}`,
      );
      setEntries((list) => [...list, ...data.entries]);
      setCursor(data.nextCursor);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function remove(entry: EarlyAccessEntry) {
    if (!window.confirm(`Remove ${entry.email} from early access?`)) return;
    setBusy(true);
    try {
      await api(`/api/admin/early-access/${entry.id}`, { method: "DELETE" });
      setEntries((list) => list.filter((e) => e.id !== entry.id));
      toast.success("Removed from the early list.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn’t remove.");
    } finally {
      setBusy(false);
    }
  }
  function exportList() {
    const safe = (v: string) =>
      `"${v.replace(/^[=+@-]/, "'$&").replaceAll('"', '""')}"`;
    const csv = [
      "Email,Interests,Joined,Status",
      ...entries.map((e) =>
        [e.email, e.interests.join("; "), e.created_at, e.status || "legacy"]
          .map(safe)
          .join(","),
      ),
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "kitty-early-access.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <div className="admin-content-toolbar">
        <div>
          <h2>Early access</h2>
          <p>
            People who asked to follow the work. Only active entries have
            completed email confirmation. Legacy entries are preserved and are
            not automatically subscribed or emailed. This list is private. Load
            all pages before exporting the complete list.
          </p>
        </div>
        <button
          className="button button-outline"
          onClick={exportList}
          disabled={!entries.length}
        >
          Export {entries.length} loaded entries
        </button>
      </div>
      {loading && <p className="empty-message">Opening the early list…</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
          <button onClick={() => window.location.reload()}>Try again</button>
        </p>
      )}
      {entries.length > 0 && (
        <div className="admin-early-list">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Interests</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td>{e.email}</td>
                  <td>{e.interests.join(", ")}</td>
                  <td>{entryDate(e.created_at)}</td>
                  <td>{e.status || "legacy"}</td>
                  <td>
                    <button
                      className="text-link"
                      disabled={busy}
                      onClick={() => void remove(e)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !error && !entries.length && (
        <p className="empty-message">
          Signups will appear here as people join.
        </p>
      )}
      {cursor && (
        <button
          className="button button-outline"
          disabled={busy}
          onClick={() => void more()}
        >
          {busy ? "Loading…" : "Load more"}
        </button>
      )}
    </>
  );
}

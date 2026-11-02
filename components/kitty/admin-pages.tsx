"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, LoaderCircle, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { studioRequest } from "./studio-content-helpers";
import {
  isSitePageSlug,
  SITE_PAGE_SLUGS,
  sitePageContentSchemas,
  sitePageDefaults,
  sitePageEditorGroups,
  sitePageInfo,
  type SitePageContent,
  type SitePageSlug,
} from "@/lib/site-page-content";

type PageRow = { slug: string; content: unknown; updated_at: string };
type EditorContent = Record<SitePageSlug, SitePageContent>;

function copyContent(source: EditorContent): EditorContent {
  return Object.fromEntries(SITE_PAGE_SLUGS.map((slug) => [slug, { ...source[slug] }])) as EditorContent;
}

function defaultContent(): EditorContent {
  return Object.fromEntries(SITE_PAGE_SLUGS.map((slug) => [slug, { ...sitePageDefaults[slug] }])) as EditorContent;
}

function savedDate(value?: string) {
  if (!value) return "Using the current website copy";
  return "Last saved " + new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminPages() {
  const [selected, setSelected] = useState<SitePageSlug>("home");
  const [values, setValues] = useState<EditorContent>(defaultContent);
  const [saved, setSaved] = useState<EditorContent>(defaultContent);
  const [updatedAt, setUpdatedAt] = useState<Partial<Record<SitePageSlug, string>>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [migrationRequired, setMigrationRequired] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    studioRequest<{ pages: PageRow[]; migrationRequired: boolean }>("/api/admin/pages")
      .then((result) => {
        if (!active) return;
        const next = defaultContent();
        const dates: Partial<Record<SitePageSlug, string>> = {};
        for (const row of result.pages ?? []) {
          if (!isSitePageSlug(row.slug)) continue;
          const parsed = sitePageContentSchemas[row.slug].safeParse(row.content);
          if (!parsed.success) continue;
          next[row.slug] = { ...sitePageDefaults[row.slug], ...parsed.data };
          dates[row.slug] = row.updated_at;
        }
        setValues(next);
        setSaved(copyContent(next));
        setUpdatedAt(dates);
        setMigrationRequired(result.migrationRequired === true);
        setError("");
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : "Couldn’t load page content.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const content = values[selected];
  const savedContent = saved[selected];
  const hasChanges = JSON.stringify(content) !== JSON.stringify(savedContent);

  function changeField(key: string, value: string) {
    setValues((current) => ({
      ...current,
      [selected]: { ...current[selected], [key]: value },
    }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (migrationRequired) {
      setError("Apply the page editor database migration before saving.");
      return;
    }
    const parsed = sitePageContentSchemas[selected].safeParse(content);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Check the page fields.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await studioRequest<{ page: PageRow }>("/api/admin/pages", "PATCH", {
        slug: selected,
        content: parsed.data,
      });
      const next = { ...values, [selected]: { ...parsed.data } };
      setValues(next);
      setSaved((current) => ({ ...current, [selected]: { ...parsed.data } }));
      setUpdatedAt((current) => ({ ...current, [selected]: result.page.updated_at }));
      toast.success(sitePageInfo[selected].label + " page updated");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn’t save page content.");
    } finally {
      setBusy(false);
    }
  }

  function discardChanges() {
    setValues((current) => ({ ...current, [selected]: { ...savedContent } }));
    setError("");
  }

  return (
    <section className="studio-pages">
      <div className="panel-heading">
        <h2>Page content</h2>
        <p>Edit key copy and search previews for your main pages. Layout and site features stay managed in the website source.</p>
      </div>

      {migrationRequired && (
        <p className="public-note" role="status">
          One-time setup needed: apply <strong>supabase/migrations/202611020001_website_page_content.sql</strong> to the Kitty Corp Website database before saving. Your current pages continue using their built-in copy until then.
        </p>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}

      {loading ? (
        <p className="empty-message">Loading page content…</p>
      ) : (
        <div className="studio-pages-layout">
          <nav className="studio-page-nav" aria-label="Choose a page to edit">
            <p className="micro-label">PAGES</p>
            {SITE_PAGE_SLUGS.map((slug) => (
              <button
                key={slug}
                type="button"
                className={selected === slug ? "studio-page-choice is-selected" : "studio-page-choice"}
                aria-pressed={selected === slug}
                onClick={() => {
                  setSelected(slug);
                  setError("");
                }}
              >
                <strong>{sitePageInfo[slug].label}</strong>
                <span>{sitePageInfo[slug].route}</span>
              </button>
            ))}
          </nav>

          <div className="studio-page-workspace">
            <div className="studio-page-toolbar">
              <div>
                <h3>{sitePageInfo[selected].label}</h3>
                <p>{sitePageInfo[selected].summary}</p>
                <span className="studio-page-saved">{hasChanges ? "Unsaved changes" : savedDate(updatedAt[selected])}</span>
              </div>
              <a className="button button-outline" href={sitePageInfo[selected].route} target="_blank" rel="noopener noreferrer">
                View live page <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>

            <p className="studio-page-publish-note">Saving publishes these copy changes immediately. Review the page after saving.</p>

            <form onSubmit={save}>
              {sitePageEditorGroups[selected].map((group) => (
                <fieldset className="studio-page-group" key={group.title}>
                  <legend>{group.title}</legend>
                  {group.description && <p className="studio-page-group-description">{group.description}</p>}
                  <div className="studio-page-fields">
                    {group.fields.map((item) => {
                      const id = "site-page-" + selected + "-" + item.key;
                      const value = content[item.key] ?? "";
                      return (
                        <div className="form-field" key={item.key}>
                          <label htmlFor={id}>
                            {item.label}
                            <span className="field-count">{value.length}/{item.maxLength}</span>
                          </label>
                          {item.kind === "textarea" ? (
                            <textarea
                              id={id}
                              rows={item.rows ?? 4}
                              required={item.minLength > 0}
                              minLength={item.minLength || undefined}
                              maxLength={item.maxLength}
                              value={value}
                              disabled={busy}
                              onChange={(event) => changeField(item.key, event.target.value)}
                            />
                          ) : (
                            <input
                              id={id}
                              type="text"
                              required={item.minLength > 0}
                              minLength={item.minLength || undefined}
                              maxLength={item.maxLength}
                              value={value}
                              disabled={busy}
                              onChange={(event) => changeField(item.key, event.target.value)}
                            />
                          )}
                          {item.hint && <p className="studio-field-help">{item.hint}</p>}
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              ))}

              <div className="studio-page-actions">
                <button className="button button-gold" type="submit" disabled={busy || loading || migrationRequired || !hasChanges}>
                  {busy ? <><LoaderCircle size={17} className="animate-spin" /> Saving…</> : <><Save size={17} /> Save page</>}
                </button>
                <button className="button button-outline" type="button" disabled={busy || !hasChanges} onClick={discardChanges}>
                  <RotateCcw size={16} /> Discard unsaved edits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

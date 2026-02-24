"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export interface SavedPost {
  id: string;
  title: string;
  slug: string;
  filename: string;
  date: string;
}

interface NewPostFormProps {
  onCancel: () => void;
  onSaved?: (post: SavedPost) => void;
}

export default function NewPostForm({ onCancel, onSaved }: NewPostFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function validate(): boolean {
    const newErrors: { title?: string; body?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (!body.trim()) {
      newErrors.body = "Body is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/gists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Save failed (${res.status})`);
      }

      const result = await res.json();
      onSaved?.({
        id: result.id,
        title: result.title,
        slug: result.slug,
        filename: result.filename,
        date: result.date,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save post";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="new-post-form">
      <h2 className="new-post-form__heading">New Post</h2>

      {saveError && (
        <div className="new-post-form__save-error" role="alert">
          {saveError}
        </div>
      )}

      <div className="new-post-form__field">
        <label className="new-post-form__label" htmlFor="post-title">
          Title
        </label>
        <input
          id="post-title"
          className={`new-post-form__input ${errors.title ? "new-post-form__input--error" : ""}`}
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          placeholder="Post title"
          disabled={saving}
        />
        {errors.title && (
          <span className="new-post-form__error">{errors.title}</span>
        )}
      </div>

      <div className="new-post-form__field">
        <div className="new-post-form__label-row">
          <label className="new-post-form__label" htmlFor="post-body">
            Body
          </label>
          <button
            type="button"
            className="new-post-form__toggle-preview"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {showPreview ? (
          <div className="new-post-form__preview post-content">
            {body.trim() ? (
              <ReactMarkdown>{body}</ReactMarkdown>
            ) : (
              <p className="new-post-form__preview-empty">Nothing to preview.</p>
            )}
          </div>
        ) : (
          <textarea
            id="post-body"
            className={`new-post-form__textarea ${errors.body ? "new-post-form__textarea--error" : ""}`}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (errors.body) setErrors((prev) => ({ ...prev, body: undefined }));
            }}
            placeholder="Write your post in Markdown..."
            rows={16}
            disabled={saving}
          />
        )}
        {errors.body && (
          <span className="new-post-form__error">{errors.body}</span>
        )}
      </div>

      <div className="new-post-form__actions">
        <button
          type="button"
          className="new-post-form__button new-post-form__button--secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="button"
          className="new-post-form__button new-post-form__button--primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

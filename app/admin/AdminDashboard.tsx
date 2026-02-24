"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import NewPostForm from "@/components/NewPostForm";
import type { SavedPost } from "@/components/NewPostForm";

interface AdminDashboardProps {
  userName: string;
}

export default function AdminDashboard({ userName }: AdminDashboardProps) {
  const [showNewPost, setShowNewPost] = useState(false);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleSaved(post: SavedPost) {
    setSavedPosts((prev) => [post, ...prev]);
    setSuccessMessage(`Post "${post.title}" saved successfully!`);
    setShowNewPost(false);
  }

  function dismissSuccess() {
    setSuccessMessage(null);
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Admin Dashboard</h1>
        <div className="admin-dashboard__user">
          <span className="admin-dashboard__username">{userName}</span>
          <button
            className="admin-dashboard__logout"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="admin-dashboard__success" role="status">
          <span>{successMessage}</span>
          <button
            className="admin-dashboard__success-dismiss"
            onClick={dismissSuccess}
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}

      <div className="admin-dashboard__content">
        {showNewPost ? (
          <NewPostForm
            onCancel={() => setShowNewPost(false)}
            onSaved={handleSaved}
          />
        ) : (
          <button
            className="admin-dashboard__new-post"
            onClick={() => setShowNewPost(true)}
          >
            New post
          </button>
        )}
      </div>

      {savedPosts.length > 0 && (
        <div className="admin-dashboard__posts">
          <h2 className="admin-dashboard__posts-heading">Your Posts</h2>
          <ul className="admin-dashboard__posts-list">
            {savedPosts.map((post) => (
              <li key={post.id} className="admin-dashboard__posts-item">
                <a href={`/posts/${post.slug}`} className="admin-dashboard__posts-link">
                  {post.title}
                </a>
                <span className="admin-dashboard__posts-date">
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

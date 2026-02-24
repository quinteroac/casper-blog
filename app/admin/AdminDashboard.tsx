"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import NewPostForm from "@/components/NewPostForm";

interface AdminDashboardProps {
  userName: string;
}

export default function AdminDashboard({ userName }: AdminDashboardProps) {
  const [showNewPost, setShowNewPost] = useState(false);

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
      <div className="admin-dashboard__content">
        {showNewPost ? (
          <NewPostForm onCancel={() => setShowNewPost(false)} />
        ) : (
          <button
            className="admin-dashboard__new-post"
            onClick={() => setShowNewPost(true)}
          >
            New post
          </button>
        )}
      </div>
    </div>
  );
}

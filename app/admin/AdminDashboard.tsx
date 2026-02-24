"use client";

import { signOut } from "next-auth/react";

interface AdminDashboardProps {
  userName: string;
}

export default function AdminDashboard({ userName }: AdminDashboardProps) {
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
        <p className="admin-dashboard__welcome">
          Welcome to the admin panel. Content management features are coming
          soon.
        </p>
      </div>
    </div>
  );
}

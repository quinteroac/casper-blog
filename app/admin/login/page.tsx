"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const error = searchParams.get("error");

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">Admin Login</h1>
        <p className="admin-login__description">
          Sign in with your GitHub account to manage content.
        </p>
        {error && (
          <p className="admin-login__error">
            Authentication failed. Please try again.
          </p>
        )}
        <button
          className="admin-login__button"
          onClick={() => signIn("github", { callbackUrl })}
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

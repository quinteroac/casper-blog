"use client";

import React, { useState } from "react";
import { getGitHubAvatarUrl, getAvatarFallbackLetter } from "@/lib/avatar";

interface AuthorAvatarProps {
  /** GitHub username from GIST_ACCOUNT. When empty, fallback is shown. */
  account: string | undefined;
  /**
   * Optional avatar URL (e.g. from GitHub API avatar_url).
   * When provided, used instead of building from username (US-002: same as GitHub profile).
   */
  avatarUrl?: string;
  /** Size in pixels. Default 40. */
  size?: number;
  /** Optional className for the wrapper. */
  className?: string;
}

/**
 * Renders the author's avatar from GitHub.
 * Shows fallback (first letter or "?") when account is missing or image fails to load.
 * Never displays a broken image.
 */
export function AuthorAvatar({
  account,
  avatarUrl: avatarUrlProp,
  size = 40,
  className = "",
}: AuthorAvatarProps) {
  const fallbackLetter = getAvatarFallbackLetter(account);
  const [useFallback, setUseFallback] = useState(!account || account.trim() === "");

  const showFallback = useFallback || !account || account.trim() === "";

  if (showFallback) {
    return (
      <div
        className={`author-avatar author-avatar--fallback ${className}`.trim()}
        style={{ width: size, height: size }}
        aria-label={account ? `Avatar for ${account}` : "Author avatar"}
      >
        <span className="author-avatar__letter">{fallbackLetter}</span>
      </div>
    );
  }

  const avatarUrl = avatarUrlProp ?? getGitHubAvatarUrl(account!);

  return (
    <img
      src={avatarUrl}
      alt={`Avatar for ${account}`}
      width={size}
      height={size}
      className={`author-avatar ${className}`.trim()}
      onError={() => setUseFallback(true)}
    />
  );
}

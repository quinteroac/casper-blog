import React from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { AuthorAvatar } from "@/components/AuthorAvatar";

interface PostCardProps {
  post: Post;
  /** GitHub username from GIST_ACCOUNT. When provided, author avatar is shown. */
  authorAccount?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function PostCard({ post, authorAccount }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="post-card">
      <div className="post-card__header">
        <AuthorAvatar account={authorAccount} size={40} className="post-card__avatar" />
        <div className="post-card__meta">
          <h2 className="post-card__title">{post.title}</h2>
          <time dateTime={post.date} className="post-card__date">
            {formatDate(post.date)}
          </time>
        </div>
      </div>
      {post.preview && (
        <p className="post-card__preview">{post.preview}</p>
      )}
    </Link>
  );
}

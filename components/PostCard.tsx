import Link from "next/link";
import type { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="post-card">
      <h2 className="post-card__title">{post.title}</h2>
      <time dateTime={post.date} className="post-card__date">
        {formatDate(post.date)}
      </time>
      {post.preview && (
        <p className="post-card__preview">{post.preview}</p>
      )}
    </Link>
  );
}

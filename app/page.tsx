import {
  fetchPosts,
  fetchPostsFromAccount,
} from "@/lib/gistClient";
import { PostCard } from "@/components/PostCard";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { GIST_ACCOUNT, GIST_IDS } from "@/config/gist";
import { isGistSourceConfigured } from "@/config/env";

export default async function HomePage() {
  const configured = isGistSourceConfigured();
  const posts = GIST_ACCOUNT
    ? await fetchPostsFromAccount(GIST_ACCOUNT)
    : GIST_IDS.length > 0
      ? await fetchPosts(GIST_IDS)
      : [];

  return (
    <>
      <h2 className="page-heading">Posts</h2>
      {posts.length > 0 ? (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={`${post.gistId}-${post.slug}`}>
              <PostCard post={post} authorAccount={GIST_ACCOUNT || undefined} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <AuthorAvatar
            account={GIST_ACCOUNT || undefined}
            size={48}
            className="empty-state__avatar"
          />
          <h3 className="empty-state__title">No posts yet</h3>
          <p className="empty-state__text">
            {configured
              ? "No Gist posts found for the configured account."
              : "Set GIST_ACCOUNT or GIST_IDS in your Vercel environment variables to display posts."}
          </p>
        </div>
      )}
    </>
  );
}

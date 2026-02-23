import { fetchPosts } from "@/lib/gistClient";
import { PostCard } from "@/components/PostCard";
import { GIST_IDS } from "@/config/gist";

export default async function HomePage() {
  const posts = GIST_IDS.length > 0 ? await fetchPosts(GIST_IDS) : [];

  return (
    <>
      <h2 className="page-heading">Posts</h2>
      {posts.length > 0 ? (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={`${post.gistId}-${post.slug}`}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <h3 className="empty-state__title">No posts yet</h3>
          <p className="empty-state__text">
            Configure GIST_IDS in your environment to load posts from GitHub
            Gist.
          </p>
        </div>
      )}
    </>
  );
}

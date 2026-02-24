import Link from "next/link";
import { getPostBySlug } from "@/lib/gistClient";
import { PostContent } from "@/components/PostContent";
import { GIST_IDS } from "@/config/gist";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = GIST_IDS.length > 0 ? await getPostBySlug(slug, GIST_IDS) : null;

  if (!post) {
    return (
      <>
        <Link href="/" className="back-link">
          ← Back to list
        </Link>
        <article>
          <h1>Post not found</h1>
          <p>No post was found for &quot;{slug}&quot;.</p>
        </article>
      </>
    );
  }

  return (
    <>
      <Link href="/" className="back-link">
        ← Back to list
      </Link>
      <article>
        <h1 className="post-title">{post.title}</h1>
        <PostContent content={post.content} />
      </article>
    </>
  );
}

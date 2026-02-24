import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getGistIdsForAccount,
} from "@/lib/gistClient";
import { PostContent } from "@/components/PostContent";
import { GIST_ACCOUNT, GIST_IDS } from "@/config/gist";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const gistIds = GIST_ACCOUNT
    ? await getGistIdsForAccount(GIST_ACCOUNT)
    : GIST_IDS;
  const post =
    gistIds.length > 0 ? await getPostBySlug(slug, gistIds) : null;

  if (!post) {
    notFound();
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

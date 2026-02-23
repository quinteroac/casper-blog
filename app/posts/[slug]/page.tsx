import Link from "next/link";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  return (
    <>
      <Link href="/" className="back-link">
        ← Back to list
      </Link>
      <article>
        <h1>{slug}</h1>
        <p>Post content will be loaded in US-002.</p>
      </article>
    </>
  );
}

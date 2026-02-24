import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Link href="/" className="back-link">
        ← Back to list
      </Link>
      <article>
        <h1>Not found</h1>
        <p>The requested post could not be found.</p>
      </article>
    </>
  );
}

import ReactMarkdown from "react-markdown";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="post-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

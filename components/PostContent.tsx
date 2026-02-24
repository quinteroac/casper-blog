import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

interface PostContentProps {
  content: string;
}

/**
 * Renders Markdown content with sanitization to prevent raw HTML injection.
 * Uses rehype-sanitize to strip dangerous elements and attributes.
 */
export function PostContent({ content }: PostContentProps) {
  return (
    <div className="post-content">
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
          h2: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
          h3: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
          h4: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
          h5: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

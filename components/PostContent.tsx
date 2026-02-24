import ReactMarkdown from "react-markdown";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="post-content">
      <ReactMarkdown
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

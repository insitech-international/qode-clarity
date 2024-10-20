import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Typography, Box } from "@mui/material";

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        h1: (props) => <Typography variant="h4" {...props} gutterBottom />,
        h2: (props) => <Typography variant="h5" {...props} gutterBottom />,
        h3: (props) => <Typography variant="h6" {...props} gutterBottom />,
        p: (props) => <Typography variant="body1" {...props} paragraph />,
        ul: (props) => <Box component="ul" sx={{ pl: 2 }} {...props} />,
        ol: (props) => <Box component="ol" sx={{ pl: 2 }} {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;

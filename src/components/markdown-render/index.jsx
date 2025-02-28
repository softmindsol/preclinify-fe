import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./MarkdownStyles.css";
import rehypeRaw from "rehype-raw";
const MarkdownRender = ({ children }) => {
  const content = typeof children === "string" ? children : "";
  return (
    <div className="markdown-container">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRender;

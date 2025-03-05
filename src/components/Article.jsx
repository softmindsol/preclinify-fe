import React from "react";
import ReactMarkdown from "react-markdown";

const Article = ({ article, id }) => {
  if (!id) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          No article data available.
        </p>
      </div>
    );
  }

  const { conditionName = "Untitled", textbookContent = "" } = article[0] || {};
  const extractHeadings = (markdown) => {
    const headingRegex = /^#{1,6} (.+)$/gm;
    const matches = [...markdown.matchAll(headingRegex)];
    return matches.map((match) => ({
      level: match[0].split(" ")[0].length,
      text: match[1],
    }));
  };

  const headings = extractHeadings(textbookContent);

  return (
    <div className="mx-auto mt-8 flex w-[900px] flex-col md:flex-row">
      {/* Main Content */}
      <div className="mx-7 flex-1 rounded-[8px] bg-white p-5">
        <h1 className="mb-4 text-3xl text-[30px] font-bold text-[#3F3F46]">
          {conditionName}
        </h1>

        <div className="prose prose-green leading-relaxed">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="mb-4 font-bold" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="mb-4 mt-3 text-[16px] font-extrabold text-[#3CC8A1]"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-4 font-light leading-relaxed" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="leading-relaxed" {...props} />
              ),
              hr: () => null,
            }}
          >
            {textbookContent}
          </ReactMarkdown>
        </div>
      </div>

      {/* Sidebar for Table of Contents */}
      <div className="rounded-lg bg-gray-100 p-6 text-[#27272A] md:w-1/4">
        <h2 className="mb-4 text-[14px] font-semibold">- Contents</h2>
        <hr />
        <ul className="mt-3 space-y-2">
          {headings.map((heading, index) => (
            <li
              key={index}
              className="text-[14px] text-[#71717A] hover:text-[#3CC8A1]"
            >
              <a href={`#${heading.text.toLowerCase().replace(/ /g, "-")}`}>
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Article;

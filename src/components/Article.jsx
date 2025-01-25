import React from "react";
import ReactMarkdown from "react-markdown";

const Article = ({ article=[] }) => {
    if (!article || article.length === 0) {
        return (
            <div className="flex justify-center items-center ">
                <p className="text-lg font-medium text-gray-500">No article data available.</p>
            </div>
        );
    }


    const { conditionName = "Untitled", textbookContent = "" } = article[0] || {};
    // Function to extract headings dynamically for the Table of Contents
    const extractHeadings = (markdown) => {
        const headingRegex = /^#{1,6} (.+)$/gm;
        const matches = [...markdown.matchAll(headingRegex)];
        return matches.map((match) => ({
            level: match[0].split(" ")[0].length, // Determines the heading level
            text: match[1],
        }));
    };

    const headings = extractHeadings(textbookContent);

    return (
        <div className="flex flex-col md:flex-row w-[900px] mx-auto ">
            {/* Main Content */}
            <div className="mx-7 bg-white p-5 rounded-[8px] flex-1">
                <h1 className="text-3xl text-[30px] text-[#3F3F46]  font-bold mb-4">{conditionName}</h1>

                {/* Render Markdown Content with Custom Styling */}
                <div className="prose prose-green leading-relaxed">
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => (
                                <h1 className=" font-bold mb-4" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2 className="text-[#3CC8A1] text-[16px]   mt-3 font-extrabold mb-4" {...props} />
                            ),
                            p: ({ node, ...props }) => (
                                <p className="mb-4 leading-relaxed font-light " {...props} />
                            ),
                            li: ({ node, ...props }) => (
                                <li className="leading-relaxed " {...props} />
                            ),
                            hr: () => null
                        }}
                    >
                        {textbookContent}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Sidebar for Table of Contents */}
            <div className="text-[#27272A] p-6 md:w-1/4 bg-gray-100 rounded-lg">
                <h2 className="text-[14px] font-semibold mb-4">- Contents</h2>
                <hr />
                <ul className="space-y-2 mt-3">
                    {headings.map((heading, index) => (
                        <li key={index} className="text-[#71717A] hover:text-green-600 text-[14px]">
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

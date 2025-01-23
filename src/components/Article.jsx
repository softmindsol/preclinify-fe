import React from "react";

const Article = ({ article = [] }) => {
    if (!article.length) {
        return <div>No article data available.</div>;
    }

    const { conditionName } = article[0];

    const renderContent = () => {
        return conditionName.split("\n").map((line, index) => {
            if (line.startsWith("# ")) {
                return (
                    <h1 key={index} className="text-[30px] font-bold">
                        {line.replace("# ", "")}
                    </h1>
                );
            } else if (line.startsWith("## ")) {
                return (
                    <h2 key={index} className="text-[26px] font-semibold">
                        {line.replace("## ", "")}
                    </h2>
                );
            } else if (line.startsWith("### ")) {
                return (
                    <h3 key={index} className="text-[22px] font-medium">
                        {line.replace("### ", "")}
                    </h3>
                );
            } else if (line.startsWith("- ")) {
                return (
                    <p key={index} className="text-[16px] text-[#71717A]">
                        {line.replace("- ", "")}
                    </p>
                );
            } else {
                return <p key={index}>{line}</p>;
            }
        });
    };

    return (
        <div>
            <div className="md:flex h-screen w-full">
                <div className="flex-1 py-2 md:p-5">
                    {/* Module Details */}
                    <div className="flex justify-center gap-5">
                        <div className="bg-white md:mx-5 2xl:w-[640px] md:rounded-lg p-6 space-y-10 shadow-md">
                            {/* Breadcrumb and Title */}
                            <div>
                                <h1 className="text-[#3F3F46] mt-2 text-[30px] font-bold">
                                    {conditionName}
                                </h1>
                            </div>

                            {/* Render Content */}
                            <div className="space-y-4">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Article;

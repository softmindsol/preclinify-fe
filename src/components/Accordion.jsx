import React, { useState } from "react";

const AccordionItem = ({ title, content, isOpen, onToggle, isCorrect }) => {
    return (
        <div
            className={`border rounded-lg mb-2 ${isCorrect
                    ? isOpen
                        ? "bg-green-100 border-green-400"
                        : "bg-white border-gray-300"
                    : isOpen
                        ? "bg-red-300 border-red-400"
                        : "bg-white border-gray-300"
                }`}
        >
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex items-center">
                    <span
                        className={`w-4 h-4 border rounded-full mr-4 flex items-center justify-center ${isOpen
                                ? isCorrect
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                : "bg-white"
                            }`}
                    >
                        {isOpen ? (
                            isCorrect ? (
                                // Checkmark for correct answer
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-3 h-3"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            ) : (
                                // Cross for incorrect answer
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-3 h-3"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )
                        ) : null}
                    </span>
                    <span
                        className={`text-gray-800 ${isOpen ? "font-semibold" : ""
                            }`}
                    >
                        {title}
                    </span>
                </div>
                <span className="text-gray-400">
                    {isOpen ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    )}
                </span>
            </div>
            {isOpen && (
                <div className="p-4 text-gray-700 border-t border-gray-300">
                    {content}
                </div>
            )}
        </div>
    );
};

const Accordion = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const items = [
        {
            title: "Carpal Tunnel Syndrome",
            content:
                "This is the correct answer explanation. It's meant to be a long answer to elaborate on the topic.",
            isCorrect: true,
        },
        {
            title: "Rotator Cuff Tear",
            content: "This is an incorrect answer explanation.",
            isCorrect: false,
        },
        {
            title: "Tennis Elbow",
            content: "This is another incorrect answer explanation.",
            isCorrect: false,
        },
    ];
    return (
        <div className="max-w-md mx-auto">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    content={item.content}
                    isOpen={openIndex === index}
                    onToggle={() => handleToggle(index)}
                    isCorrect={item.isCorrect}
                />
            ))}
        </div>
    );
};

export default Accordion;

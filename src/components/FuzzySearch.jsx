import React, { useState } from "react";

const SearchResults = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const results = [
        {
            category: "Modules / Conditions",
            items: [
                {
                    type: "Mod",
                    label: "Acute Emergency",
                    description: "",
                    color: "bg-green-200 text-green-800",
                },
                {
                    type: "Con",
                    label: "Acoustic Neuroma",
                    description: "Ears, Nose and Throat",
                    color: "bg-orange-200 text-orange-800",
                },
            ],
        },
       
    ];

    const filteredResults = results.map((section) => ({
        ...section,
        items: section.items.filter(
            (item) =>
                item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.description &&
                    item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        ),
    }));

    return (
        <div className="w-[720px]  p-4">
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </div>


            {/* Display filtered results */}
            {filteredResults.map((section, index) => (
                <div key={index} className="mb-6 bg-white rounded-[8px]">
                    <h2 className="text-sm font-semibold text-[#27272A] mb-3 px-4 py-2">
                        {section.category}

                    </h2>
                    <hr />
                    <ul className="">
                        {section.items.length === 0 ? (
                            <p>No results found</p>
                        ) : (
                            section.items.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="flex justify-between items-center  p-4 "
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`text-[12px] font-bold px-2 py-1 rounded-[4px] ${item.color}`}
                                        >
                                            {item.type}
                                        </span>
                                        <div className="flex items-center gap-x-3">
                                            <p className="text-[#3F3F46] text-sm font-bold ">{item.label}</p>
                                            {item.description && (
                                                <p className="text-[#71717A] italic text-[14px] ">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;

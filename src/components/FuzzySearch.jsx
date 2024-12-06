import React, { useState } from "react";
import { LiaSearchSolid } from "react-icons/lia";

const SearchComponent = () => {
    const [query, setQuery] = useState("");

    // Sample data
    const data = {
        "Modules / Conditions": [
            { type: "Mod", label: "Acute Emergency", category: "" },
            { type: "Con", label: "Acoustic Neuroma", category: "Ears, Nose and Throat" },
        ],
        "Also Mentioned In...": [
            { type: "Con", label: "Acne", category: "Dermatology" },
            { type: "Con", label: "Acute Bronchitis", category: "Respiratory" },
            { type: "Con", label: "Acute Bronchitis", category: "Respiratory" },
            { type: "Con", label: "Acute Bronchitis", category: "Respiratory" },
        ],
    };

    const filteredData = Object.entries(data).reduce((acc, [section, items]) => {
        const filteredItems = items.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
        );
        if (filteredItems.length > 0) {
            acc[section] = filteredItems;
        }
        return acc;
    }, {});

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search for anything"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <LiaSearchSolid />
                </span>
            </div>

            {/* Search Results */}
            {Object.entries(filteredData).map(([section, items], index) => (
                <div key={index} className="mb-6">
                    <h3 className="text-sm font-bold text-gray-600 mb-2">{section}</h3>
                    <ul className="space-y-3">
                        {items.map((item, idx) => (
                            <li
                                key={idx}
                                className="flex items-start justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Tag */}
                                    <span
                                        className={`px-2 py-1 rounded text-white text-xs ${item.type === "Mod"
                                                ? "bg-green-500"
                                                : "bg-orange-500"
                                            }`}
                                    >
                                        {item.type}
                                    </span>
                                    {/* Label */}
                                    <div>
                                        <p className="font-medium text-gray-900">{item.label}</p>
                                        {item.category && (
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {/* No Results */}
            {query && Object.keys(filteredData).length === 0 && (
                <p className="text-center text-gray-500">No results found.</p>
            )}
        </div>
    );
};

export default SearchComponent;

import React, { useState } from "react";

const SearchResults = ({ result, searchRef }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample Data for default view
  const sampleData = [
    {
      type: "Mod",
      label: "Haemolytic Uraemic Syndrome (HUS)",
      description:
        "An Overview, Pathophysiology, Types, Epidemiology, Diagnostic Criteria, Management, Follow-up and Special Considerations, Study Tips",
      color: "bg-green-200 text-green-800",
    },
    {
      type: "Mod",
      label: "Otitis Media",
      description:
        "Definition, Epidemiology, Aetiology, Differential Diagnosis, Signs and Symptoms, Investigations, Causes, Management",
      color: "bg-green-200 text-green-800",
    },
  ];

  // Real Data ko filter karo agar searchTerm me kuch likha ho
  const filteredResults =
    result?._docs?.length > 0
      ? result._docs
          .filter((item) =>
            item.articleTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((item) => ({
            type: "Mod",
            label: item.articleTitle,
            description: item.articleSubSections?.join(", ") || "",
            color: "bg-green-200 text-green-800",
          }))
      : [];

  // Final Data to Show
  const displayResults =
    searchTerm.trim() === "" ? sampleData : filteredResults;
console.log("filteredResults:",filteredResults);

  return (
    <div className="w-[720px] p-4" ref={searchRef}>
      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      {/* Results Section */}
      <div className="mb-6 rounded-[8px] bg-white">
        <h2 className="mb-3 px-4 py-2 text-sm font-semibold text-[#27272A]">
          Modules / Conditions
        </h2>
        <hr />
        <div className="max-h-[400px] overflow-auto">
          <ul>
            {displayResults.length === 0 ? (
              <p className="p-4 text-gray-500">No results found</p>
            ) : (
              displayResults.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-[4px] px-2 py-1 text-[12px] font-bold ${item.color}`}
                    >
                      {item.type}
                    </span>
                    <div className="flex items-center gap-x-3">
                      <p className="text-sm font-bold text-[#3F3F46]">
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-[14px] italic text-[#71717A]">
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
      </div>
    </div>
  );
};

export default SearchResults;

import React, { useState } from "react";
import { Link } from "react-router-dom";

const SearchResults = ({
  result,
  searchRef,
  secondSearchRef,
  setShowModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample Data for default view
  const sampleData = [
    {
      type: "Mod",
      label: "Acute and emergency",
      description: "1",
      color: "bg-[#3CC8A1] text-white",
    },
  ];

  const filteredResults = result?._docs?.flatMap((item) => {
    let modules = [];
    let conditions = [];

    // 🟢 Searching in totalModule (Mod)
    if (Array.isArray(item.totalModule)) {
      modules = item.totalModule
        .filter((mod) =>
          mod.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .map((mod) => ({
          type: "Mod",
          label: mod.categoryName,
          description: `${mod.categoryId}`,
          color: "bg-[#3CC8A1] text-white",
        }));
    }

    // 🟠 Searching in textbook.conditionNames (Con)
    if (Array.isArray(item.textbook?.conditionNames)) {
      let id = item.moduleId;
      conditions = item.textbook.conditionNames
        .filter((con) =>
          con.conditionName.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .map((con) => ({
          type: "Con",
          label: con.conditionName,
          description: `${con.conditionNamesId}`, // Condition ID
          moduleId: id, // Add Module ID for URL
          color: "bg-[#FF9741] text-white",
        }));
    }

    return [...modules, ...conditions];
  });

  // Remove duplicates (if any)
  const uniqueResults = Array.from(
    new Map(filteredResults.map((item) => [item.label, item])).values(),
  );

  const handleClick = () => {
    setShowModal(false); // Li ya Link click hone par modal band ho jayega
  };
  // Final data to display
  const displayResults = searchTerm.trim() === "" ? sampleData : uniqueResults;

  return (
    <div className="w-[90%] sm:w-[70%] xl:w-[720px]" ref={searchRef}>
      {/* Search Input */}
      <div className="relative mb-6">
        <input
          ref={secondSearchRef}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-3 pl-10 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
              displayResults.map((item, idx) => {
                const route =
                  item.type === "Mod"
                    ? `/condition-name/${item.description}`
                    : `/textbook-content/${item.moduleId}/${item.description}`;

                return (
                  <Link key={idx} to={route} onClick={handleClick}>
                    <li className="flex w-fit cursor-pointer items-center justify-between p-4">
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
                        </div>
                      </div>
                    </li>
                  </Link>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

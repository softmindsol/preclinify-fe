import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaAngleLeft } from "react-icons/fa6";
import Fuse from 'fuse.js';

const SubModule = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Hook to navigate programmatically

    const categories = [
        "Acid-base abnormality",
        "Acute bronchitis",
        "Acute coronary syndromes",
        "Acute kidney injury",
        "Allergic disorder",
        "Anaphylaxis",
        "Aortic aneurysm",
        "Arrhythmias",
        "Cardiac arrest",
        "Cardiac failure",
        "Chronic obstructive pulmonary disease",
        "Compartment syndrome",
        "Deep vein thrombosis",
        "Dehydration",
        "Diabetic ketoacidosis",
        "Drug overdose",
        "Ectopic pregnancy",
        "Epilepsy",
        "Epistaxis",
        "Extradural haemorrhage",
        "Gastrointestinal perforation",
        "Haemoglobinopathies",
        "Hyperosmolar hyperglycaemic state",
    ];
    const [query, setQuery] = useState("");
    const fuse = new Fuse(categories, { keys: ["name"], threshold: 0.4 });

    // Perform fuzzy search
    const results = query ? fuse.search(query).map((result) => result.item) : categories;

    return (
        <div className="flex w-full min-h-screen ">
            {/* Sidebar Section */}
            <div className="">
                <Sidebar />
            </div>

            {/* Main Content Section */}
            <div className="flex-1 p-8">
                {/* Back Button */}
                <div className="flex justify-between items-center gap-x-5 mb-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-x-2 bg-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg"
                    >
                        <FaAngleLeft color="#3CC8A1" />
                        <span className="text-[16px] font-semibold text-[#3CC8A1]">
                            Back To All Modules
                        </span>
                    </button>

                    <div className="flex justify-end mt-6">
                        <input
                            type="search"
                            placeholder="Search for anything"
                            className="p-2 pl-4 w-full max-w-[400px] rounded-md "
                            value={query}
                            onChange={(e) => setQuery(e.target.value)} // Update query state on input change
                        />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-[24px] font-bold text-[#27272A]">Acute and Emergency</h1>

                {/* Search Bar */}
              

                {/* Categories List */}
                <div className="bg-white rounded-md p-5 mt-6 shadow-md">
                    <ul className="divide-y divide-gray-200">
                        {results.length > 0 ? (
                            results.map((category, index) => (
                                <li
                                    key={index}
                                    className="py-3 text-[#000000] text-[14px] font-semibold hover:bg-gray-100 cursor-pointer"
                                >
                                    {category}
                                </li>
                            ))
                        ) : (
                            <li className="py-3 text-gray-500">No results found</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SubModule;

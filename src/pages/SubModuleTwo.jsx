import Fuse from "fuse.js";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaAngleLeft } from "react-icons/fa";

const SubModuleTwo = () => {
    const [notes, setNotes] = useState("");
    const [showContents, setShowContents] = useState(true);
    const [showSiblingArticles, setShowSiblingArticles] = useState(true);

    const [query, setQuery] = useState("");
    const fuse = new Fuse([], { keys: ["name"], threshold: 0.4 });
    const { id } = useParams();
    const navigate = useNavigate();

    // Perform fuzzy search
    const results = query ? fuse.search(query).map((result) => result.item) : [];

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar Section */}
            <div className="w-[240px]">
                <Sidebar />
            </div>

            {/* Main Content Section */}
            <div className="flex-1 p-5">
                {/* Back Button and Search */}
                <div className="flex justify-between items-center gap-5 mb-5 ml-5">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-x-2 bg-white rounded-lg px-4 py-2 hover:shadow-lg"
                    >
                        <FaAngleLeft color="#3CC8A1" />
                        <span className="text-[16px] font-semibold text-[#3CC8A1]">
                            Back To Modules
                        </span>
                    </button>

                    {/* Search Input */}
                    <div className="w-full max-w-[400px]">
                        <input
                            type="search"
                            placeholder="Search for anything"
                            className="p-2 pl-4 w-[320px] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-[12px] md:placeholder:text-[14px] placeholder:text-[#D4D4D8]"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Module Details */}
                <div className="flex justify-center gap-5 ">
                    <div className="bg-white w-[640px] rounded-lg p-6 space-y-10 shadow-md">
                        {/* Breadcrumb and Title */}
                        <div>
                            <p className="text-[#A1A1AA] font-semibold text-sm">
                                {`All Modules > Ear, Nose, and Throat > Acoustic Neuroma`}
                            </p>
                            <h1 className="text-[#3F3F46] text-3xl font-bold">
                                Acoustic Neuroma
                            </h1>
                        </div>

                        {/* Sections */}
                        {[
                            {
                                title: "DEFINITION",
                                content: [
                                    "Acoustic neuromas are also known as vestibular schwannomas.",
                                    "They are benign subarachnoid tumours linked to problems associated with hearing and balance due to pressure on cranial nerve VII (CN VIII - vestibulocochlear nerve).",
                                ],
                            },
                            {
                                title: "EPIDEMIOLOGY",
                                content: [
                                    "This is a rare condition thought to occur in 1 in 100,000 people annually.",
                                    "There is a greater incidence in patients between 40-60 years old.",
                                ],
                            },
                            {
                                title: "PATHOPHYSIOLOGY",
                                content: [
                                    "Benign tumour cells proliferate and develop from the Schwann cells of CN VIII, which are cells that provide the myelin sheath around neurones and help make up the peripheral nervous system.",
                                    "Malignant transformation of acoustic neuromas is rare.",
                                ],
                            },
                            {
                                title: "AETIOLOGY",
                                content: [
                                    "The majority of cases are sporadic.",
                                    "Genetic - neurofibromatosis type II is a rare condition associated with bilateral acoustic neuromas. This may happen due to variation in the NF2 gene.",
                                ],
                            },
                            {
                                title: "RISK FACTORS",
                                content: [
                                    "Several risk factors have been investigated but have conflicting evidence suggesting their association with acoustic neuromas, including:",
                                    "Low-dose radiation exposure from childhood",
                                    "High noise exposure",
                                    "Consistently high mobile phone use",
                                ],
                            },
                        ].map((section, index) => (
                            <div key={index} className="space-y-3">
                                <h2 className="text-[#3CC8A1] text-lg font-extrabold">
                                    {section.title}
                                </h2>
                                {section.content.map((paragraph, i) => (
                                    <p
                                        key={i}
                                        className="text-[16px] text-[#3F3F46] font-light"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="bg-transparent text-white p-6 w-[320px] space-y-8">
                        {/* Notes Section */}
                        <div>
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setShowContents(!showContents)}
                            >
                                <h2 className="text-[14px] font-semibold text-[#27272A] ">- Notes</h2>
                                <div>
                                    <hr />
                                </div>
                               
                            </div>
                            <div className="mt-4">
                                <textarea
                                    className="w-full h-32 bg-transparent border border-gray-400 rounded-md p-2 text-sm"
                                    placeholder="This is an example note that a user would have for this topic."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                                <div className="text-end">
                                    <button className=" text-[#3CC8A1]  border border-[#3CC8A1] w-[125px] h-[32px]  font-semibold text-[14px] rounded-md ">
                                        Save My Notes
                                    </button>
                                </div>
                               
                            </div>
                        </div>

                        {/* Contents Section */}
                        <div>
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setShowContents(!showContents)}
                            >
                                <h2 className="text-sm font-semibold text-[#27272A] ">
                                   - Contents
                                </h2>
                            </div>
                            {showContents && (
                                <ul className="mt-4 space-y-2 text-[#71717A] text-sm">
                                    <li className="text-[#27272A] font-bold">Definition</li>
                                    <li>Epidemiology</li>
                                    <li>Pathophysiology</li>
                                    <li>Aetiology</li>
                                    <li>Risk Factors</li>
                                    <li>Features</li>
                                    <li>Signs</li>
                                    <li>Associations</li>
                                    <li>Differentials</li>
                                    <li>Referrals</li>
                                    <li>Investigations</li>
                                    <li>Diagnostic Criteria</li>
                                    <li>Management</li>
                                </ul>
                            )}
                        </div>

                        {/* Sibling Articles Section */}
                        <div>
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setShowSiblingArticles(!showSiblingArticles)}
                            >
                                <h2 className="text-sm font-semibold text-[#27272A] ">
                                    Sibling Articles
                                </h2>
                            </div>
                            {showSiblingArticles && (
                                <div className="mt-4 text-[#71717A] text-sm">
                                    <p className="">
                                        Ear, Nose, and Throat
                                    </p>
                                    <ul className="mt-2 space-y-2 ">
                                        <li>
                                            Benign paroxysmal positional vertigo
                                        </li>
                                        <li>Epiglottitis</li>
                                        <li>Epistaxis</li>
                                        <li>Infectious mononucleosis</li>
                                        <li>Meniere’s disease</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubModuleTwo;

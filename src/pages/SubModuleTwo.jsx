import Fuse from "fuse.js";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaAngleLeft } from "react-icons/fa";
import SearchResults from "../components/FuzzySearch";
import { RxCross2 } from "react-icons/rx";
import Logo from '../components/Logo';
import { TbBaselineDensityMedium } from "react-icons/tb";

import Drawer from 'react-modern-drawer'
//import styles 👇
import 'react-modern-drawer/dist/index.css'
const SubModuleTwo = () => {
    const [notes, setNotes] = useState("");
    const [showContents, setShowContents] = useState(true);
    const [showSiblingArticles, setShowSiblingArticles] = useState(true);
    const [query, setQuery] = useState("");
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    const fuse = new Fuse([], { keys: ["name"], threshold: 0.4 });
    const { id } = useParams();
    const navigate = useNavigate();

    // Perform fuzzy search
    const results = query ? fuse.search(query).map((result) => result.item) : [];

    const handleSearchClick = () => {
        setShowModal(true); // Show modal when the input is clicked
    };

    const closeModal = () => {
        setShowModal(false); // Close modal
    };

    const [isOpen, setIsOpen] = useState(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }


    return (
        <div className=" md:flex h-screen w-full">
            {/* Sidebar Section */}
            <div className="hidden md:block w-[240px]">
                <Sidebar />
            </div>
            {/* Header */}
            <div className='flex items-center justify-between p-5 bg-white md:hidden w-full'>
                <div className=''>
                    <img src="/assets/small-logo.png" alt="" />
                </div>

                <div className='' onClick={toggleDrawer}>
                    <TbBaselineDensityMedium />
                </div>
            </div>

            {/* Main Content Section */}
            <div className=" flex-1 py-2 md:p-5">
                {/* Back Button and Search */}
                <div className="flex justify-between items-center gap-5 px-3 md:p-0 mb-5 md:ml-5">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[12px] lg:text-[16px] gap-x-2 bg-white rounded-lg px-4 py-2 hover:shadow-lg"
                    >
                        <FaAngleLeft color="#3CC8A1" />
                        <span className=" font-semibold text-[#3CC8A1]">
                            Back To Modules
                        </span>
                    </button>

                    {/* Search Input */}
                    <div className="">
                        <input
                            type="search"
                            placeholder="Search for anything"
                            className="p-1 lg:p-2 pl-4 w-[180px] sm:w-[250px] lg:w-[320px]  rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-[12px] md:placeholder:text-[14px] placeholder:text-[#D4D4D8]"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onClick={handleSearchClick} // Open modal on input click
                        />
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

                        <SearchResults results={results} />
                    </div>
                )}

                {/* Module Details */}
                <div className="flex justify-center gap-5 ">
                    <div className="bg-white md:mx-5 2xl:w-[640px] md:rounded-lg p-6 space-y-10 shadow-md">
                        {/* Breadcrumb and Title */}
                        <div>
                            <p className="text-[#A1A1AA] font-semibold text-sm">
                                {`All Modules > Ear, Nose, and Throat > Acoustic Neuroma`}
                            </p>
                            <h1 className="text-[#3F3F46] mt-2 text-3xl font-bold">
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
                            }].map((section, index) => (
                                <div key={index} className="space-y-3">
                                    <h2 className="text-[#3CC8A1] text-lg font-extrabold">
                                        {section.title}
                                    </h2>
                                    {section.content.map((paragraph, i) => (
                                        <p key={i} className="text-[16px] text-[#3F3F46] font-light">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            ))}
                    </div>

                    <div className="bg-transparent text-white p-6 w-[400px] hidden lg:block 2xl:w-[320px] space-y-8">
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
                                    className="w-full h-32 bg-transparent text-black border border-gray-400 rounded-md p-2 text-sm"
                                    placeholder="This is an example note that a user would have for this topic."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                                <div className="text-end">
                                    <button className=" text-[#3CC8A1]  border border-[#3CC8A1] w-[125px] h-[32px]  font-semibold text-[14px] rounded-md transition-all duration-200 hover:bg-[#3CC8A1] hover:text-white">
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

            {/* Icons */}
            <div
                className="fixed bottom-36 right-5 "
                value={query}
                onChange={(e) => setQuery(e.target.value)}>
                <div className="bg-[#3CC8A1] text-white rounded-[4px] p-2 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sticky-note"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" /><path d="M15 3v4a2 2 0 0 0 2 2h4" /></svg>
                </div>
            </div>
            <div
                className="fixed bottom-20 right-5 "
                value={query}
                onChange={(e) => setQuery(e.target.value)}>
                <div className="bg-[#3CC8A1] text-white rounded-[4px] p-2 cursor-pointer ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading"><path d="M6 12h12" /><path d="M6 20V4" /><path d="M18 20V4" /></svg>
                </div>
            </div>
            <div
                className="fixed bottom-5 right-5 "
                value={query}
                onChange={(e) => setQuery(e.target.value)}>
                <div className="bg-[#3CC8A1] text-white rounded-[4px] p-2 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
            </div>
            <Drawer
                open={isOpen}
                onClose={toggleDrawer}
                direction='right'
                className='bla bla bla'
                lockBackgroundScroll={true}
            >
                <div className='m-5' onClick={toggleDrawer}>
                    <RxCross2 />
                </div>

                <div className="mb-10 flex items-center justify-center">
                    <Logo />
                </div>
                <div className='flex min-h-screen overflow-y-auto  flex-col  justify-between'>


                    <nav className="space-y-5 w-full  text-[#3F3F46]">
                        {[
                            { name: "Dashboard", icon: "house" },
                            { name: "Practice", icon: "dumbbell" },
                            { name: "Performance", icon: "chart-line" },
                            { name: "Friends", icon: "git-merge" },
                            { name: "Textbook", icon: "book-open" },
                            { name: "OSCE", icon: "bed" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 px-6 group cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`lucide lucide-${item.icon} group-hover:text-[#3CC8A1]`}
                                >
                                    {/* Define paths for the icons */}
                                    {item.icon === "house" && (
                                        <>
                                            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        </>
                                    )}
                                    {item.icon === "dumbbell" && (
                                        <>
                                            <path d="M14.4 14.4 9.6 9.6" />
                                            <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
                                            <path d="m21.5 21.5-1.4-1.4" />
                                            <path d="M3.9 3.9 2.5 2.5" />
                                            <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
                                        </>
                                    )}
                                    {item.icon === "chart-line" && (
                                        <>
                                            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                                            <path d="m19 9-5 5-4-4-3 3" />
                                        </>
                                    )}
                                    {item.icon === "git-merge" && (
                                        <>
                                            <circle cx="18" cy="18" r="3" />
                                            <circle cx="6" cy="6" r="3" />
                                            <path d="M6 21V9a9 9 0 0 0 9 9" />
                                        </>
                                    )}
                                    {item.icon === "book-open" && (
                                        <>
                                            <path d="M12 7v14" />
                                            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                                        </>
                                    )}
                                    {item.icon === "bed" && (
                                        <>
                                            <path d="M2 4v16" />
                                            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                                            <path d="M2 17h20" />
                                            <path d="M6 8v9" />
                                        </>
                                    )}
                                </svg>
                                <span className="text-[14px] font-medium group-hover:text-[#3CC8A1]">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Settings */}
                    <div className="mt-auto w-full mb-40 px-6">
                        <Link to={'/setting'}>
                            <div className="flex items-center space-x-3 text-[#3F3F46] group cursor-pointer">
                                <i className="fa fa-cog text-xl group-hover:text-[#3CC8A1]"></i>
                                <span className="text-[14px] font-medium group-hover:text-[#3CC8A1]">
                                    Settings
                                </span>
                            </div>
                        </Link>

                    </div>

                </div>

            </Drawer>
        </div>
    );
};

export default SubModuleTwo;

import React, { useState } from "react";
import Fuse from "fuse.js"; // Import Fuse.js
import Sidebar from "./common/Sidebar";
import { LiaSearchSolid } from "react-icons/lia";
import { RxCross2 } from "react-icons/rx";
import { TbBaselineDensityMedium } from "react-icons/tb";
import Logo from '../components/common/Logo';

import Drawer from 'react-modern-drawer'
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import { Link } from 'react-router-dom';
const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }

    const categories = [
        "Acute and Emergency",
        "Allergy and Immunology",
        "Biomedical Sciences",
        "Cancer",
        "Cardiovascular",
        "Child Health",
        "Clinical Biochemistry",
        "Clinical Haematology",
        "Clinical Imaging",
        "Clinical Pharmacology and Therapeutics",
        "Dermatology",
        "Ear, Nose and Throat",
        "Endocrine and Metabolic",
        "Gastrointestinal including Liver",
        "General Practice and Primary Healthcare",
        "Genetics and Genomics",
        "Histopathology",
        "Human Factors and Quality Improvement",
        "Laboratory Haematology",
        "Medical Ethics and Law",
        "Medicine of Older Adult",
        "Mental Health",
        "Microbiology",
        "Musculoskeletal",
    ];

    // State to handle search query and filtered results
    const [query, setQuery] = useState("");
    const fuse = new Fuse(categories, { keys: ["name"], threshold: 0.4 });

    // Perform fuzzy search
    const results = query ? fuse.search(query).map((result) => result.item) : categories;

    return (
        <div className="md:flex">
            <div className=" hidden md:block">
                <Sidebar />
            </div>
            <div className='flex items-center justify-between p-5 bg-white md:hidden w-full'>
                <div className=''>
                    <img src="/assets/small-logo.png" alt="" />
                </div>

                <div className='' onClick={toggleDrawer}>
                    <TbBaselineDensityMedium />
                </div>
            </div>

            <div className="md:py-8 md:px-4 w-full">
                {/* Search Bar */}
                <div className="hidden md:flex justify-end">
                    <div className="relative w-[320px]">
                        <input
                            type="search"
                            placeholder="Search for anything"
                            className="p-2 pl-10 w-full rounded-[8px] focus:outline-none focus:ring-2 focus:ring-gray-400"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)} // Update query state on input change
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <LiaSearchSolid />
                        </span>
                    </div>
                </div>

                {/* Categories List */}
                <div className="bg-white rounded-[2px] p-2 md:p-5 mt-3 md:mt-10">
                    <ul className="divide-y divide-gray-200 w-full">
                        {results.length > 0 ? (
                            results.map((category, index) => (
                                <li key={index} className="py-4 hover:bg-gray-100 ">
                                    <Link
                                        to={`/dashboard/${category.replace(/ /g, "-")}`} // Dynamic route
                                        className="text-[#000000] text-[14px] font-semibold p-4   cursor-pointer"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="py-4 text-gray-500">No results found</li>
                        )}
                    </ul>
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

export default Dashboard;

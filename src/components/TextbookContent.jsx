import Fuse from "fuse.js";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { FaAngleLeft } from "react-icons/fa";
import SearchResults from "../components/FuzzySearch";
import { RxCross2 } from "react-icons/rx";
import Logo from '../components/common/Logo';
import { TbBaselineDensityMedium } from "react-icons/tb";

import Drawer from 'react-modern-drawer'
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import MobileBar from "./common/Drawer";
const TextbookContent = () => {
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
      <div className="h-screen w-full md:flex">
        {/* Sidebar Section */}
        <div className="hidden w-[240px] md:block">
          <Sidebar />
        </div>
        {/* Header */}
        <div className="flex w-full items-center justify-between bg-white p-5 md:hidden">
          <div className="">
            <img src="/assets/small-logo.png" alt="" />
          </div>

          <div className="" onClick={toggleDrawer}>
            <TbBaselineDensityMedium />
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex-1 py-2 md:p-5">
          {/* Back Button and Search */}
          <div className="mb-5 flex items-center justify-between gap-5 px-3 md:ml-5 md:p-0">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-x-2 rounded-lg bg-white px-4 py-2 text-[12px] hover:shadow-lg lg:text-[16px]"
            >
              <FaAngleLeft color="#3CC8A1" />
              <span className="font-semibold text-[#3CC8A1]">
                Back To Modules
              </span>
            </button>

            {/* Search Input */}
            <div className="">
              <input
                type="search"
                placeholder="Search for anything"
                className="w-[180px] rounded-md p-1 pl-4 placeholder:text-[12px] placeholder:text-[#D4D4D8] focus:outline-none focus:ring-2 focus:ring-gray-400 sm:w-[250px] md:placeholder:text-[14px] lg:w-[320px] lg:p-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={handleSearchClick} // Open modal on input click
              />
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <SearchResults results={results} />
            </div>
          )}

          {/* Module Details */}
          <div className="flex justify-center gap-5">
            <div className="space-y-10 bg-white p-6 shadow-md md:mx-5 md:rounded-lg 2xl:w-[640px]">
              {/* Breadcrumb and Title */}
              <div>
                <p className="text-sm font-semibold text-[#A1A1AA]">
                  {`All Modules > Ear, Nose, and Throat > Acoustic Neuroma`}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-[#3F3F46]">
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
                  <h2 className="text-lg font-extrabold text-[#3CC8A1]">
                    {section.title}
                  </h2>
                  {section.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-[16px] font-light text-[#3F3F46]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <div className="hidden w-[400px] space-y-8 bg-transparent p-6 text-white lg:block 2xl:w-[320px]">
              {/* Notes Section */}
              <div>
                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => setShowContents(!showContents)}
                >
                  <h2 className="text-[14px] font-semibold text-[#27272A]">
                    - Notes
                  </h2>
                  <div>
                    <hr />
                  </div>
                </div>
                <div className="mt-4">
                  <textarea
                    className="h-32 w-full rounded-md border border-gray-400 bg-transparent p-2 text-sm text-black"
                    placeholder="This is an example note that a user would have for this topic."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <div className="text-end">
                    <button className="h-[32px] w-[125px] rounded-md border border-[#3CC8A1] text-[14px] font-semibold text-[#3CC8A1] transition-all duration-200 hover:bg-[#3CC8A1] hover:text-white">
                      Save My Notes
                    </button>
                  </div>
                </div>
              </div>

              {/* Contents Section */}
              <div>
                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => setShowContents(!showContents)}
                >
                  <h2 className="text-sm font-semibold text-[#27272A]">
                    - Contents
                  </h2>
                </div>
                {showContents && (
                  <ul className="mt-4 space-y-2 text-sm text-[#71717A]">
                    <li className="font-bold text-[#27272A]">Definition</li>
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
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => setShowSiblingArticles(!showSiblingArticles)}
                >
                  <h2 className="text-sm font-semibold text-[#27272A]">
                    Sibling Articles
                  </h2>
                </div>
                {showSiblingArticles && (
                  <div className="mt-4 text-sm text-[#71717A]">
                    <p className="">Ear, Nose, and Throat</p>
                    <ul className="mt-2 space-y-2">
                      <li>Benign paroxysmal positional vertigo</li>
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
          className="fixed bottom-36 right-5"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        >
          <div className="cursor-pointer rounded-[4px] bg-[#3CC8A1] p-2 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-sticky-note"
            >
              <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
              <path d="M15 3v4a2 2 0 0 0 2 2h4" />
            </svg>
          </div>
        </div>
        <div
          className="fixed bottom-20 right-5"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        >
          <div className="cursor-pointer rounded-[4px] bg-[#3CC8A1] p-2 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-heading"
            >
              <path d="M6 12h12" />
              <path d="M6 20V4" />
              <path d="M18 20V4" />
            </svg>
          </div>
        </div>
        <div
          className="fixed bottom-5 right-5"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        >
          <div className="cursor-pointer rounded-[4px] bg-[#3CC8A1] p-2 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-search"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
        <MobileBar
          toggleDrawer={toggleDrawer}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    );
};

export default TextbookContent;

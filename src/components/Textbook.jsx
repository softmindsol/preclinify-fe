import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "./common/Sidebar";
import { FaAngleLeft } from "react-icons/fa6";
import Fuse from "fuse.js";
import { TbBaselineDensityMedium } from "react-icons/tb";
import MobileBar from "./common/Drawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchModuleCategories } from "../redux/features/textbook/textbook.service";
const Textbook = () => {
  const categoryName = useSelector(
    (state) => state?.textbook?.textbookModules || [],
  );
  const { id } = useParams();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  console.log(categoryName);

  const [query, setQuery] = useState("");
  const fuse = new Fuse(categoryName?.categoryName, {
    keys: ["categoryName"],
    threshold: 0.4,
  });

  // Perform fuzzy search
  const results = query
    ? fuse.search(query).map((result) => result.item)
    : categoryName?.categoryName;

  useEffect(() => {
    dispatch(fetchModuleCategories());
  }, []);

  return (
    <div className="min-h-screen w-full lg:flex">
      {/* Sidebar Section */}
      <div className="fixed hidden h-full lg:block">
        <Sidebar />
      </div>
      <div className="flex w-full items-center justify-between bg-white p-5 lg:hidden">
        <div className="">
          <img src="/assets/small-logo.png" alt="" />
        </div>

        <div className="" onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>

      <div className="w-full lg:ml-[250px]">
        {/* Main Content Section */}
        <div className="flex-1 lg:p-8">
          {/* Back Button */}
          <div className="mb-2 flex items-center justify-end gap-x-5 p-2 lg:mb-5 lg:p-0">
            {/* <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-x-2 rounded-lg bg-white px-4 py-2 text-[12px] shadow-md hover:shadow-lg sm:text-[14px] lg:text-[16px]"
            >
              <FaAngleLeft color="#3CC8A1" />
              <span className="font-semibold text-[#3CC8A1]">
                Back To All Modules
              </span>
            </button> */}

            <div className="hidden justify-end lg:flex">
              <input
                type="search"
                placeholder="Search for anything"
                className="w-full max-w-[400px] rounded-md p-2 pl-4 placeholder:text-[12px] placeholder:font-light"
                value={query}
                onChange={(e) => setQuery(e.target.value)} // Update query state on input change
              />
            </div>
          </div>

          {/* Title */}
          {/* <h1 className="px-4 text-[20px] font-bold text-[#27272A] sm:text-[20px] lg:p-0 lg:text-[24px]">
            Acute and Emergency
          </h1> */}

          {/* Search Bar */}

          {/* Categories List */}
          <div className="mt-6">
            <ul className="divide-y divide-gray-300">
              {results?.length > 0 ? (
                results.map((category, index) => (
                  <Link to={`/textbook-content/${category?.categoryId}`}>
                    <li
                      key={index}
                      className="border-1 cursor-pointer border-b bg-white p-5 py-3 text-[14px] font-semibold text-[#000000]"
                    >
                      {category?.categoryName}
                    </li>
                  </Link>
                ))
              ) : (
                <li className="py-3 text-gray-500">No results found</li>
              )}
            </ul>
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
      </div>
      <MobileBar
        toggleDrawer={toggleDrawer}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default Textbook;

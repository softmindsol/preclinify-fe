import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "./common/Sidebar";
import { FaAngleLeft } from "react-icons/fa6";
import Fuse from "fuse.js";
import { TbBaselineDensityMedium } from "react-icons/tb";
import MobileBar from "./common/Drawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchModuleCategories } from "../redux/features/textbook/textbook.service";
import Loader from "./common/Loader";
const Textbook = () => {
  const categoryName = useSelector(
    (state) => state?.textbook?.textbookModules || [],
  );
  const { loading } = useSelector((state) => state?.textbook || []);
  const { id } = useParams();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  console.log("categoryName:", categoryName[0]?.totalModule);

  const [query, setQuery] = useState("");
  const fuse = new Fuse(categoryName[0]?.totalModule, {
    keys: ["categoryName"],
    threshold: 0.4,
  });

  // Perform fuzzy search
  const results = query
    ? fuse.search(query).map((result) => result.item)
    : categoryName[0]?.totalModule;

  useEffect(() => {
    dispatch(fetchModuleCategories());
  }, []);

  return (
    <div className="min-h-screen w-full md:flex">
      {/* Sidebar Section */}
      <div className="fixed hidden h-full md:block">
        <Sidebar />
      </div>
      <div className="flex w-full items-center justify-between bg-white p-5 md:hidden">
        <div className="">
          <img src="/assets/small-logo.png" alt="" />
        </div>

        <div className="" onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>

      <div className="w-full md:ml-[200px] lg:ml-[250px]">
        {/* Main Content Section */}
        <div className="flex-2 lg:p-[16px]">
          {/* Back Button */}
          <div className="mb-2 flex items-center justify-end gap-x-5 p-2 lg:mb-5 lg:p-0">
            <div className="flex justify-end">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search for anything"
                  className="w-full max-w-[400px] rounded-md p-2 pl-10 text-[14px] placeholder:pl-1 placeholder:text-[12px] placeholder:font-light"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)} // Update query state on input change
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Categories List */}
          {loading ? (
            <div className="">
              <Loader />
            </div>
          ) : (
            <div className="mt-3 md:mr-6 lg:mr-0 lg:mt-6">
              <ul className="divide-y divide-gray-300">
                {results?.length > 0 ? (
                  results.map((category, index) => (
                    <Link to={`/condition-name/${category?.categoryId}`}>
                      <li
                        key={index}
                        className="border-1 cursor-pointer border-b bg-white p-5 py-3 text-[14px] font-semibold text-[#000000]"
                      >
                        <span className="hover:text-gray-400">
                          {" "}
                          {category?.categoryName}
                        </span>
                      </li>
                    </Link>
                  ))
                ) : (
                  <li className="py-3 text-center text-gray-500">
                    No results found
                  </li>
                )}
              </ul>
            </div>
          )}
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

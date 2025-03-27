import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { FaAngleLeft } from "react-icons/fa";
import SearchResults from "../components/FuzzySearch";
import { RxCross2 } from "react-icons/rx";
import Logo from "../components/common/Logo";
import { TbBaselineDensityMedium } from "react-icons/tb";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../components/markdown-render/articleStyles.css";
import rehypeRaw from "rehype-raw";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import MobileBar from "./common/Drawer";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchModuleCategories,
  getNotesByModuleId,
  insertOrUpdateNotes,
} from "../redux/features/textbook/textbook.service";
import Loader from "./common/Loader";

const TextbookContent = () => {
  const [notes, setNotes] = useState("");
  const [showContents, setShowContents] = useState(true);
  const [showSiblingArticles, setShowSiblingArticles] = useState(true);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { textbook, categoryName } = useSelector(
    (state) => state?.textbook?.textbookModules || [],
  );

  const [condition, setConditions] = useState([]);
  const [data, setData] = useState([]);
  const { moduleId, id } = useParams();

  const articles = useSelector(
    (state) => state?.textbook?.textbookModules || [],
  );
  const [loading, setLoading] = useState(true);

  const loader = useSelector((state) => state?.textbook?.loading);
  const note = useSelector((state) => state?.textbook?.notes);
  const [noteError, setNoteError] = useState(false);
  const userId = localStorage.getItem("userId");
  const [fuse, setFuse] = useState(null);
  const [article, setArticle] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const secondSearchRef = useRef(null);

  const searchRef = useRef(null);
  const [showNotes, setShowNotes] = useState(true);
  const textareaRef = useRef(null);

  const handleContentShow = () => {
    setShowContents(!showContents);
  };
  const handleNotesShow = () => {
    setShowNotes(!showNotes);
  };
  const handleSvgClick = () => {
    textareaRef.current.focus();
  };
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (articles && articles.length > 0) {
      setFuse(
        new Fuse(articles, {
          keys: ["articles"],
          threshold: 0.3,
        }),
      );
    }
  }, [articles]);

  const handleSearch = () => {
    setShowModal(true);
    setTimeout(() => {
      secondSearchRef.current?.focus();
    }, 100);
  };

  const handleSave = () => {
    if (notes.trim() === "") {
      setNoteError(true);
    } else {
      dispatch(insertOrUpdateNotes({ notes, moduleId: id, userId }))
        .unwrap()
        .then(() => {
          setNoteError(false);
          setNotes("");
          return dispatch(
            getNotesByModuleId({ userId, moduleId: id }),
          ).unwrap();
        })
        .then((data) => {
          setNotes(data);
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    if (id) {
      const conditionNames = articles?.find(
        (data) => data.moduleId == moduleId,
      );
      setConditions(conditionNames);
    }
    if (condition) {
      setData(
        condition?.textbook?.conditionNames?.find(
          (cond) => cond.conditionNamesId == id,
        ),
      );
    }
  }, [condition, id, articles]);

  const extractHeadings = (markdown) => {
    if (typeof markdown !== "string" || !markdown) {
      console.error("markdownContent is not a valid string:", markdown);
      return {
        h1: "Default Heading",
        h2: [],
      };
    }

    const lines = markdown.split("\n");
    let h1Heading = "Default Heading";
    const h2Headings = [];

    for (const line of lines) {
      if (line.startsWith("# ") && !line.startsWith("##")) {
        h1Heading = line.replace("# ", "").trim();
      } else if (line.startsWith("## ")) {
        h2Headings.push(line.replace("## ", "").trim());
      }
    }

    return {
      h1: h1Heading,
      h2: h2Headings,
    };
  };

  const { h1, h2 } = extractHeadings(data?.textContent);

  // Function to split markdown content by h2 headings and assign IDs
 const renderSections = (markdown) => {
   if (typeof markdown !== "string" || !markdown)
     return <div>No content available</div>;

   const lines = markdown.split("\n");
   const sections = [];
   let currentSection = [];
   let sectionIndex = -1;

   lines.forEach((line) => {
     if (line.startsWith("## ")) {
       if (currentSection.length > 0) {
         sections.push({
           id: `section-${sectionIndex}`,
           content: currentSection.join("\n"),
         });
       }
       sectionIndex++;
       currentSection = [line];
     } else if (currentSection.length > 0) {
       currentSection.push(line);
     }
   });

   if (currentSection.length > 0) {
     sections.push({
       id: `section-${sectionIndex}`,
       content: currentSection.join("\n"),
     });
   }

   return sections.map((section) => (
     <div key={section.id} id={section.id} className="space-y-3">
       <div className="markdown-text-container">
         <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
           {section.content}
         </ReactMarkdown>
       </div>
     </div>
   ));
 };

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const offset = 100;
    const sectionPosition =
      section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: sectionPosition - offset,
      behavior: "smooth",
    });
    setActiveSection(sectionId);
  }
};

  useEffect(() => {
    dispatch(getNotesByModuleId({ userId, moduleId: id }))
      .unwrap()
      .then((data) => {
        setNotes(data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // Ensure loading is false even on error
      });
  }, [id, dispatch, userId, moduleId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchModuleCategories());
  }, [dispatch]);

  return (
    <div className="h-screen w-full lg:flex">
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

      <div className="w-full">
        {loading ? (
          <div className="ml-[100px] w-[100%]">
            <Loader />
          </div>
        ) : (
          <div>
            <div className="flex-1 py-2 md:p-5 lg:ml-[250px]">
              <div className="mb-5 flex items-center justify-between gap-5 px-3 md:ml-5 md:p-0">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-x-2 rounded-lg bg-white px-4 py-2 text-[12px] hover:shadow-lg lg:text-[16px]"
                >
                  <FaAngleLeft color="#3CC8A1" />
                  <span className="font-semibold text-[#3CC8A1]">
                    Back To Condition
                  </span>
                </button>
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search for anything"
                    className="w-full max-w-[400px] rounded-md p-2 pl-10 text-[14px] placeholder:pl-1 placeholder:text-[12px] placeholder:font-light"
                    onClick={handleSearch}
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

              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <SearchResults
                    result={fuse}
                    searchRef={searchRef}
                    secondSearchRef={secondSearchRef}
                    setShowModal={setShowModal}
                  />
                </div>
              )}

              <div className="flex justify-center gap-5">
                <div className="w-[550px] space-y-7 bg-white p-6 shadow-md md:mx-3 md:rounded-lg xl:w-[750px]">
                  <div>
                    <p className="flex items-center text-[12px] font-semibold text-[#A1A1AA] lg:text-sm">
                      {`All Modules > `}
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {data?.conditionName}
                      </ReactMarkdown>
                      {` > `}
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {h1}
                      </ReactMarkdown>
                    </p>
                  </div>

                  {/* Render sections dynamically */}
                  {renderSections(data?.textContent)}
                </div>

                <div className="hidden w-[400px] space-y-8 bg-transparent text-white md:block lg:w-[320px]">
                  <div>
                    <div className="flex cursor-pointer items-center justify-between">
                      <h2
                        className="flex items-center text-[14px] font-semibold text-[#27272A]"
                        onClick={handleNotesShow}
                      >
                        {showNotes ? (
                          <div
                            className="border-t-1 mr-2 border border-black"
                            style={{ width: "10px" }}
                          />
                        ) : (
                          <div className="mr-2" style={{ width: "10px" }}>
                            +{" "}
                          </div>
                        )}
                        Notes
                      </h2>
                    </div>
                    <hr className="mt-2 w-full" />
                    <div
                      className={`mt-4 transition-all duration-300 ${
                        showNotes
                          ? "max-h-40 opacity-100"
                          : "max-h-0 overflow-hidden opacity-0"
                      }`}
                    >
                      <textarea
                        ref={textareaRef}
                        className={`h-32 w-full rounded-md border bg-transparent p-2 text-sm text-black ${
                          noteError ? "border-red-500" : "border-gray-400"
                        }`}
                        placeholder="This is an example note that a user would have for this topic."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <div className="text-end">
                        <button
                          onClick={handleSave}
                          disabled={notes.trim() === ""}
                          className="h-[32px] w-[125px] rounded-md border border-[#3CC8A1] text-[14px] font-semibold text-[#3CC8A1] transition-all duration-200 hover:bg-[#3CC8A1] hover:text-white disabled:cursor-not-allowed disabled:bg-[#3CC8A1] disabled:text-white disabled:opacity-50"
                        >
                          {loader
                            ? "Saving..."
                            : notes.trim() === ""
                              ? "Save Note"
                              : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex cursor-pointer items-center justify-between">
                      <h2
                        className="flex items-center text-sm font-semibold text-[#27272A]"
                        onClick={handleContentShow}
                      >
                        {showContents ? (
                          <div
                            className="border-t-1 mr-2 border border-black"
                            style={{ width: "10px" }}
                          />
                        ) : (
                          <div className="mr-2" style={{ width: "10px" }}>
                            +{" "}
                          </div>
                        )}
                        Contents
                      </h2>
                    </div>
                    <hr className="mt-2 w-full" />
                    {h2 && (
                      <ul
                        className={`mt-4 space-y-2 text-sm transition-all duration-300 ${
                          showContents
                            ? "max-h-96 opacity-100"
                            : "max-h-0 overflow-hidden opacity-0"
                        }`}
                      >
                        {h2.map((item, index) => (
                          <li
                            key={index}
                            className={`block w-fit ${
                              activeSection === `section-${index}`
                                ? "font-bold text-[#000000]"
                                : "text-[#71717A] hover:text-[#3cc8a1]"
                            }`}
                            onClick={() => scrollToSection(`section-${index}`)} // Use custom scroll function
                            style={{ cursor: "pointer" }}
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {item}
                            </ReactMarkdown>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={`fixed bottom-5 right-5`}>
              <div
                className="hidden cursor-pointer rounded-[4px] bg-[#3CC8A1] p-2 text-white md:block lg:hidden"
                onClick={handleSvgClick}
              >
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
              <div
                className="my-3 hidden cursor-pointer rounded-[4px] bg-[#3CC8A1] p-2 text-white md:block lg:hidden"
                onClick={() => scrollToSection("section-0")}
              >
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
              <div
                className={` ${activeSection > "section-0" ? "block" : "hidden"}`}
                onClick={() => scrollToSection("section-0")}
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
                    class="lucide lucide-arrow-up"
                  >
                    <path d="m5 12 7-7 7 7" />
                    <path d="M12 19V5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
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

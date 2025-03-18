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
  const loader = useSelector((state) => state?.textbook?.loading);
  const note = useSelector((state) => state?.textbook?.notes);
  const [noteError, setNoteError] = useState(false);
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [fuse, setFuse] = useState(null);
  const [article, setArticle] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useRef(null);

  const textareaRef = useRef(null);

  const handleSvgClick = () => {
    // Focus the textarea when the SVG is clicked
    textareaRef.current.focus();
  };
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (textbook && textbook.length > 0) {
      setFuse(
        new Fuse(textbook, {
          keys: ["articleTitle", "articleSubSections", "fullArticleContent"],
          threshold: 0.3,
        }),
      );
    }
  }, [textbook]);

  const result = query && fuse ? fuse.search(query).map((res) => res.item) : [];
  console.log(fuse);

  const handleSearch = () => {
    setShowModal(true); // Show modal when the input is clicked
  };

  const handleSave = () => {
    if (notes.trim() === "") {
      setNoteError(true);
    } else {
      dispatch(insertOrUpdateNotes({ notes, moduleId: id, userId }))
        .unwrap()
        .then(() => {
          setNoteError(false);

          setNotes(""); // Clear the input temporarily
          return dispatch(
            getNotesByModuleId({ userId, moduleId: id }),
          ).unwrap(); // Fetch updated notes
        })
        .then((data) => {
          setNotes(data); // ✅ Set the latest note
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    if (!id || !textbook) return;

    const article = textbook?.find((item) => item.moduleId === Number(id));
    const module = categoryName.find((item) => item.categoryId === Number(id));
    setArticle({ article, ...module });
    dispatch(getNotesByModuleId({ userId, moduleId: id }))
      .unwrap()
      .then((data) => {
        setNotes(data);
      });

    setLoading(false);
  }, [id, textbook]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    article?.article?.fullArticleContent?.forEach((_, index) => {
      const section = document.getElementById(`section-${index}`);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      article?.article?.fullArticleContent?.forEach((_, index) => {
        const section = document.getElementById(`section-${index}`);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, [article, note, notes]);

  // useEffect(() => {
  //   if (article?.article?.fullArticleContent?.length > 0) {
  //     setTimeout(() => {
  //       const sectionZero = document.getElementById("section-0");
  //       if (sectionZero) {
  //         sectionZero.scrollIntoView({ behavior: "smooth" });
  //       }
  //     }, 100); // Thoda delay taake data render ho sake
  //   }
  // }, [article]);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      const sectionZero = document.getElementById("section-0");
      if (sectionZero) {
        sectionZero.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Thoda delay taake data render ho sake
  }, [id]);
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

  return (
    <div className="h-screen w-full lg:flex">
      {/* Sidebar Section */}
      <div className="fixed hidden h-full lg:block">
        <Sidebar />
      </div>
      {/* Header */}
      <div className="flex w-full items-center justify-between bg-white p-5 lg:hidden">
        <div className="">
          <img src="/assets/small-logo.png" alt="" />
        </div>
        <div className="" onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="w-full">
        {loading ? (
          <div className="ml-[100px] w-[100%]">
            <Loader />
          </div>
        ) : (
          <div>
            <div className="flex-1 py-2 md:p-5 lg:ml-[250px]">
              {/* Back Button and Search */}
              <div className="mb-5 flex items-center justify-between gap-5 px-3 md:ml-5 md:p-0">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-x-2 rounded-lg bg-white px-4 py-2 text-[12px] hover:shadow-lg lg:text-[16px]"
                >
                  <FaAngleLeft color="#3CC8A1" />
                  <span className="font-semibold text-[#3CC8A1]">
                    Back To Modules
                  </span>
                </button>
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search for anything"
                    className="w-[180px] rounded-md p-1 pl-10 text-[14px] placeholder:pl-10 placeholder:text-[12px] placeholder:text-[#D4D4D8] focus:outline-none focus:ring-2 focus:ring-gray-400 sm:w-[230px] md:block md:placeholder:text-[14px] lg:w-[320px] lg:p-2"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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

              {/* Modal */}
              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <SearchResults result={fuse} searchRef={searchRef} />
                </div>
              )}

              {/* Module Details */}
              <div className="flex justify-center gap-5">
                <div className="space-y-7 bg-white p-6 shadow-md md:mx-3 md:rounded-lg 2xl:w-[640px]">
                  {/* Breadcrumb and Title */}
                  <div>
                    <p className="text-[12px] font-semibold text-[#A1A1AA] lg:text-sm">
                      {`All Modules ${""} > ${""}${article?.categoryName} ${""} >${""} ${article?.article?.articleTitle}`}
                    </p>
                    <h1 className="mt-2 text-[20px] font-bold text-[#3F3F46] lg:text-3xl">
                      {article?.article?.articleTitle}
                    </h1>
                  </div>

                  {/* Sections */}
                  {article?.article?.fullArticleContent?.map(
                    (section, index) => (
                      <div
                        key={index}
                        id={`section-${index}`}
                        className="space-y-3"
                      >
                        <div className="markdown-text-container">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {section}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <div className="hidden w-[400px] space-y-8 bg-transparent text-white md:block 2xl:w-[320px]">
                  {/* Notes Section */}
                  <div>
                    <div
                      className="flex cursor-pointer items-center justify-between"
                      onClick={() => setShowContents(!showContents)}
                    >
                      <h2 className="text-[14px] font-semibold text-[#27272A]">
                        - {""} {""} Notes
                      </h2>
                    </div>
                    <hr className="mt-2 w-full" />
                    <div className="mt-4">
                      <textarea
                        ref={textareaRef}
                        className={`h-32 w-full rounded-md border bg-transparent p-2 text-sm text-black ${noteError ? "border-red-500" : "border-gray-400"}`}
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
                    <hr className="mt-2 w-full" />
                    {article && (
                      <ul className="mt-4 space-y-2 text-sm">
                        {article?.article?.articleSubSections?.map(
                          (items, index) => (
                            <li
                              key={index}
                              className={`${
                                activeSection === `section-${index}`
                                  ? "font-bold text-[#000000]"
                                  : "text-[#71717A] hover:text-[#3cc8a1]"
                              }`}
                              onClick={() => {
                                document
                                  .getElementById(`section-${index}`)
                                  .scrollIntoView({ behavior: "smooth" });
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              {items}
                            </li>
                          ),
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Icons */}
            <div className={`fixed bottom-5 right-5`}>
              <div
                className="hidden cursor-pointer rounded-[4px] bg-[#3CC8A1] p-2 text-white md:block lg:hidden"
                // onClick={() => {
                //   document
                //     .getElementById(`section-0`)
                //     .scrollIntoView({ behavior: "smooth" });
                // }}
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
                onClick={() => {
                  document
                    .getElementById(`section-1`)
                    .scrollIntoView({ behavior: "smooth" });
                }}
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
                onClick={() => {
                  document
                    .getElementById(`section-0`)
                    .scrollIntoView({ behavior: "smooth" });
                }}
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

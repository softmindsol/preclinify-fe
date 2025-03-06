import React from "react";
import { Link } from "react-router-dom";

const ShowPopup = ({ setShowPlanPopup }) => {

    function closeShowPopup(){
        setShowPlanPopup(false);
        console.log("clicking on")
    }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-[#1E1E2A]">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3CC8A1]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#3CC8A1]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Upgrade Your Plan
          </h3>

          {/* Description */}
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            To access this feature, please upgrade your plan.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={closeShowPopup}
              className="rounded-md bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-300 dark:bg-[#3A3A48] dark:text-white dark:hover:bg-[#4A4A5A]"
            >
              Close
            </button>
            <Link
              to="/pricing"
              className="rounded-md bg-[#3CC8A1] px-6 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#34b08c]"
            >
              Buy Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPopup;

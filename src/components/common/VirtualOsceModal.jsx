import React from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../redux/features/osce-bot/virtual.modal.slice";

const VirtualPatientGuide = () => {
  const dispatch = useDispatch();

  const handleClosePatientModal = () => {
    dispatch(closeModal());
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative z-50 h-[70%] w-[50%] rounded-lg bg-white p-6 shadow-md">
        <div>
          <h1 className="mb-6 text-[48px] font-extrabold text-[#3F3F46]">
            How to get the most out of the virtual patients
          </h1>
          {/* Decorative wave SVG */}
          <img src="/assets/snake.png" alt="" className="mb-5" />
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-[48px] font-black text-[#3F3F46]">1</span>
              </div>
              <div>
                <h2 className="text-[#3F3F46]">
                  <b>Introduce yourself</b>{" "}
                  <span>
                    by saying "Hi I'm Doctor (name), how may I help you today?"
                  </span>
                </h2>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-[48px] font-black text-[#3F3F46]">2</span>
              </div>
              <div>
                <h2 className="text-[#3F3F46]">
                  Go through the consultation. Once finished say{" "}
                  <b>"please give me questions as an examiner"</b>
                </h2>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-[48px] font-black text-[#3F3F46]">3</span>
              </div>
              <div>
                <h2 className="text-[#3F3F46]">
                  Once done, <b>ask for feedback!</b> Ask what you had missed as
                  per the mark-scheme.
                </h2>
              </div>
            </div>
          </div>
          {/* Note section */}
          <div className="mt-8 flex items-center gap-x-4">
            <h3 className="mb-2 text-[24px] font-extrabold text-[#3F3F46]">
              NB:
            </h3>
            <ul className="space-y-2 text-[#3F3F46]">
              <li>
                Please ensure you <span className="font-bold">only</span> press
                the mic once to get started. Multiple clicks will reduce your
                token count.
              </li>
              <li>
                Feel free to interrupt the patient / examiner if appropriate.
              </li>
            </ul>
          </div>
          {/* Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleClosePatientModal}
              className="mt-8 w-[60%] rounded-md bg-[#FFE9D6] px-4 py-3 font-medium text-[#FF9741] transition duration-200 hover:bg-[#FF9741] hover:text-white"
            >
              Send My Patient In!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualPatientGuide;

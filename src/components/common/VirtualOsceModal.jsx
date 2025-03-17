import React from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../redux/features/osce-bot/virtual.modal.slice";
import { setOSCEBotType } from "../../redux/features/osce-bot/osce-type.slice";

const VirtualPatientGuide = () => {
  const dispatch = useDispatch();

  const handleClosePatientModal = (type) => {
    // dispatch(closeModal());
    dispatch(setOSCEBotType({ type }));
    console.log(type);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative z-50 w-[90%] rounded-lg bg-white p-6 shadow-md md:w-[50%] 2xl:h-[75%]">
        <div>
          <h1 className="3xl:mb-6 mb-3 text-[18px] font-extrabold text-[#3F3F46] sm:text-[26px] 2xl:text-[48px]">
            How to get the most out of the virtual patients
          </h1>
          {/* Decorative wave SVG */}
          <img src="/assets/snake.png" alt="" className="mb-5" />
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                <span className="3xl:text-[48px] text-[18px] font-black text-[#3F3F46] sm:text-[32px] xl:text-[38px]">
                  1
                </span>
              </div>
              <div>
                <h2 className="text-[12px] text-[#3F3F46] md:text-[14px] xl:text-[16px]">
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
                <span className="3xl:text-[48px] text-[18px] font-black text-[#3F3F46] sm:text-[32px] xl:text-[38px]">
                  2
                </span>
              </div>
              <div>
                <h2 className="text-[12px] text-[#3F3F46] xl:text-[16px]">
                  Go through the consultation. Once finished say{" "}
                  <b>"please give me questions as an examiner"</b>
                </h2>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                <span className="3xl:text-[48px] text-[18px] font-black text-[#3F3F46] sm:text-[32px] xl:text-[38px]">
                  3
                </span>
              </div>
              <div>
                <h2 className="text-[12px] text-[#3F3F46] xl:text-[16px]">
                  Once done, <b>ask for feedback!</b> Ask what you had missed as
                  per the mark-scheme.
                </h2>
              </div>
            </div>
          </div>
          {/* Note section */}
          <div className="mt-8 flex items-center gap-x-4">
            <h3 className="3xl:text-[48px] mb-2 text-[18px] font-black text-[#3F3F46] sm:text-[26px] xl:text-[38px]">
              NB:
            </h3>
            <ul className="space-y-2 text-[12px] text-[#3F3F46] xl:text-[16px]">
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
          <div className="flex items-center justify-center space-x-5">
            <button
              onClick={() => handleClosePatientModal("text")}
              className="3xl:px-4 3xl:py-3 mt-8 w-[60%] rounded-md bg-[#FFE9D6] p-2 text-[12px] font-medium text-[#FF9741] transition duration-200 hover:bg-[#FF9741] hover:text-white sm:px-3 sm:py-2 sm:text-[14px] 2xl:text-[16px]"
            >
              Text
            </button>
            <button
              onClick={() => handleClosePatientModal("ai-bot")}
              className="3xl:px-4 3xl:py-3 mt-8 w-[60%] rounded-md bg-[#FFE9D6] p-2 text-[12px] font-medium text-[#FF9741] transition duration-200 hover:bg-[#FF9741] hover:text-white sm:px-3 sm:py-2 sm:text-[14px] 2xl:text-[16px]"
            >
              AI Bot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualPatientGuide;

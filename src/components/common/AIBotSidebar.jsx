import React from "react";
import { NavLink } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import Drawer from "react-modern-drawer";
import Logo from "./Logo";
import "react-modern-drawer/dist/index.css";
import { Link } from "react-router-dom";

const AIBotSidebar = ({
  toggleDrawer,
  isOpen,
  setIsOpen,
  setMinutes,
  minutes,
  seconds,
  timerActive,
  setTimerActive,
  plan,
  completePlanData,
  subscriptions,
  loader,
  handleFeedBack,
  userId,
  showFeedBackModal,
  setShowFeedBackModal,
  isPatientOn,
  isRecording,
  finishReviewHandler,
  FeedbackModal,
  handlerOpenDashboardModal,
}) => {
  return (
    <Drawer
      open={isOpen}
      onClose={toggleDrawer}
      direction="right"
      className="z-2 h-full overflow-auto"
      lockBackgroundScroll={true}
    >
      <div className="">
        <div className="mt-5 flex h-screen flex-col items-center justify-between">
          <div className="relative w-full">
            <div className="mt-5 flex items-center justify-between">
              <div className="absolute left-1/2 -translate-x-1/2 transform">
                <Logo />
              </div>
            </div>

            <div className="mt-5 px-6 text-[12px] font-semibold text-[#3F3F46]">
              <p>Set timer</p>
              <div className="mt-2 flex h-[32px] w-[208px] items-center justify-between rounded-[6px] border border-[#D4D4D8] p-2 2xl:w-[99%]">
                <p className="text-[12px] font-bold text-[#A1A1AA]">Minutes</p>
                <input
                  type="number"
                  className="w-10 bg-transparent text-[12px] font-bold text-[#A1A1AA] outline-none"
                  defaultValue="8"
                  onChange={(e) => {
                    setMinutes(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center">
              <div
                className={`h-[96px] w-[90%] rounded-[8px] text-center text-[#ffff] ${
                  minutes === 0 && seconds < 60
                    ? "bg-[#FF453A]" // Red when timer is below 1 minute
                    : timerActive
                      ? "bg-[#3CC8A1]"
                      : "bg-[#FF9741]"
                }`}
              >
                <p className="mt-3 text-[12px]">Timer</p>
                <p className="text-[36px] font-black">
                  {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </p>
              </div>
            </div>

            <div className="p-5 text-center">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className={`h-[32px] w-[90%] rounded-[6px] text-[12px] transition-all duration-200 hover:text-white ${
                  minutes === 0 && seconds < 60
                    ? "border border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000]" // Red when timer < 1 min
                    : timerActive
                      ? "border border-[#3CC8A1] text-[#3CC8A1] hover:bg-[#3CC8A1]"
                      : "border border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741]"
                }`}
              >
                {timerActive ? "Pause Timer" : "Start Timer"}
              </button>

              <div className="mt-5 text-[#52525B]">
                <p className="text-[16px] font-bold">Current Plan</p>
                {!plan ? (
                  <p className="text-[14px]">Free</p>
                ) : (
                  <p className="text-[14px]">{completePlanData.plan}</p>
                )}
              </div>
            </div>
          </div>
          <div className="w-[90%] text-center text-[14px] font-semibold text-[#52525B]">
            {subscriptions[0]?.total_tokens ===
            subscriptions[0]?.used_tokens ? (
              <div className="space-y-2">
                <p className="text-[#FF453A]">
                  You have exceeded your token limit
                </p>
                <button className="w-[50%] rounded-[8px] border border-[#FF453A] py-1 text-[12px] text-[#FF453A] transition-all duration-150 hover:bg-[#FF453A] hover:text-white">
                  <Link to="/pricing">Buy Tokens</Link>
                </button>
              </div>
            ) : (
              <p>
                {loader ? (
                  <span className="flex items-center justify-center">
                    <div className="loading"></div>
                  </span>
                ) : (
                  <span>
                    {" "}
                    You have{" "}
                    {subscriptions[0]?.total_tokens -
                      subscriptions[0]?.used_tokens}{" "}
                    {subscriptions[0]?.total_tokens -
                      subscriptions[0]?.used_tokens ===
                    1
                      ? "Token"
                      : "Tokens"}{" "}
                    remaining.
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="mb-5">
            <div className="mb-5 rounded-[6px] bg-[#F4F4F5] p-1 text-center text-[12px] text-[#3F3F46] hover:bg-[#e4e4e6]">
              <button onClick={handleFeedBack}>Report a problem</button>
            </div>

            {/* <div className="flex items-center rounded-[6px] border border-[#3CC8A1] px-4 py-2">
              <div className="flex w-full items-center justify-between">
                <span className="text-[12px] font-medium text-[#28C3A6]">
                  Patient Voice
                </span>
                <button
                  disabled
                  className={`flex h-5 w-10 items-center ${isPatientOn || !isRecording ? "bg-[#28C3A6]" : "bg-[#F4F4F5]"} rounded-full p-1 transition duration-300 ${isPatientOn || !isRecording ? "justify-end" : "justify-start"}`}
                  // onClick={() => setIsPatientOn(!isPatientOn)}
                >
                  <div className="h-4 w-4 rounded-full bg-white shadow-md"></div>
                </button>
              </div>
            </div> */}

            <div className="mt-5">
              <div
                onClick={finishReviewHandler}
                className="mb-4 flex cursor-pointer items-center justify-center gap-x-2 font-semibold text-[#3CC8A1]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <p className="text-[12px]">Finish and Review</p>
              </div>
              <hr className="w-[90%]" />
              <div className="my-3 flex cursor-pointer items-center justify-center gap-x-2 whitespace-nowrap font-semibold text-[#FF453A] hover:opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <p className="text-[12px]" onClick={handlerOpenDashboardModal}>
                  Back to Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AIBotSidebar;

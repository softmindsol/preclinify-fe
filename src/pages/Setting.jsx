import React, { useEffect, useState } from "react";
import Siderbar from "../components/common/Sidebar";
import { FaClock, FaRobot } from "react-icons/fa";
import { PiCircleHalfFill } from "react-icons/pi";
import { MdOutlinePayments } from "react-icons/md";
import Logo from "../components/common/Logo";
import { TbBaselineDensityMedium } from "react-icons/tb";
// import component 👇
import { RxCross2 } from "react-icons/rx";

import { NavLink, useNavigate } from "react-router-dom";
import supabase from "../config/helper";
import { setDarkMode } from "../redux/features/dark-mode/dark-mode.slice";
import { useDispatch, useSelector } from "react-redux";
import ExamCountdown from "../components/settings/ExamCountdown";
import { toast } from "sonner";
import { clearUserId } from "../redux/features/user-id/userId.slice";
import MobileBar from './../components/common/Drawer';
import {
  fetchUserInformation,
  insertOrUpdateUserInformation,
} from "../redux/features/personal-info/personal-info.service";

const Setting = () => {
  const navigate = useNavigate();
  const [isSaving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const darkModeRedux = useSelector((state) => state?.darkMode?.isDarkMode);
  const [darkMode, setMode] = useState(false);
  const dispatch = useDispatch();
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    university: "",
    year: "",
  });  
  const userId = localStorage.getItem("userId");
  const profile = useSelector((state) => state?.personalInfo?.userInfo);
  // Logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut().then(() => {
         localStorage.removeItem("userId");
        dispatch(clearUserId());
        toast.success("User logged out successfully");
        navigate("/login");
      });
    } catch (error) {
      toast.error("Something went wrong while Logout!");
    }
  };

  const toggleDarkMode = () => {
    setMode((prevMode) => !prevMode);
    dispatch(setDarkMode(!darkMode));
  };

  useEffect(() => {
    dispatch(fetchUserInformation({ user_id: userId }));
  }, [dispatch, userId]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        university: profile.university || "",
        year: profile.year || "",
      });
    }
  }, [profile]);

  // Save handler jo data update karega
  const handleSave = async () => {
    try {
      setSaving(true);
      await dispatch(
        insertOrUpdateUserInformation({ user_id: userId, formData }),
      );
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full lg:flex ${darkModeRedux ? "dark" : ""} `}
    >
      <div className="fixed hidden h-full lg:block">
        <Siderbar />
      </div>
      <div className="flex w-full items-center justify-between bg-white p-5 text-black shadow-sm dark:bg-[#1E1E2A] dark:text-white lg:hidden">
        <div className="">
          <img src="/assets/small-logo.png" alt="" />
        </div>

        <div onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>

      <div className="mt-5 min-h-screen w-full overflow-y-auto bg-gray-100 text-[#3F3F46] dark:bg-[#1E1E2A] dark:text-white lg:ml-[250px] lg:mt-0 lg:p-6">
        <h1 className="mb-6 hidden text-[24px] font-bold text-[#27272A] dark:text-white lg:block">
          Settings
        </h1>

        {/* General Section */}
        <ExamCountdown />

        <div className="mb-6 space-y-3 bg-white p-4 text-black shadow-md dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white lg:rounded-md">
          <p className="text-[14px] font-semibold text-[#000000] dark:text-white sm:text-[16px]">
            Appearance
          </p>
          <div className="flex items-center gap-x-56 sm:gap-x-60">
            <div>
              <div className="flex items-center gap-x-2">
                <PiCircleHalfFill />

                <p className="whitespace-nowrap text-[12px] font-medium text-[#3F3F46] dark:text-white sm:text-[14px]">
                  Dark Mode
                </p>
              </div>
            </div>
            <div
              onClick={toggleDarkMode}
              className={`relative inline-flex h-4 w-8 cursor-pointer items-center rounded-full transition-colors ${
                darkModeRedux ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-3 w-3 transform rounded-full bg-white shadow-md transition-transform ${
                  darkModeRedux ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className="mb-6 bg-white p-4 text-[#000000] shadow-md dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white lg:rounded-md">
          <div>
            <h2 className="mb-4 text-[14px] font-semibold dark:text-white sm:text-[16px]">
              Billing
            </h2>
            <div className="flex items-center gap-x-20 sm:gap-x-40">
              <div className="sm:mb-4">
                <div className="flex items-center gap-x-2">
                  <MdOutlinePayments />
                  <p className="text-[14px] font-medium text-[#000000] dark:text-white sm:text-[16px]">
                    Subscription
                  </p>
                </div>

                <p className="whitespace-nowrap text-[12px] text-[#71717A] dark:text-white sm:text-[14px]">
                  Your current subscription package.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[12px] font-medium dark:text-white sm:text-[14px]">
                    Platinum
                  </span>
                </div>
              </div>
              <button className="rounded-[6px] border-[1px] border-[#3CC8A1] px-2 py-1 text-[12px] font-medium text-[#3CC8A1] transition-all duration-200 hover:bg-[#3CC8A1] hover:text-white sm:text-[14px]">
                Change Plan
              </button>
            </div>
          </div>

          <div>
            <div className="mt-5 flex items-center gap-x-20 sm:mt-0 sm:gap-x-40">
              <div className="mb-4">
                <div className="flex items-center gap-x-2">
                  <FaRobot />
                  <p className="text-[14px] font-medium text-[#000000] dark:text-white sm:text-[16px]">
                    OSCE Credits
                  </p>
                </div>

                <p className="whitespace-nowrap text-[12px] text-[#71717A] dark:text-white sm:text-[14px]">
                  Your remaining credit for OSCE
                </p>
                <div className="mt-2 flex items-center justify-between">
                  {/* <span className="text-[12px] font-semibold dark:text-white sm:text-[14px]">
                    6969
                  </span> */}
                </div>
              </div>
              <button className="rounded-[6px] border-[1px] border-[#3CC8A1] px-2 py-1 text-[12px] text-[#3CC8A1] transition-all duration-200 hover:bg-[#3CC8A1] hover:text-white sm:text-[14px]">
                Purchase Credit
              </button>
            </div>
          </div>
        </div>

        {/* Subscriptions Section */}
        {/* <div className="mb-6 bg-white p-4 shadow-md dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white lg:rounded-md">
          <h2 className="mb-4 text-[16px] font-semibold sm:text-[18px]">
            Subscriptions
          </h2>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-x-2">
                <MdOutlinePayments />
                <p className="text-[14px] font-medium sm:text-[16px]">
                  Platinum Tier Subscription
                </p>
              </div>
              <p className="text-[14px] font-bold text-[#71717A] dark:text-white sm:text-[16px]">
                £3499 / Year
              </p>
            </div>

            <button className="rounded-[6px] border-[1px] border-[#FF9741] px-2.5 py-1 text-[12px] text-[#FF9741] transition-all duration-200 hover:bg-[#FF9741] hover:text-white dark:border-[1px] dark:border-white dark:text-white dark:hover:border-[#FF9741] sm:text-[14px]">
              Change plan
            </button>
          </div>
          <div className="mt-4 flex space-x-4">
            <button className="rounded-[6px] border-[1px] border-[#FF9741] px-3 py-2 text-[12px] font-semibold text-[#FF9741] transition-all duration-200 hover:bg-[#FF9741] hover:text-white dark:border-[1px] dark:border-white dark:text-white dark:hover:border-[#FF9741] sm:text-[14px]">
              Purchase OSCE Credit
            </button>
            <button className="rounded-[6px] border-[1px] border-[#FF9741] px-3 py-2 text-[12px] font-semibold text-[#FF9741] transition-all duration-200 hover:bg-[#FF9741] hover:text-white dark:border-[1px] dark:border-white dark:text-white dark:hover:border-[#FF9741] sm:text-[14px]">
              Update Billing Information
            </button>
          </div>
        </div> */}

        {/* Account Section */}
        <div className="bg-white p-4 shadow-md dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white lg:rounded-md">
          <h2 className="mb-4 text-[16px] font-semibold text-[#3F3F46] dark:text-white sm:text-[18px]">
            Account
          </h2>
          <div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <label className="mb-1 block text-[14px] font-medium sm:text-[16px]">
                Display Name
              </label>
              <input
                type="text"
                className="w-[320px] rounded-[8px] border p-2 dark:bg-[#1E1E2A]"
                placeholder="Full Name"
                value={formData.firstName + " " + formData.lastName}
                readOnly
              />
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <label className="mb-1 block text-[14px] font-medium sm:text-[16px]">
                First Name
              </label>
              <input
                type="text"
                className="w-[320px] rounded-[8px] border p-2 dark:bg-[#1E1E2A]"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <label className="mb-1 block font-medium">Last Name</label>
              <input
                type="text"
                className="w-[320px] rounded-[8px] border p-2 dark:bg-[#1E1E2A]"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <label className="mb-1 block font-medium">University</label>
              <input
                type="text"
                className="w-[320px] rounded-[8px] border p-2 dark:bg-[#1E1E2A]"
                placeholder="University"
                value={formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, university: e.target.value })
                }
              />
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <label className="mb-1 block font-medium">Year of Study</label>
              <select
                name="year"
                id="year"
                className="w-[320px] rounded-[8px] border p-2 dark:bg-[#1E1E2A]"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              >
                <option value="" disabled>
                  Select Year of Study
                </option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="rounded-[8px] bg-[#3CC8A1] px-2 py-1 font-semibold text-white"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="mt-10 flex flex-col gap-y-5">
            <button
              className="ark:border-[1px] w-[91px] rounded-[6px] border-[1px] border-[#FF9741] px-2.5 py-1 text-[14px] font-semibold text-[#FF9741] transition-all duration-200 hover:bg-[#FF9741] hover:text-white dark:border-white dark:text-white dark:hover:border-[#FF9741]"
              onClick={handleLogout}
            >
              Log out
            </button>
            <button className="ark:border-[1px] w-[156px] rounded-[6px] border-[1px] border-[#FF9741] px-2.5 py-1 text-[14px] font-semibold text-[#FF9741] transition-all duration-200 hover:bg-[#FF9741] hover:text-white dark:border-white dark:text-white dark:hover:border-[#FF9741]">
              Reset Password
            </button>

            {/* <button className="w-[152px] rounded-[6px] border-[1px] border-[#FF453A] bg-[#FF453A] px-2.5 py-1 text-[14px] font-semibold text-[#ffff] transition-all duration-200 hover:bg-transparent hover:text-[#FF453A]">
              Delete Account
            </button> */}
          </div>
        </div>

        {/* <div className="mt-6 bg-white p-4 shadow-md dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white lg:rounded-md">
          <p className="text-[18px] font-semibold text-[#3F3F46] dark:text-white">
            Advanced
          </p>
          <div className="mt-10 flex flex-col gap-y-5">
            <button className="w-[156px] rounded-[6px] border-[1px] border-[#FF9741] px-2.5 py-1 text-[14px] font-semibold text-[#FF9741] transition-all duration-200 hover:bg-[#FF9741] hover:text-white dark:border-[1px] dark:border-white dark:text-white dark:hover:border-[#FF9741]">
              Clear Cache
            </button>

            <button className="w-[190px] rounded-[6px] border-[1px] border-[#FF453A] bg-[#FF453A] px-2.5 py-1.5 text-[14px] font-semibold text-[#ffff] transition-all duration-200 hover:bg-transparent hover:text-[#FF453A]">
              Reset Progress Data
            </button>
          </div>
        </div> */}
      </div>
      <div className="text-black dark:bg-[#1E1E2A] dark:text-white">
        <MobileBar
          toggleDrawer={toggleDrawer}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  );
};

export default Setting;

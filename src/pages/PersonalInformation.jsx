import React, { useEffect, useState } from "react";
import supabase from "../config/helper";
import Logo from "../components/common/Logo";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserId } from "../redux/features/user-id/userId.service";

const PersonalInformation = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // ✅ Add userId in the initial state
    firstName: "",
    lastName: "",
    university: "",
    year: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
    } else if (!/^[A-Za-z]{2,}$/.test(formData.firstName)) {
      newErrors.firstName = "First Name must be at least 2 letters.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
    } else if (!/^[A-Za-z]{2,}$/.test(formData.lastName)) {
      newErrors.lastName = "Last Name must be at least 2 letters.";
    }

    if (!formData.university) {
      newErrors.university = "Please select a university.";
    }

    if (!formData.year) {
      newErrors.year = "Please select a year group.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      user_id: userId,
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);

    // dispatch(insertUserInformation(formData))
    // .unwrap()
    // .then(res=>{
    //     navigate('/login')
    // })
    // setTimeout(() => {
    //     setIsLoading(false);
    //     toast.success("Personal information successfully!");
    // }, 2000);
  };
  useEffect(() => {
    dispatch(fetchUserId())
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      });
  }, [dispatch]);
  return (
    <div className="flex w-full items-center overflow-hidden">
      <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-5 bg-[#FFFFFF] py-5 lg:w-[50%]">
        <Logo />
        <p className="mb-5 text-[16px] font-medium leading-[29px] text-[#3F3F46] sm:text-[24px]">
          Almost there
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-2 w-[90%] space-y-4 sm:w-[430px]"
        >
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your First Name..."
              value={formData.firstName}
              onChange={handleChange}
              className="mt-2 h-[50px] w-full rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] md:placeholder:text-[16px]"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your Last Name..."
              value={formData.lastName}
              onChange={handleChange}
              className="mt-2 h-[50px] w-full rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] md:placeholder:text-[16px]"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          {/* University */}
          <div className="relative">
            <label
              htmlFor="university"
              className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
            >
              University
            </label>
            <select
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="mt-2 h-[50px] w-full appearance-none rounded-[8px] border-[2px] border-black px-5 py-2 pr-10"
            >
              <option value="">--Select University--</option>
              <option value="Government College University">
                Government College University
              </option>
            </select>
            {errors.university && (
              <p className="text-sm text-red-500">{errors.university}</p>
            )}
          </div>

          {/* Year Group */}
          <div className="relative">
            <label
              htmlFor="year"
              className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
            >
              Year Group
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="mt-2 h-[50px] w-full appearance-none rounded-[8px] border-[2px] border-black px-5 py-2 pr-10"
            >
              <option value="">--Select Year--</option>
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
            </select>
            {errors.year && (
              <p className="text-sm text-red-500">{errors.year}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`h-[50px] w-full rounded-[8px] text-[14px] font-medium transition-all duration-150 sm:text-[16px] ${isLoading ? "cursor-not-allowed bg-gray-400 text-gray-700" : "bg-[#FFE9D6] text-[#FF9741] hover:bg-[#e3863a] hover:text-white"}`}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Continue"}
            </button>
          </div>
        </form>
      </div>

      {/* Side Image */}
      <div className="hidden h-screen w-[50%] items-center justify-center bg-[#F4F4F5] lg:flex">
        <img
          src="/assets/AI_hosptial-removebg-preview.png"
          alt="Side Illustration"
        />
      </div>
    </div>
  );
};

export default PersonalInformation;

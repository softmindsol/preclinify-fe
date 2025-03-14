import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import supabase from "../config/helper";
import Logo from "../components/common/Logo";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  fetchUserPhoneNumber,
  insertOrUpdateUserInformation,
} from "../redux/features/personal-info/personal-info.service";
import { FiEye, FiEyeOff } from "react-icons/fi";

export const checkEmailExists = async (email) => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Error checking users:", error);
    return false;
  }

  return data.users.some((user) => user.email === email);
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [termsChecked, setTermsChecked] = useState(false);
  const [emailUpdatesChecked, setEmailUpdatesChecked] = useState(false);
  const [smsUpdatesChecked, setSmsUpdatesChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Formik setup
  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      displayName: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
      phone: Yup.string()
        .matches(/^\+?[0-9]+$/, "Phone number must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits")
        .required("Required"),
      displayName: Yup.string()
  .matches(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces")
  .required("Name is Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!termsChecked) {
        toast.error("Please agree to the terms and conditions.");
        setSubmitting(false);
        return;
      }

      try {
        // 1️⃣ Pehle check karein ke email already exist to nahi
          const emailExists = await checkEmailExists(values.email);

          if (emailExists) {
            toast.error("This email is already registered. Please log in.");
            return;
          } 
        // Supabase auth register
        const { data: user, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              displayName: values.displayName,
              phone: values.phone,
            },
          },
        });

        if (error) {
          toast.error("Error occurred while registering");
        } else {
          // Fetch user phone number and navigate to verification page
          await dispatch(
            fetchUserPhoneNumber({
              email: values.email,
              phone: values.phone,
            }),
          );
          navigate("/verify-email");
          toast.success(
            "Registration Successfully! Check your email and verify it.",
          );
        }
      } catch (error) {
        console.error("error:", error);
        toast.error("An error occurred. Please try again!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex w-full items-center overflow-hidden">
      <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-5 bg-[#FFFFFF] py-5 lg:w-[50%]">
        <Link to="/">
          <Logo />
        </Link>

        <p className="mb-5 text-[16px] font-medium leading-[29px] text-[#3F3F46] sm:text-[24px]">
          Sign up into Preclinify
        </p>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-2 w-[90%] space-y-4 sm:w-[430px]"
        >
          <div>
            <label
              htmlFor="email"
              className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
            >
              Full Name
            </label>
            <br />
            <input
              type="text"
              id="displayName"
              placeholder="Enter your full name..."
              value={formik.values.displayName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 h-[50px] w-full rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] md:placeholder:text-[16px]"
            />
            {formik.touched.displayName && formik.errors.displayName ? (
              <div className="text-red-500">{formik.errors.displayName}</div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
            >
              Email Address
            </label>
            <br />
            <input
              type="email"
              id="email"
              placeholder="Enter your Email..."
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 h-[50px] w-full rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] md:placeholder:text-[16px]"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
            >
              Password
            </label>
            <br />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your Password..."
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 h-[50px] w-full rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] md:placeholder:text-[16px]"
            />
            <span
              className="absolute right-3 top-12 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </span>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500">{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="relative mt-4">
            <label
              htmlFor="confirmPassword"
              className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
            >
              Confirm Password
            </label>
            <br />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Enter your Confirm Password..."
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-2 h-[50px] w-full rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] md:placeholder:text-[16px]"
            />
            <span
              className="absolute right-3 top-12 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </span>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
            >
              Phone
            </label>
            <br />
            <input
              type="text"
              id="phone"
              placeholder="Enter your Phone Number..."
              value={formik.values.phone}
              onChange={(e) => {
                let value = e.target.value;
                if (!value.startsWith("+")) {
                  value = "+" + value.replace(/\D/g, ""); // Non-numeric characters remove kardo
                }
                formik.setFieldValue("phone", value);
              }}
              onBlur={formik.handleBlur}
              className="mt-2 h-[50px] w-full rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] md:placeholder:text-[16px]"
            />

            {formik.touched.phone && formik.errors.phone ? (
              <div className="text-red-500">{formik.errors.phone}</div>
            ) : null}
          </div>

          <div className="w-full space-y-3 font-medium text-[#3F3F46]">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                onChange={(e) => setTermsChecked(e.target.checked)}
              />
              <label
                htmlFor="rememberMe"
                className="mx-3 text-[14px] font-medium text-[#3F3F46] sm:text-[16px]"
              >
                I agree to{" "}
                <Link to={"/term-and-condition"}>
                  {" "}
                  <span className="underline">Terms and conditions</span>{" "}
                </Link>
                and{" "}
                <Link to={"/privacy-policy"}>
                  <span className="underline">Privacy Policy</span>
                </Link>
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="emailUpdates"
                name="emailUpdates"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                onChange={(e) => setEmailUpdatesChecked(e.target.checked)}
              />
              <label
                htmlFor="emailUpdates"
                className="mx-3 text-[14px] font-medium text-[#3F3F46] sm:text-[16px]"
              >
                Send me tips, updates and promotions via email
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="smsUpdates"
                name="smsUpdates"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                onChange={(e) => setSmsUpdatesChecked(e.target.checked)}
              />
              <label
                htmlFor="smsUpdates"
                className="mx-3 text-[14px] font-medium text-[#3F3F46] sm:text-[16px]"
              >
                Send me tips, updates and promotions via SMS
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="h-[50px] w-full rounded-[8px] bg-[#FFE9D6] text-[14px] font-medium text-[#FF9741] transition-all duration-150 hover:bg-[#e3863a] hover:text-white sm:text-[16px]"
              >
                {formik.isSubmitting ? "Loading..." : "Sign Up"}
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[14px] font-medium text-[#3F3F46] sm:text-[16px]">
              Do have an account?{" "}
              <Link to="/login">
                <span className="text-[#3CC8A1]">Log in</span>
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="hidden h-screen w-[50%] items-center justify-center bg-[#F4F4F5] lg:flex">
        <img src="/assets/AI_hosptial-removebg-preview.png" alt="" />
      </div>
    </div>
  );
};

export default Register;

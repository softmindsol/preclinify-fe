import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"; // For validation schema
import supabase from "../config/helper";
import Logo from "../components/common/Logo";
import { toast } from "sonner"; // Import the toast module
import { resendVerificationEmail } from "../utils/authUtils";
import { fetchSubscriptions, getUserIDSubscriptionTable } from "../redux/features/subscription/subscription.service";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
 

  // Formik setup
 const formik = useFormik({
   initialValues: {
     email: "",
     password: "",
     rememberMe: false,
   },
   validationSchema: Yup.object({
     email: Yup.string().email("Invalid email address").required("Required"),
     password: Yup.string().required("Required"),
   }),
   onSubmit: async (values, { setSubmitting, setErrors }) => {
     try {
       // Use Supabase auth to log in
       const { data, error } = await supabase.auth.signInWithPassword({
         email: values.email,
         password: values.password,
       });

       if (error || !data?.user) {
         setErrors({ email: "Invalid Login Credentials!" });
         return;
       }

       const userId = data?.user?.id;
       localStorage.setItem("userId", userId);
       localStorage.setItem("authToken", data.session.access_token); // Store token if needed

       // Fetch subscriptions and check response
       dispatch(getUserIDSubscriptionTable({ userId }))
         .unwrap()
         .then((res) => {
           console.log("response login", res);

           // Redirect based on subscription response
           if (Array.isArray(res) && res.length === 0) {
             navigate("/pricing", { replace: true });
           } else {
             navigate("/dashboard", { replace: true });
           }

           toast.success("Logged in successfully!");
         })
         .catch((error) => {
           console.error("Error fetching subscriptions:", error);
           toast.error("Failed to fetch subscriptions.");
         });
     } catch (error) {
       setErrors({ email: "Invalid Login Credentials!" });
     } finally {
       setSubmitting(false); // Stop the loader once API call is done
     }
   },
 });

  return (
    <div className="flex w-full items-center overflow-hidden">
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-y-5 bg-[#FFFFFF] lg:w-[50%]">
        <Link to="/">
          <Logo />
        </Link>
        <p className="text-[16px] font-medium leading-[29px] text-[#3F3F46] sm:text-[24px]">
          Log into Preclinify
        </p>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-2 h-[400px] space-y-3"
        >
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
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your Email..."
              className="mt-2 h-[50px] w-[100%] rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] sm:w-[430px] md:placeholder:text-[16px]"
              required
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-[14px] text-red-500 sm:text-[16px]">
                {formik.errors.email}
              </div>
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
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your Password..."
              className="mt-2 h-[50px] w-[100%] rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] sm:w-[430px] md:placeholder:text-[16px]"
              required
            />
            <span
              className="absolute right-3 top-12 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </span>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-[14px] text-red-500 sm:text-[16px]">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          <div className="mt-10 flex h-[50px] flex-col items-center space-y-2 sm:flex-row sm:justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
              <label
                htmlFor="rememberMe"
                className="mx-3 text-[14px] font-medium text-[#3F3F46] sm:text-[16px]"
              >
                Keep me logged in
              </label>
            </div>
            <Link to="/forget-password">
              <span className="relative z-10 cursor-pointer text-[14px] font-medium text-[#3F3F46] underline hover:text-[#3F3F46] sm:text-[16px]">
                Forgot password?
              </span>
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="h-[50px] w-[100%] rounded-[8px] bg-[#FFE9D6] font-medium text-[#FF9741] transition-all duration-150 hover:bg-[#e3863a] hover:text-white sm:w-[430px]"
              disabled={formik.isSubmitting} // Disable the button while loading
            >
              {formik.isSubmitting ? "Loading..." : "Log in"}
            </button>
          </div>
          <div className="text-center">
            <p className="text-[12px] font-medium text-[#3F3F46] sm:text-[16px]">
              Don’t have an account?{" "}
              <Link to="/signup">
                <span className="text-[#3CC8A1]">Sign up</span>
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

export default Login;

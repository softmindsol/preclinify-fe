import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"; // For validation schema
import supabase from "../config/helper";
import Logo from "../components/common/Logo";
import { toast } from "sonner"; // Import the toast module
import { resendVerificationEmail } from "../utils/authUtils";

const Login = () => {
  const navigate = useNavigate();

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

        localStorage.setItem("authToken", data.session.access_token); // Store token if needed

        if (data?.session) {
          navigate("/dashboard");
          toast.success("Logged in successfully!"); // Show success toast
        }

        // navigate('/dashboard'); // Redirect to the dashboard or another page
        // if (error) {
        //     toast.error(error.message);
        //     await resendVerificationEmail(values.email);
        //     setErrors({ email: error.message }); // Set error message for email field
        // } else {
        //     // On success, store the session (if needed)
        //     localStorage.setItem('authToken', data.session.access_token); // Store token if needed
        //     toast.success('Logged in successfully!'); // Show success toast
        //     navigate('/dashboard'); // Redirect to the dashboard or another page
        // }
      } catch (error) {
        setErrors({ email: "An error occurred. Please try again." });
      } finally {
        setSubmitting(false); // Stop the loader once API call is done
      }
    },
  });

  return (
    <div className="flex w-full items-center overflow-hidden">
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-y-5 bg-[#FFFFFF] lg:w-[50%]">
        <Logo />
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
          <div>
            <label
              htmlFor="password"
              className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
            >
              Password
            </label>
            <br />
            <input
              type="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your Password..."
              className="mt-2 h-[50px] w-[100%] rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] sm:w-[430px] md:placeholder:text-[16px]"
              required
            />
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

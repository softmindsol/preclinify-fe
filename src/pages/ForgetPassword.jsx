import React, { useState } from "react";
import Logo from "../components/common/Logo";
import supabase from "../config/helper";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true); // Stop the loader once API call is done

    if (!email) {
      setError("Email address is required.");
      setIsLoading(false); // Stop the loader once API call is done

      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.href}/reset-password`, // Replace with your actual reset URL
    });

    if (error) {
      setError(error.message);
      toast.error("Invalid email");

      setIsLoading(false); // Stop the loader once API call is done
    } else {
      toast.success("Reset Link send to your email, Check your email");
    }
    setIsLoading(false); // Stop the loader once API call is done
  };

  return (
    <div className="flex w-full items-center overflow-hidden">
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-y-5 bg-[#FFFFFF] lg:w-[50%]">
        <Link to="/">
          <Logo />
        </Link>
        <p className="text-[16px] font-medium leading-[29px] text-[#3F3F46] sm:text-[24px]">
          Forgot Password
        </p>
        <form
          onSubmit={handlePasswordReset}
          className="mt-2 w-[90%] space-y-3 sm:w-[430px]"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email..."
              className="mt-2 h-[50px] w-full rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] md:placeholder:text-[16px]"
              // required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}

          <div>
            <button
              type="submit"
              className="h-[50px] w-full rounded-[8px] bg-[#FFE9D6] text-[14px] font-medium text-[#FF9741] transition-all duration-150 hover:bg-[#e3863a] hover:text-white sm:text-[16px]"
            >
              {isLoading ? "Loading..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
      <div className="hidden h-screen w-[50%] items-center justify-center bg-[#F4F4F5] lg:flex">
        <img src="/assets/AI_hosptial-removebg-preview.png" alt="" />
      </div>
    </div>
  );
};

export default ForgetPassword;

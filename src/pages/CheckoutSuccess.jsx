import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchSubscriptions } from "../redux/features/subscription/subscription.service";
import { useDispatch } from "react-redux";

function CheckoutSuccess() {
  const userId = localStorage.getItem("userId");
  console.log(userId);

  const dispatch = useDispatch();
  useEffect(() => {
    if (userId) {
      dispatch(fetchSubscriptions({ userId }));
    }
  }, []);
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-md">
        <svg
          viewBox="0 0 24 24"
          className="mx-auto my-6 h-16 w-16 text-green-600"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <h3 className="text-base font-semibold text-gray-900 md:text-2xl">
          Subscription Successful!
        </h3>
        <p className="my-2 text-gray-600">
          Thank you for completing your subscription payment. You're now
          subscribed to your selected plan.
        </p>
        <p>Enjoy your premium content!</p>
        <div className="py-10">
          <Link
            to="/dashboard"
            className="rounded-lg bg-indigo-600 px-12 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;

import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import { CheckCircle, Tag } from "lucide-react";
import PlanSlug from "../utils/PlanSlug";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Pricing = () => {
  const userId = localStorage.getItem("userId");
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingPlans = {
    termly: [
      {
        title: "The OSCE plan",
        price: 35,
        monthlyPrice: (35 / 4).toFixed(2),
        "plan-slug": PlanSlug("The OSCE plan", 3),
        features: [
          "Station specific OSCE scenarios",
          "Access to our custom simulated AI patients",
        ],
      },
      {
        title: "The Full Package",
        price: 45,
        monthlyPrice: (45 / 4).toFixed(2),
        "plan-slug": PlanSlug("The Full Package", 3),
        hasDiscount: true,
        discount: 20, // 20% discount for Termly
        features: [
          "Everything in OSCE",
          "MLA + Clinical Bank",
          "SAQ question bank",
          // "Pre-clinical",
          // "Data interpretation",
          // "Question generation",
          "Custom AI Tutor Bot",
        ],
      },
    ],
    annual: [
      {
        title: "The OSCE plan",
        price: 50,
        oldPrice: 8.75, // Old price for Annual
        monthlyPrice: (50 / 12).toFixed(1),
        "plan-slug": PlanSlug("The OSCE plan", 12),
        features: [
          "Station specific OSCE scenarios",
          "Access to our custom simulated AI patients",
        ],
      },
      {
        title: "The Full Package",
        price: 65,
        oldPrice: 11.25, // Old price for Annual
        monthlyPrice: (65 / 12).toFixed(1),
        "plan-slug": PlanSlug("The Full Package", 12),
        hasDiscount: true,
        discount: 50, // 30% discount for Annual
        features: [
          "Everything in OSCE",
          "MLA + Clinical Bank",
          "SAQ question bank",
          // "Pre-clinical",
          // "Data interpretation",
          // "Question generation",
          "Custom AI Tutor Bot",
        ],
      },
      {
        title: "The Pass Guarantee",
        price: 1280,
        showTotalOnly: true,
        "plan-slug": PlanSlug("The Pass Guarantee", 12),
        features: [
          "Everything in The Full Package",
          "Guaranteed pass of this academic year",
          "1-1 Tutoring from a top decile student",
        ],
      },
    ],
  };

  const getCurrentPlans = () => {
    return isAnnual ? pricingPlans.annual : pricingPlans.termly;
  };

  // Function to handle the subscription
  const handleSubscription = async (planSlug) => {
    try {
      toast.success("You are being redirected to the payment gateway");
      // Send the plan slug to the backend via an Axios POST request
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/subscribe?plan=${planSlug}&userId=${userId}`,
      );

      if (response.status === 200) {
        // Handle success (maybe show a success message to the user)
        window.location.href = response.data.url; // Redirect user to Stripe checkout page
      }
    } catch (error) {
      console.error("Error with subscription:", error);
      // Handle error (maybe show an alert or message to the user)
    }
  };

  return (
    <div className="">
      <Navbar />
      <div className="mt-[500px] flex h-screen flex-col items-center justify-center lg:mt-24 2xl:mt-32">
        <div className="text-center text-[24px] font-semibold text-[#52525B] lg:text-[36px]">
          <p>So confident</p>
          <p>we can even guarantee you pass.</p>
        </div>
        <div className="flex h-[50px] w-[224px] items-center justify-center gap-x-8 rounded-[8px] bg-[#3CC8A1] p-8 font-bold text-white">
          <p
            className={`cursor-pointer rounded px-4 py-2 hover:bg-white/20 ${!isAnnual ? "bg-white/20" : ""}`}
            onClick={() => setIsAnnual(false)}
          >
            Termly
          </p>
          <p
            className={`cursor-pointer rounded px-4 py-2 hover:bg-white/20 ${isAnnual ? "bg-white/20" : ""}`}
            onClick={() => setIsAnnual(true)}
          >
            Annual
          </p>
        </div>
        <div className="mt-2 text-[16px] font-medium text-[#71717A]">
          <p>Save with an annual plan</p>
        </div>

        <div>
          <div className="flex flex-col items-center justify-center gap-x-5 lg:flex-row">
            {getCurrentPlans().map((plan, index) => (
              <div
                key={index}
                className="relative mb-8 mt-5 rounded-[16px] transition hover:shadow-greenBlur"
              >
                <div className="h-[500px] w-[270px] rounded-[16px] border-[1px] border-[#3CC8A1] lg:h-[590px] lg:w-[310px]">
                  <div className="rounded-tl-[14px] rounded-tr-[14px] bg-[#3CC8A1] p-8 text-center text-white">
                    <h3 className="mb-2 text-xl font-semibold">{plan.title}</h3>
                    <div className="font-bold">
                      {plan.oldPrice && (
                        <span className="mr-2 text-2xl text-[#D4D4D8] line-through">
                          £{plan.oldPrice}
                        </span>
                      )}
                      <span className="text-4xl">
                        £{plan.showTotalOnly ? plan.price : plan.monthlyPrice}
                        <span className="text-lg font-normal">
                          /{plan.showTotalOnly ? "year" : "month"}
                        </span>
                      </span>
                    </div>
                    {plan.hasDiscount && (
                      <div className="mt-3 inline-flex items-center rounded-full bg-white/20 px-3 py-1">
                        <Tag size={14} className="mr-2" />
                        <span className="text-sm">
                          {`Save up to ${plan.discount}% ${isAnnual ? "annually" : "termly"}`}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={`space-y-2 p-8 ${plan.title === "The OSCE plan" ? "text-[16px] lg:text-[18px]" : "text-[14px] lg:text-[16px]"}`}
                  >
                    <div className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start">
                          <CheckCircle
                            className="mt-1 flex-shrink-0 text-[#FF9741]"
                            size={18}
                          />
                          <span className="ml-3 text-[#3F3F46]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 transform">
                    <button
                      onClick={() => handleSubscription(plan["plan-slug"])} // Call subscription handler
                      className="h-[40px] w-[232px] rounded-[8px] border-[1px] border-[#3CC8A1] bg-transparent text-[16px] font-semibold text-[#3CC8A1] transition-all duration-200 hover:bg-[#3CC8A1] hover:text-white"
                    >
                      Get Access
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

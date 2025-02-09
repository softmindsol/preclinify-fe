import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import { CheckCircle, Tag } from 'lucide-react';
import PlanSlug from '../utils/PlanSlug';
import axios from 'axios';
import { toast } from 'sonner';

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    const pricingPlans = {
        termly: [
            {
                title: "The OSCE plan",
                price: 35,
                monthlyPrice: (35 / 3).toFixed(1),
                "plan-slug":  PlanSlug("The OSCE plan", 3),
                features: [
                    "Station specific OSCE scenarios",
                    "60 hours of OSCE bot access"
                ]
            },
            {
                title: "The Full Package",
                price: 45,
                monthlyPrice: (45 / 3).toFixed(1),
                "plan-slug": PlanSlug("The Full Package", 3),
                hasDiscount: true,
                discount: 20, // 20% discount for Termly
                features: [
                    "Everything in OSCE",
                    "MLA + Clinical Bank",
                    "SAQ question bank",
                    "Pre-clinical",
                    "Data interpretation",
                    "Question generation",
                    "Tutor Bot"
                ]
            }
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
                    "60 hours of OSCE bot access"
                ]
            },
            {
                title: "The Full Package",
                price: 65,
                oldPrice: 11.25, // Old price for Annual
                monthlyPrice: (65 / 12).toFixed(1),
                "plan-slug": PlanSlug("The Full Package", 12),
                hasDiscount: true,
                discount: 30, // 30% discount for Annual
                features: [
                    "Everything in OSCE",
                    "MLA + Clinical Bank",
                    "SAQ question bank",
                    "Pre-clinical",
                    "Data interpretation",
                    "Question generation",
                    "Tutor Bot"
                ]
            },
            {
                title: "The Pass Guarantee",
                price: 1280,
                showTotalOnly: true,
                "plan-slug": PlanSlug("The Pass Guarantee", 12),
                features: [
                    "Everything in The Full Package",
                    "Guaranteed pass of this academic year",
                    "1-1 Tutoring from a top decile student"
                ]
            }
        ]
    };

    const getCurrentPlans = () => {
        return isAnnual ? pricingPlans.annual : pricingPlans.termly;
    };

    // Function to handle the subscription
    const handleSubscription = async (planSlug) => {
        try {
            toast.success("You are being redirected to the payment gateway");
            // Send the plan slug to the backend via an Axios POST request
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/subscribe?plan=${planSlug}`);

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
            <div className="flex flex-col items-center justify-center h-screen mt-[500px] lg:mt-24 2xl:mt-32">
                <div className="font-semibold text-[24px] lg:text-[36px] text-[#52525B] text-center">
                    <p>So confident</p>
                    <p>we can even guarantee you pass.</p>
                </div>
                <div className="flex w-[224px] p-8 font-bold h-[50px] items-center justify-center bg-[#3CC8A1] rounded-[8px] text-white gap-x-8">
                    <p
                        className={`hover:bg-white/20 px-4 py-2 cursor-pointer rounded ${!isAnnual ? 'bg-white/20' : ''}`}
                        onClick={() => setIsAnnual(false)}
                    >
                        Termly
                    </p>
                    <p
                        className={`hover:bg-white/20 px-4 py-2 cursor-pointer rounded ${isAnnual ? 'bg-white/20' : ''}`}
                        onClick={() => setIsAnnual(true)}
                    >
                        Annual
                    </p>
                </div>
                <div className="text-[16px] font-medium text-[#71717A] mt-2">
                    <p>Save with an annual plan</p>
                </div>

                <div>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-x-5">
                        {getCurrentPlans().map((plan, index) => (
                            <div key={index} className="mt-5 mb-8 relative transition hover:shadow-greenBlur rounded-[16px]">
                                <div className="h-[500px] lg:h-[590px] w-[270px] lg:w-[310px] border-[1px] border-[#3CC8A1] rounded-[16px]">
                                    <div className="p-8 bg-[#3CC8A1] text-white text-center">
                                        <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                                        <div className="font-bold">
                                            {plan.oldPrice && (
                                                <span className="text-2xl text-[#D4D4D8] line-through mr-2">
                                                    £{plan.oldPrice}
                                                </span>
                                            )}
                                            <span className="text-4xl">
                                                £{plan.showTotalOnly ? plan.price : plan.monthlyPrice}
                                                <span className="text-lg font-normal">
                                                    /{plan.showTotalOnly ? 'year' : 'month'}
                                                </span>
                                            </span>
                                        </div>
                                        {plan.hasDiscount && (
                                            <div className="mt-3 inline-flex items-center bg-white/20 rounded-full px-3 py-1">
                                                <Tag size={14} className="mr-2" />
                                                <span className="text-sm">
                                                    {`Save up to ${plan.discount}% ${isAnnual ? 'annually' : 'termly'}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`p-8 space-y-2 ${plan.title === "The OSCE plan" ? 'text-[16px] lg:text-[18px]' : 'text-[14px] lg:text-[16px]'}`}>
                                        <div className="space-y-4">
                                            {plan.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-start">
                                                    <CheckCircle className="text-[#FF9741] flex-shrink-0 mt-1" size={18} />
                                                    <span className="ml-3 text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                                        <button
                                            onClick={() => handleSubscription(plan["plan-slug"])}  // Call subscription handler
                                            className="text-[16px] rounded-[8px] font-semibold text-[#3CC8A1] bg-transparent border-[1px] border-[#3CC8A1] hover:bg-[#3CC8A1] hover:text-white w-[232px] h-[40px] transition-all duration-200">
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

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    const pricingPlans = {
        termly: [
            {
                title: "The OSCE plan",
                price: 84,
                features: [
                    "Station specific OSCE scenarios",
                    "60 hours of OSCE bot access"
                ]
            },
            {
                title: "The Full Package",
                price: 120,
                features: [
                    "The Full Package",
                    "Everything in OSCE",
                    "MLA + Clinical Bank",
                    "SAQ question bank",
                    "Pre-clinical",
                    "Data interpretation",
                    "Question generation",
                    "Tutor Bot",
                    "Data interpretation"
                ]
            }
        ],
        annual: [
            {
                title: "The OSCE plan",
                price: 54.60,
                features: [
                    "Station specific OSCE scenarios",
                    "60 hours of OSCE bot access"
                ]
            },
            {
                title: "The Full Package",
                price: 78,
                features: [
                    "The Full Package",
                    "Everything in OSCE",
                    "MLA + Clinical Bank",
                    "SAQ question bank",
                    "Pre-clinical",
                    "Data interpretation",
                    "Question generation",
                    "Tutor Bot",
                    "Data interpretation"
                ]
            },
            {
                title: "The Pass Guarentee",
                price: 1280,
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

    return (
        <div className=''>
            <div className='flex flex-col items-center justify-center h-screen mt-[500px] lg:mt-24 2xl:mt-32'>
                <div className='font-semibold text-[24px] lg:text-[36px] text-[#52525B] text-center'>
                    <p>So confident </p>
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
                <div className='text-[16px] font-medium text-[#71717A] mt-2'>
                    <p>past.. save at least <span className='text-[#FF9741] font-bold'>35%</span> with an annual plan</p>
                </div>
                <div>
                    <div className='flex flex-col lg:flex-row items-center justify-center gap-x-5'>
                        {getCurrentPlans().map((plan, index) => (
                            <div key={index} className='mt-5 relative transition hover:shadow-greenBlur rounded-[16px]'>
                                <div className='h-[500px] lg:h-[556px] w-[270px] lg:w-[310px] border-[1px] border-[#3CC8A1] rounded-[16px]'>
                                    <div className='h-[100px] lg:h-[140px] w-full bg-[#3CC8A1] text-center rounded-tr-[14px] rounded-tl-[14px] p-5'>
                                        <p className='text-white font-bold text-[16px] lg:text-[20px]'>{plan.title}</p>
                                        <p className='text-white font-extrabold text-[26px] lg:text-[40px]'>£{plan.price}</p>
                                    </div>
                                    <div className={`p-8 space-y-2 ${plan.title === "The OSCE plan" ? 'text-[16px] lg:text-[18px]' : 'text-[14px] lg:text-[16px]'}`}>
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className='flex items-center gap-x-5'>
                                                <CheckCircle className="text-[#FF9741]" size={20} />
                                                <p className={`font-medium text-[#3F3F46] ${plan.title === "The OSCE plan" ? 'w-[60%]' : plan.title === "The Pass Guarentee" ? 'w-[65%]' : ''}`}>
                                                    {feature}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='absolute bottom-5 left-1/2 transform -translate-x-1/2'>
                                        <button className='text-[16px] rounded-[8px] font-semibold text-[#3CC8A1] bg-transparent border-[1px] border-[#3CC8A1] hover:bg-[#3CC8A1] hover:text-white w-[232px] h-[40px] transition-all duration-200'>
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
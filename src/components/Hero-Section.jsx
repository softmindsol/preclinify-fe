import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Slider from "./Slider";
 
const Hero = () => {

    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const answers = [
        { id: "q", text: "Preclinify" },
        { id: "w", text: "Answer #2" },
        { id: "e", text: "Also Preclinify" },
        { id: "r", text: "Answer #4" },
        { id: "t", text: "Us again" },
    ];
    return (
        <div className="mt-8  overflow-y-auto">
            <div className="relative  h-[60vh] md:h-[77vh] lg:h-screen  flex items-center justify-center ">
                <div
                    className="hidden md:block md:absolute top-32 left-0 w-[150px] h-[450px] lg:w-[200px] lg:h-[500px] xl:w-[273px] xl:h-[557px] bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url('/assets/HomePageBG-1.png')` }}
                ></div>

                <div
                    className="hidden md:block md:absolute top-32 right-0 w-[150px] h-[450px] lg:w-[200px] lg:h-[500px] xl:w-[273px] xl:h-[557px] bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url('/assets/HomePageBG-2.png')` }}
                ></div>

                <div className="text-center w-[90%] md:w-[35%] xl:w-[40%] space-y-5 2xl:space-y-10 ">
                    <p className="text-[30px] sm:text-[40px] leading-[36px]  sm:leading-[50px] 2xl:text-[64px] font-bold 2xl:leading-[77px]">
                        <span className="text-[#3CC8A1]">Supercharge</span> your medicine
                        journey!
                    </p>
                    <p className="text-[14px] sm:text-[20px] 2xl:text-[24px]">
                        <span className="font-bold">MLA. SAQ. AI patients</span> and much much
                        more...
                    </p>
                    <Link to={'/signup'}>
                        <button className="mt-4 text-[14px] sm:text-[16px] rounded-[12px] bg-[#FF9741] px-5 py-3 text-white font-extrabold shadow-orangeBlur hover:shadow-lg transition">
                            Sign Up Now
                        </button>
                    </Link>

                </div>
            </div>

            <div className="flex items-center flex-wrap justify-around -mt-24 md:-mt-48">
                <img src="/assets/LeicesterLogo-1.png" alt="" />
                <img src="/assets/university-of-birmingham-logo.png" alt="" />
                <img src="/assets/University_of_Manchester-Logo.png" alt="" />
                <img src="/assets/University_of_Bristol-Logo.png" alt="" />
                <img src="/assets/Newcastle-University-Logo.png" alt="" />
            </div>

            <div className="w-[90%] lg:w-[58rem] xl:w-[75rem] 2xl:w-7xl mx-auto p-[2rem] lg:p-16 mt-12 flex items-center justify-center bg-gray-50  rounded-[48px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] md:gap-20 items-center">
                   
                    <div>
                        {answers.map((answer) => (
                            <div
                                key={answer.id}
                                className={`flex items-center justify-between p-[0.5rem] 2xl:p-4 border rounded-lg mb-4 ${selectedAnswer === answer.id
                                    ? "border-green-500"
                                    : "border-[#FF9741]"
                                    }`}
                                onClick={() => setSelectedAnswer(answer.id)}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="answer"
                                        id={answer.id}
                                        value={answer.id}
                                        className="hidden"
                                        onChange={() => setSelectedAnswer(answer.id)}
                                        checked={selectedAnswer === answer.id}
                                    />
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${selectedAnswer === answer.id
                                            ? "border-green-500"
                                            : "border-[#FF9741]"
                                            }`}
                                    >
                                        {selectedAnswer === answer.id && (
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        )}
                                    </div>
                                    <label htmlFor={answer.id} className="text-[#3F3F46] font-medium text-[14px] lg:text-[16px] cursor-pointer">
                                        {answer.text}
                                    </label>
                                </div>
                                <span className="text-[#27272A] font-medium uppercase text-[16px] bg-[#F4F4F5] p-1">{answer.id.toUpperCase()}</span>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h2 className="text-[20px] lg:text-[25px] 2xl:text-[32px] font-semibold text-[#3F3F46] mb-4">
                            Want to become a <span className="text-[#FF9741]">doctor</span> in the UK?
                        </h2>
                        <ul className="text-[#3F3F46] space-y-2 text-[14px] lg:text-[16px] 2xl:text-[20px]">
                            <li>• We’re building the <strong>largest</strong> bank of high-quality UKMLA questions</li>
                            <li>• Built for UK medical students and international medical graduates</li>
                            <li>• All according to the relevant and <strong>updated UK guidelines</strong></li>
                            <li>• Made in line with the BMA’s “what makes a good question” guidance</li>
                            <li>• Struggling to find <strong>SAQ resources</strong>? We’ve got you covered</li>
                        </ul>
                    </div>
                </div>
            </div>



            <div className="flex flex-col-reverse  md:flex-row items-center mx-auto gap-x-5  lg:gap-x-0  2xl:gap-x-72 justify-between 2xl:justify-center mt-32 w-[90%] lg:w-[58rem] xl:w-[75rem] 2xl:w-7xl">
                <div className="mt-5 md:mt-0">
                    <h1 className="text-[#3F3F46] text-[20px] sm:text-[24px] lg:text-[32px] xl:text-[40px] 2xl:text-[32px] font-extrabold">See yourself improve in <span className="text-[#FF9741]">real-time</span> </h1>
                    <ul className="text-[#3F3F46] space-y-2 text-[14px] sm:text-[18px] lg:text-[24px] 2xl:text-[20px]">
                        <li>• <span className="text">Track</span> your progress</li>
                        <li>• See how you <span>compare</span></li>
                        <li>• Understand how to  <span>improve</span></li>
                        <li>• Focus your learning,<span>save time</span></li>
                    </ul>
                </div>

                <div className="bg-[#FFFFFF] rounded-[24px] w-[90%] h-[350px]  sm:w-[400px] sm:h-[410px] xl:w-[489px] xl:h-[503px] relative">
                    <img src="/assets/sling.png" alt="" className="" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center xl:justify-between 2xl:justify-center  px-8 py-12  md:space-y-0 space-x-8 lg:space-x-16 2xl:space-x-[300px]  ">
                <div className="flex gap-x-3">

                    <div className="space-y-3">
                    <div className="w-[180px]  lg:w-[263px] xl:w-[308px] h-[210px] lg:h-[274px] bg-[#FCE8D8] rounded-lg"></div>
                        <div className="w-[180px]  lg:w-[263px] xl:w-[308px] h-[138px] bg-white  rounded-lg"></div>

                     </div>
                     
                    <div className="space-y-3">
                        <div className="w-[130px] lg:w-[185px] h-[140px] lg:h-[172px] bg-white rounded-lg"></div>

                        <div className="w-[130px] lg:w-[185px] h-[209px] lg:h-[248px] bg-[#FCE8D8] rounded-lg"></div>

                     </div>
                </div>


                <div className="mt-5 md:mt-0">
                    <h2 className="text-[20px] sm:text-[24px] lg:text-[32px] xl:text-[40px] 2xl:text-[32px]   font-bold text-[#3F3F46]">
                        Everything you need in{" "}
                        <span className="text-[#FF9741]">one place</span>
                    </h2>
                    <ul className="mt-4 text-[#3F3F46] space-y-2 text-[14px] sm:text-[18px] lg:text-[20px] font-medium ">
                        <li>• <span className="font-bold">MLA</span>  specific content</li>
                        <li>• High quality <span className="font-bold">SAQ</span>  questions</li>
                        <li>• Station specific <span className="font-bold"> OSCE scenarios</span> </li>
                        <li>• Fully speech to speech AI simulated patients</li>
                        <li>
                            • Have an idea for a feature? DM us
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 underline"
                            >
                                @Preclinify 
                            </a>
                            <span>on Instagram</span>
                           
                        </li>
                    </ul>
                </div>
            </div>

            <div className="my-10">
                <p className="font-bold text-[20px] sm:text-[24px] lg:text-[32px] text-[#3F3F46] leading-[38px] text-center">Here’s what students say about us....</p>
              
                <div className="rounded-[48px] bg-[#ffff] ">

                </div>
            </div>

            <Slider/>

            <div className=" space-y-10 text-center w-full mt-20 md:mt-56 ">
                <div className="flex items-center justify-center flex-col ">
                    <div className="text-[24px] sm:text-[36px] lg:text-[48px] 2xl:text-[64px] text-center font-bold leading-[35px] sm:leading-[45px] lg:leading-[55px] 2xl:leading-[77px]">
                        <p className= "text-[20px] sm:text-[26px] lg:text-[36px] 2xl:text-[48px] font-extrabold text-[#3F3F46]">Ready to</p>
                        <p className="text-[#3CC8A1]">Supercharge your</p>  
                        <p>medicine journey!</p>
                    </div>
                   
                </div>
                <Link to={'/signup'}>
                    <button className="mt-4 rounded-[12px] text-[10px] sm:text-[14px] lg:text-[16px] bg-[#FF9741] px-3.5 py-2 sm:px-5 sm:py-3 text-white font-extrabold shadow-orangeBlur hover:shadow-lg transition">
                        Sign Up Now
                    </button>
                </Link>
             

            </div>

            <Footer />
        </div>
    );
};

export default Hero;

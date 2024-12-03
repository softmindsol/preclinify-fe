import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="mt-8  overflow-hidden ">
            <div className="relative w-full h-screen  flex items-center justify-center">
                {/* Left Background Image */}

                <div
                    className="absolute top-32 left-0 w-[273px] h-[557px] bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url('/assets/HomePageBG-1.png') ` }}
                ></div>

                {/* Right Background Image */}
                <div
                    className="absolute top-32 right-0 w-[273px] h-[557px] bg-cover bg-no-repeat "
                    style={{ backgroundImage: ` url('/assets/HomePageBG-2.png')` }}
                ></div>

                {/* Center Content */}
                <div className="text-center w-[40%] space-y-10 ">
                    <p className="text-[64px] font-bold leading-[77px]">
                        <span className="text-[#3CC8A1]">Supercharge</span> your medicine
                        journey!
                    </p>
                    <p className="text-[24px]">
                        <span className="font-bold">MLA. SAQ. AI patients</span> and much much
                        more...
                    </p>
                    <Link to={'/signup'}>
                        <button className="mt-4 rounded-[12px] bg-[#FF9741] px-5 py-3 text-white font-extrabold shadow-orangeBlur hover:shadow-lg transition">
                            Sign Up Now
                        </button>
                    </Link>
                    
                </div>
            </div>

            <div className="flex items-center justify-around -mt-48">
                <img src="/assets/LeicesterLogo-1.png" alt="" />
                <img src="/assets/university-of-birmingham-logo.png" alt="" />
                <img src="/assets/University_of_Manchester-Logo.png" alt="" />
                <img src="/assets/University_of_Bristol-Logo.png" alt="" />
                <img src="/assets/Newcastle-University-Logo.png" alt="" />
            </div>
        </div>
    );
};

export default Hero;

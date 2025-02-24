import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./common/Footer";
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
    <div className="mt-8 overflow-y-auto">
      <div className="relative flex h-[60vh] items-center justify-center md:h-[77vh] lg:h-screen">
        <div
          className="-left-3 top-32 hidden h-[450px] w-[150px] bg-cover bg-no-repeat md:absolute md:block lg:h-[500px] lg:w-[200px] xl:h-[557px] xl:w-[273px]"
          style={{ backgroundImage: `url('/assets/Hero4-1.png')` }}
        ></div>

        <div
          className="right-0 top-32 hidden h-[450px] w-[150px] bg-cover bg-no-repeat md:absolute md:block lg:h-[500px] lg:w-[200px] xl:h-[557px] xl:w-[273px]"
          style={{ backgroundImage: `url('/assets/Hero4-2.png')` }}
        ></div>

        <div className="w-[90%] space-y-5 text-center md:w-[35%] xl:w-[40%] 2xl:space-y-10">
          <p className="text-[30px] font-extrabold leading-[36px] sm:text-[40px] sm:leading-[50px] 2xl:text-[64px] 2xl:leading-[77px]">
            <span className="text-extrabold text-[#3CC8A1]">Supercharge</span>{" "}
            your medicine journey!
          </p>
          <p className="text-[14px] font-bold sm:text-[20px] 2xl:text-[24px]">
            <span className="font-bold">MLA. SAQ. AI patients</span>{" "}
            <span className="font-medium">and much much more...</span>
          </p>
          <Link to={"/signup"}>
            <button className="mt-4 rounded-[12px] bg-[#FF9741] px-5 py-3 text-[14px] font-extrabold text-white shadow-orangeBlur transition hover:shadow-lg sm:text-[16px]">
              Sign Up Now
            </button>
          </Link>
        </div>
      </div>

      {/* <div className="flex items-center flex-wrap justify-around -mt-24 md:-mt-48">
                <img src="/assets/LeicesterLogo-1.png" alt="" />
                <img src="/assets/university-of-birmingham-logo.png" alt="" />
                <img src="/assets/University_of_Manchester-Logo.png" alt="" />
                <img src="/assets/University_of_Bristol-Logo.png" alt="" />
                <img src="/assets/Newcastle-University-Logo.png" alt="" />
            </div> */}

      <div className="mx-auto mt-12 flex w-[90%] items-center justify-center rounded-[48px] bg-gray-50 p-[2rem] md:-mt-28 lg:w-[58rem] lg:p-10 xl:w-[75rem] 2xl:w-[105rem]">
        <div className="grid grid-cols-1 items-center gap-[2rem] md:grid-cols-2 md:gap-32">
          <div>
            {answers.map((answer, index) => (
              <div
                key={answer.id}
                className={`mb-4 flex items-center justify-between rounded-[20px] border-2 p-[0.5rem] 2xl:px-4 ${
                  selectedAnswer === answer.id
                    ? "border-green-500"
                    : index % 2 === 0
                      ? "border-[#3CC8A1]"
                      : "border-[#FF453A]"
                }`}
                onClick={() => setSelectedAnswer(answer.id)}
              >
                <div className="flex items-center xl:h-[70px]">
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
                    className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      selectedAnswer === answer.id
                        ? "border-green-500"
                        : index % 2 === 0
                          ? "border-[#3CC8A1]"
                          : "border-[#FF453A]"
                    }`}
                  >
                    {selectedAnswer === answer.id && (
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    )}
                  </div>
                  <label
                    htmlFor={answer.id}
                    className="cursor-pointer text-[14px] font-medium text-[#3F3F46] lg:text-[16px]"
                  >
                    {answer.text}
                  </label>
                </div>
                <span className="bg-[#F4F4F5] p-1 text-[16px] font-medium uppercase text-[#27272A]">
                  {answer.id.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <div className="">
            <h2 className="mb-4 text-[20px] font-semibold text-[#3F3F46] lg:text-[25px] 2xl:text-[32px]">
              Want to become a <span className="">doctor</span> in the UK?
            </h2>
            <ul className="space-y-2 text-[14px] text-[#3F3F46] lg:text-[16px] 2xl:text-[20px]">
              <li>
                • We’re building the <strong>largest</strong> bank of
                high-quality UKMLA questions
              </li>
              <li>
                • Built for UK medical students and international medical
                graduates
              </li>
              <li>
                • All according to the relevant and{" "}
                <strong>updated UK guidelines</strong>
              </li>
              <li>
                • Made in line with the BMA’s “what makes a good question”
                guidance
              </li>
              <li>
                • Struggling to find <strong>SAQ resources</strong>? We’ve got
                you covered
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="2xl:w-7xl mx-auto mt-32 flex w-[90%] flex-col-reverse items-center justify-between gap-x-5 md:flex-row lg:w-[58rem] lg:gap-x-0 xl:w-[75rem] 2xl:justify-center 2xl:gap-x-72">
        <div className="mt-5 md:mt-0">
          <h1 className="text-[20px] font-extrabold text-[#3F3F46] sm:text-[24px] lg:text-[32px] xl:text-[40px] 2xl:text-[32px]">
            See yourself improve in{" "}
            <span className="text-[#FF9741]">real-time</span>{" "}
          </h1>
          <ul className="space-y-2 text-[14px] text-[#3F3F46] sm:text-[18px] lg:text-[24px] 2xl:text-[20px]">
            <li>
              • <span className="font-bold">Track</span> your progress
            </li>
            <li>
              • See how you <span className="font-bold">compare</span>
            </li>
            <li>
              • Understand how to <span className="font-bold">improve</span>
            </li>
            <li>
              • Focus your learning,
              <span className="font-bold">save time</span>
            </li>
          </ul>
        </div>

        <div className="relative h-[350px] w-[90%] rounded-[24px] bg-[#FFFFFF] sm:h-[410px] sm:w-[400px] xl:h-[503px] xl:w-[489px]">
          <img
            src="/assets/sling.png"
            alt=""
            className="absolute bottom-28 right-5 z-10 h-[300px] w-full"
          />
        </div>
      </div>

      <div className="flex flex-col items-center space-x-8 px-8 py-12 md:flex-row md:space-y-0 lg:space-x-16 xl:justify-between 2xl:justify-center 2xl:space-x-[300px]">
        <div className="flex gap-x-3">
          <div className="space-y-3">
            <div className="h-[210px] w-[180px] rounded-lg bg-[#FFE9D6] lg:h-[274px] lg:w-[263px] xl:w-[308px]"></div>
            <div className="h-[138px] w-[180px] rounded-lg bg-white lg:w-[263px] xl:w-[308px]"></div>
          </div>

          <div className="space-y-3">
            <div className="h-[140px] w-[130px] rounded-lg bg-white lg:h-[172px] lg:w-[185px]"></div>

            <div className="h-[209px] w-[130px] rounded-lg bg-[#FFE9D6] lg:h-[248px] lg:w-[185px]"></div>
          </div>
        </div>

        <div className="mt-5 md:mt-0">
          <h2 className="text-[20px] font-bold text-[#3F3F46] sm:text-[24px] lg:text-[32px] xl:text-[40px] 2xl:text-[32px]">
            Everything you need in{" "}
            <span className="text-[#FF9741]">one place</span>
          </h2>
          <ul className="mt-4 space-y-2 text-[14px] font-medium text-[#3F3F46] sm:text-[18px] lg:text-[20px]">
            <li>
              • <span className="font-bold">MLA</span> specific content
            </li>
            <li>
              • High quality <span className="font-bold">SAQ</span> questions
            </li>
            <li>
              • Station specific{" "}
              <span className="font-bold"> OSCE scenarios</span>{" "}
            </li>
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
        <p className="text-center text-[20px] font-bold leading-[38px] text-[#3F3F46] sm:text-[24px] lg:text-[32px]">
          Here’s what students say about us....
        </p>

        <div className="rounded-[48px] bg-[#ffff]"></div>
      </div>

      <Slider />

      <div className="mt-20 w-full space-y-10 text-center md:mt-56">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center text-[24px] font-extrabold leading-[35px] sm:text-[36px] sm:leading-[45px] lg:text-[48px] lg:leading-[55px] 2xl:text-[64px] 2xl:leading-[77px]">
            <p className="text-[20px] text-[#3F3F46] sm:text-[26px] lg:text-[36px] 2xl:text-[48px]">
              Ready to
            </p>
            <p className="text-[#3CC8A1]">
              Supercharge <span className="text-[#3F3F46]">your</span>{" "}
            </p>
            <p> medicine journey?</p>
          </div>
        </div>
        <Link to={"/signup"}>
          <button className="mt-4 rounded-[12px] bg-[#FF9741] px-3.5 py-2 text-[10px] font-extrabold text-white shadow-orangeBlur transition hover:shadow-lg sm:px-7 sm:py-3 sm:text-[14px] lg:text-[16px]">
            Sign Up Now
          </button>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default Hero;

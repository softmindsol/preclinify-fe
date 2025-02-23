import React, { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
const Slider = () => {
  return (
    <div>
      <Swiper
        slidesPerView={"auto"}
        //   pagination={{
        //       clickable: true,
        //   }}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="flex items-center justify-center gap-x-8 sm:gap-x-14 lg:gap-x-24">
            <img
              src="/assets/B7021724-7A19-4231-BF0F-02340990D58B.jpg"
              alt=""
            />
            <div className="w-[640px] text-center text-[10px] font-medium text-[#3F3F46] sm:text-[16px] xl:text-[20px] 2xl:text-[24px]">
              <p>
                “Preclinify has been a wonderful addition to my revision and has
                really helped me test my knowledge in preparation for exams.
              </p>
              <p>
                The questions are engaging and relevant, and the answers are
                clearly and thoughtfully explained. Highly recommended for
                fellow future doctors!”
              </p>
              <p
                className="text-[12px] font-bold text-[#FF9741] sm:text-[16px] xl:text-[20px] 2xl:text-[24px]"
                style={{ marginTop: "10px" }}
              >
                Mohammad, University College London
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-center gap-x-8 sm:gap-x-14 lg:gap-x-24">
            <img
              src="/assets/76B402FA-6077-456C-84B5-F74FCCC46E02.jpg"
              alt=""
            />
            <div className="w-[640px] text-center text-[10px] font-medium text-[#3F3F46] sm:text-[16px] xl:text-[20px] 2xl:text-[24px]">
              <p>
                “Preclinify has been an incredible tool for my revision, helping
                me reinforce my knowledge and prepare effectively for exams.
              </p>
              <p>
                The questions are engaging, highly relevant, and come with
                well-explained answers that make complex topics easier to
                understand.
              </p>
              <p
                className="text-[12px] font-bold text-[#FF9741] sm:text-[16px] xl:text-[20px] 2xl:text-[24px]"
                style={{ marginTop: "10px" }}
              >
                Mohammad, University College London
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Slider;

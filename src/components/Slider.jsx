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
                The website is really easy to use and match the questions that
                come up in my exams. Wish I discovered it in 1st year!”{" "}
              </p>

              <p
                className="text-[12px] font-bold text-[#FF9741] sm:text-[16px] xl:text-[20px] 2xl:text-[24px]"
                style={{ marginTop: "10px" }}
              >
                Omar, Nottingham University
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
                “The website is really easy to use and match the questions that
                come up in my exams. Wish I discovered it in 1st year!”
              </p>

              <p
                className="text-[12px] font-bold text-[#FF9741] sm:text-[16px] xl:text-[20px] 2xl:text-[24px]"
                style={{ marginTop: "10px" }}
              >
                Omar, Nottingham University
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Slider;

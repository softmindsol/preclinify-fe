import React, {  useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';
const Slider = () => {
  return (
    <div>
          <Swiper
              slidesPerView={'auto'}
            //   pagination={{
            //       clickable: true,
            //   }}
              modules={[Pagination]}
              className="mySwiper"
          >
              <SwiperSlide>
          <div className='flex  items-center justify-center gap-x-8 sm:gap-x-14 lg:gap-x-24 '>
                      <img src="https://images.unsplash.com/photo-1733299703906-29f25913ee6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyM3x8fGVufDB8fHx8fA%3D%3D" alt="" 
                       />
            <div className='text-[#3F3F46] w-[640px] text-[10px] sm:text-[16px] xl:text-[20px] 2xl:text-[24px] font-medium text-center'>
                        <p>
                              “Preclinify has been a wonderful addition to my revision and has really helped me test my knowledge in preparation for exams. 
                        </p>
                        <p>
                              The questions are engaging and relevant, and the answers are clearly and thoughtfully explained. Highly recommended for fellow future doctors!”
                        </p>
                          <p className='text-[12px] font-bold sm:text-[16px] xl:text-[20px] 2xl:text-[24px] text-[#FF9741] ' style={{marginTop:'10px'}}>
                              Mohammad, University College London
                        </p>
                    </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                  <div className='flex items-center justify-center  gap-x-8 sm:gap-x-14 lg:gap-x-24 '>
                      <img src="https://images.unsplash.com/photo-1733299703906-29f25913ee6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyM3x8fGVufDB8fHx8fA%3D%3D" alt="" />
            <div className='text-[#3F3F46] w-[640px] text-[10px] sm:text-[16px] xl:text-[20px] 2xl:text-[24px] font-medium text-center'>
                          <p>
                              “Preclinify has been a wonderful addition to my revision and has really helped me test my knowledge in preparation for exams.
                          </p>
                          <p>
                              The questions are engaging and relevant, and the answers are clearly and thoughtfully explained. Highly recommended for fellow future doctors!”
                          </p>
              <p className='text-[12px] sm:text-[16px] font-bold xl:text-[20px] 2xl:text-[24px] text-[#FF9741] ' style={{ marginTop: '10px' }}>
                              Mohammad, University College London
                          </p>
                      </div>
                  </div>
              </SwiperSlide>
            
          
          </Swiper>
    </div>
  )
}

export default Slider
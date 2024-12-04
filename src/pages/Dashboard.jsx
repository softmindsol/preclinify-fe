import React from 'react'
import Siderbar from '../components/Siderbar'
const Dashboard = () => {
  return (
      <div className='flex'>
          <div className="">
              <Siderbar />
          </div>

        <div className='flex flex-row items-center h-[150px]  justify-evenly w-full p-5'>
              <p className='text-[32px] text-[#52525B] font-extrabold '>Hello Sainavi,</p>
             <div className='flex items-center gap-x-5 '>
                  <div className='bg-[#FFFFFF] rounded-[6px] flex items-center flex-col justify-center w-[250px] h-[85px] '>
                      <p className='text-[#FF9741] text-[32px] font-black'>20 Days</p>
                      <p className='text-[14px] text-[#52525B]'>Until your exam</p>

                  </div>
                  <div className='bg-[#FFFFFF] rounded-[6px]  text-center w-[250px] h-[85px]'>
                    <div className='flex items-center justify-center gap-x-5 h-full '>

                          <img src="https://images.unsplash.com/photo-1719937051124-91c677bc58fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D" alt="aaaa" className='rounded-full w-14 h-14'/>
                          <div className=''>
                              <p className='text-[18px] text-[#52525B] font-extrabold' >Sainavi Mahajan</p>
                              <p className='text-[14px] text-[#A1A1AA]'>Specialist Registrar</p>
                          </div>                    </div>
                
                    
                  </div>
             </div>
             
              <div className='w-[651px] h-[443px] rounded-[12px] bg-[#FFFFFF]'>

             </div>
        </div>
    </div>
  )
}

export default Dashboard
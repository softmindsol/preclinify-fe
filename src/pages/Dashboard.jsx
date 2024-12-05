import React from 'react'
import Siderbar from '../components/Siderbar'
const Dashboard = () => {

    const days = [
        { day: 1, streak: 10 },
        { day: 2, streak: 20 },
        { day: 3, streak: 30, fire: true },
        { day: 4, streak: 40, fire: true },
        { day: 5, streak: 90 },
        { day: 6, streak: 100 },
        { day: 7, streak: 60 },
        // Repeat the structure for the entire month
    ];

    const getColorClass = (streak) => {
        if (streak > 99) return "bg-green-900";
        if (streak > 75) return "bg-green-700";
        if (streak > 50) return "bg-green-500";
        if (streak > 25) return "bg-green-300";
        return "bg-green-100";
    };

    return (
        <div className='flex'>
            <div className="">
                <Siderbar />
            </div>
            <div className='w-full'>
                <div className='flex flex-row items-center h-[150px]  justify-evenly w-full p-5'>
                    <p className='text-[32px] text-[#52525B] font-extrabold '>Hello Sainavi,</p>
                    <div className='flex items-center gap-x-5 '>
                        <div className='bg-[#FFFFFF] rounded-[6px] flex items-center flex-col justify-center w-[250px] h-[85px] '>
                            <p className='text-[#FF9741] text-[32px] font-black'>20 Days</p>
                            <p className='text-[14px] text-[#52525B]'>Until your exam</p>

                        </div>
                        <div className='bg-[#FFFFFF] rounded-[6px]  text-center w-[250px] h-[85px]'>
                            <div className='flex items-center justify-center gap-x-5 h-full '>

                                <img src="https://images.unsplash.com/photo-1719937051124-91c677bc58fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D" alt="aaaa" className='rounded-full w-14 h-14' />
                                <div className=''>
                                    <p className='text-[18px] text-[#52525B] font-extrabold' >Sainavi Mahajan</p>
                                    <p className='text-[14px] text-[#A1A1AA]'>Specialist Registrar</p>
                                </div>                    </div>


                        </div>
                    </div>


                </div>
                
                
                {/* <div className='w-[651px] h-[443px] rounded-[12px] bg-[#FFFFFF]'>
                    <p className='text-[14px] font-semibold text-[#52525B]'>Current Streak</p>
                    <p className='font-black text-[32px] text-[#FF9741]'>4 Days</p>

                    <div>
                        
                    </div>
                </div> */}
                <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
                    {/* Current Streak */}
                    <div>
                        <p className='text-[14px] font-semibold text-[#52525B]'>Current Streak</p>
                        <p className='font-black text-[32px] text-[#FF9741]'>4 Days</p>
                    </div>
                  
                  <div className='flex '>
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 mt-4">
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={`h-12 w-12 rounded-md flex items-center justify-center text-white ${getColorClass(
                                    day.streak
                                )}`}
                            >
                                {day.fire && (
                                    <span role="img" aria-label="fire" className="text-xl">
                                        🔥
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Legend */}
                    <div className="flex flex-col mt-4 space-y-2">
                        <div className="flex items-center">
                            <div className="h-6 w-6 bg-green-900 rounded-md"></div>
                            <span className="ml-2"> &gt; 99</span>
                        </div>
                        <div className="flex items-center">
                            <div className="h-6 w-6 bg-green-700 rounded-md"></div>
                            <span className="ml-2"> &gt; 75</span>
                        </div>
                        <div className="flex items-center">
                            <div className="h-6 w-6 bg-green-500 rounded-md"></div>
                            <span className="ml-2"> &gt; 50</span>
                        </div>
                        <div className="flex items-center">
                            <div className="h-6 w-6 bg-green-300 rounded-md"></div>
                            <span className="ml-2"> &gt; 25</span>
                        </div>
                        <div className="flex items-center">
                            <div className="h-6 w-6 bg-green-100 rounded-md"></div>
                            <span className="ml-2"> &lt; 25</span>
                        </div>
                    </div>
                    </div>
                </div>
          
            </div>

        </div>
    )
}

export default Dashboard
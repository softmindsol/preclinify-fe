import React, { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import supabase from '../helper';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
} from "date-fns";
import StackedBar from '../components/charts/stacked-bar';
import StackedBarWithSign from '../components/charts/stacked-barwith-sign';
import { useDispatch, useSelector } from 'react-redux';
import { clearResult } from '../redux/features/result/result.slice';
import { resetQuestionReviewValue } from '../redux/features/question-review/question-review.slice';

const Dashboard = () => {
    const [workEntries, setWorkEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [days, setDays] = useState([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [formattedMonth, setFormattedMonth] = useState("")
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchDailyWork = async () => {
            try {
                const { data, error } = await supabase
                    .from('resultsHistory')
                    .select('*')
                    .eq('userId', '123456543');

                if (error) throw error;

                const formattedData = data.map((entry) => {
                    const date = new Date(entry.timeStamp).toISOString().split('T')[0];
                    return { ...entry, date };
                });

                setWorkEntries(formattedData);
                setLoading(false);
            } catch (err) {
                setError('Error fetching daily work');
                setLoading(false);
            }
        };

        fetchDailyWork();
    }, []);
    // console.log("workEntries:", workEntries);


    useEffect(() => {
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);

        // Create an object to hold aggregated results
        const aggregatedResults = {};

        // Iterate through workEntries to aggregate results by date
        workEntries.forEach((entry) => {
            const date = entry.date; // Assuming entry.date is already formatted as "yyyy-MM-dd"

            // Initialize the date entry if it doesn't exist
            if (!aggregatedResults[date]) {
                aggregatedResults[date] = {
                    workCount: 0,
                    correct: 0,
                    incorrect: 0,
                    totalResult: 0, // To accumulate the result values
                };
            }

            // Increment the work count
            aggregatedResults[date].workCount += 1;

            // Increment correct and incorrect counts based on entry values
            aggregatedResults[date].correct += entry.correct || 0; // Ensure to handle undefined
            aggregatedResults[date].incorrect += entry.incorrect || 0; // Ensure to handle undefined
            aggregatedResults[date].totalResult += entry.result || 0; // Ensure to handle undefined
        });

        // Create an array of days with aggregated results
        const allDays = eachDayOfInterval({ start, end }).map((day) => {
            const formattedDate = format(day, "yyyy-MM-dd");
            const workEntry = aggregatedResults[formattedDate] || { workCount: 0, correct: 0, incorrect: 0, totalResult: 0 };

            return {
                date: formattedDate,
                workCount: workEntry.workCount,
                correct: workEntry.correct,
                incorrect: workEntry.incorrect,
                totalResult: workEntry.totalResult,
            };
        });

        setFormattedMonth(format(selectedDate, "MMMM"));
        setDays(allDays);
    }, [selectedDate, workEntries]);



    const getColorClass = (workCount) => {
        if (workCount > 99) return "bg-[#047857]"; // > 99
        if (workCount > 75) return "bg-[#059669]"; // > 75
        if (workCount > 50) return "bg-[#34D399]"; // > 50
        if (workCount > 25) return "bg-[#6EE7B7]"; // > 25
        if (workCount > 0) return "bg-[#A7F3D0]"; // > 0
        return "bg-[#E4E4E7]"; // Default background for days with no workCount
    };


    useEffect(() => {
        localStorage.removeItem('examTimer'); // Clear storage when timer ends

        dispatch(clearResult());
        dispatch(resetQuestionReviewValue());
    }, [])


    return (
        <div className='flex'>
            <div className="fixed h-full">
                <Sidebar />
            </div>
            <div className='flex-grow ml-[250px] py-10 overflow-y-auto'>
                <div className='flex flex-row items-center  h-[150px] justify-evenly w-full gap-x-16 py-5'>
                    <p className='text-[32px] text-[#52525B] font-extrabold '>Hello Sainavi,</p>
                    <div className='flex items-center gap-x-5 '>
                        <div className='bg-[#FFFFFF] rounded-[6px] flex items-center flex-col justify-center w-[250px] h-[85px] '>
                            <p className='text-[#FF9741] text-[32px] font-black'>20 Days</p>
                            <p className='text-[14px] text-[#52525B] font-medium'>Until your exam</p>
                        </div> 
                        <div className='bg-[#FFFFFF] rounded-[6px] text-center w-[200px] xl:w-[250px] h-[85px]'>
                            <div className='flex items-center justify-center gap-x-5 h-full '>
                                <img
                                    src="https://images.unsplash.com/photo-1719937051124-91c677bc58fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D"
                                    alt="aaaa"
                                    className='rounded-full w-10 h-10 xl:w-14 xl:h-14'
                                />
                                <div className=''>
                                    <p className='text-[14px] xl:text-[18px] text-[#52525B] font-semibold'>Sainavi Mahajan</p>
                                    <p className='text-[10px] xl:text-[14px] text-[#A1A1AA]'>Specialist Registrar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='space-y-5'>
                    <div className='flex justify-center gap-x-5 items-center w-full'>
                        <div className="p-6 w-[500px] xl:w-[610px] 2xl:w-[745px] h-[520px] bg-white rounded-lg shadow-md">
                            <div className='flex items-end justify-end'>
                                <div className="mb-5 relative w-[180px]">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        onCalendarOpen={() => setIsCalendarOpen(true)}
                                        onCalendarClose={() => setIsCalendarOpen(false)}
                                        dateFormat="MMMM yyyy"
                                        showMonthYearPicker
                                        className="relative border rounded w-[180px] p-2 text-[14px] cursor-pointer" // Added cursor-pointer class
                                    />
                                    <span
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isCalendarOpen ? "rotate-180" : ""}`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-chevron-down"
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className='text-center'>
                                <p className='text-[14px] font-semibold text-[#52525B]'>Current Streak</p>
                                <p className='font-black text-[32px] text-[#FF9741]'>4 Days</p>
                            </div>

                            <div className='flex justify-between gap-x-10'>
                                <div className="grid grid-cols-7 gap-2 mt-4">
                                    {days.map((day, index) => {

                                        // Calculate total result and percentage
                                        const target = day.workCount * 100
                                        const workPercentage = Math.floor(Math.min((day.totalResult / target) * 100, 100));
                                        // Determine background color class based on percentage
                                        const bgColorClass = getColorClass(workPercentage);


                                        return (
                                            <div
                                                key={index}
                                                className={`h-12 w-12 rounded-md flex items-center justify-center text-white  ${day.workCount > 0 ? bgColorClass : 'bg-[#E4E4E7]'}`}
                                            >


                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-col mt-4 space-y-2">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 bg-[#047857] rounded-md"></div>
                                        <span className="ml-2"> &gt; 99</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 bg-[#059669] rounded-md"></div>
                                        <span className="ml-2"> &gt; 75</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 bg-[#34D399] rounded-md"></div>
                                        <span className="ml-2"> &gt; 50</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 bg-[#6EE7B7] rounded-md"></div>
                                        <span className="ml-2"> &gt; 25</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 bg-[#A7F3D0] rounded-md"></div>
                                        <span className="ml-2"> &lt; 25</span>
                                    </div>
                                </div>
                            </div>

                            <div className=' w-[400px]  mt-6'>
                                <p className=' text-center text-[#71717A] text-[16px]'>{formattedMonth}</p>
                            </div>
                        </div>
                        <div className='w-[280px] xl:w-[320px] h-[520px]   bg-white rounded-lg shadow-md'>
                            <div className='font-bold text-[14px] xl:text-[18px] text-center text-[#52525B] mt-2 p-5'>
                                <p>Quick Start</p>
                            </div>
                            <hr />

                            <div className='flex items-center justify-between p-5 mt-4'>
                                <div className=''>
                                    <p className='font-medium text-[14px] xl:text-[16px] text-[#3F3F46]'>Renal Medicine +...</p>
                                    <p className='text-[12px] xl:text-[14px] font-semibold text-[#A1A1AA]'>1 day ago</p>
                                </div>
                                <div>
                                    <button className='border-[1px] border-[#FF9741] p-1 text-[12px] xl:text-[16px] xl:p-2 text-[#FF9741] font-semibold rounded-[4px]'>Continue &gt;</button>
                                </div>
                            </div>
                            <div className='flex items-center justify-between px-5 py-2'>
                                <div className=''>
                                    <p className='font-medium text-[14px] 2xl:text-[16px] text-[#3F3F46]'>Renal Medicine +...</p>
                                    <p className='text-[12px] 2xl:text-[14px] font-semibold text-[#A1A1AA]'>1 day ago</p>
                                </div>
                                <div>
                                    <button className='border-[1px] border-[#FF9741] p-1 text-[12px] xl:text-[16px] 2xl:p-2 text-[#FF9741] font-semibold rounded-[4px]'>Continue &gt;</button>
                                </div>
                            </div>
                            <div className='flex items-center justify-between px-5 py-2'>
                                <div className=''>
                                    <p className='font-medium text-[14px] xl:text-[16px] text-[#3F3F46]'>Renal Medicine +...</p>
                                    <p className='text-[12px] xl:text-[14px] font-semibold text-[#A1A1AA]'>1 day ago</p>
                                </div>
                                <div>
                                    <button className='border-[1px] border-[#FF9741] p-1 text-[12px] 2xl:text-[16px] 2xl:p-2 text-[#FF9741] font-semibold rounded-[4px]'>Continue &gt;</button>
                                </div>
                            </div>
                            <div className='flex items-center justify-between p-5'>
                                <div className=''>
                                    <p className='font-medium text-[14px] xl:text-[16px] text-[#3F3F46]'>Renal Medicine +...</p>
                                    <p className='text-[12px] xl:text-[14px] font-semibold text-[#A1A1AA]'>1 day ago</p>
                                </div>
                                <div>
                                    <button className='border-[1px] border-[#FF9741] p-1 text-[12px] xl:text-[16px] 2xl:p-2 text-[#FF9741] font-semibold rounded-[4px]'>Continue &gt;</button>
                                </div>
                            </div>
                        </div>


                    </div>




                    <div className='flex flex-row-reverse justify-center gap-x-5 items-center w-full'>
                        <div className=" p-6 w-[665px] 2xl:w-[800px] h-[500px]  bg-white rounded-lg shadow-md">
<h2 className='font-bold text-[20px] text-center py-3'>Monthly Progress</h2>
                            <StackedBar days={days} />
                            
                            <div className='flex items-center justify-center gap-x-[75px] mt-5'>
                                <p className='text-[#52525B] font-medium' >Correct Questions</p>
                                <div className='w-[16px] h-[16px] rounded-[2px] bg-[#3CC8A1]' />
                            </div>
                            <div className='flex items-center justify-center gap-x-16'>
                                <p className='text-[#52525B] font-medium'>Incorrect Questions</p>
                                <div className='w-[16px] h-[16px] rounded-[2px] bg-[#FF9741]' />

                            </div>
                        </div>

                        <div className=' w-[261px] h-[500px] bg-white rounded-lg shadow-md'>
                            <div className='text-[18px] text-center text-[#52525B] p-5 font-semibold'>
                                <p className=' text-[#3F3F46] '>Questions</p>
                                <p className='text-[16px] flex items-center  justify-center'>Preclinify <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down text-[#FF9741]"><path d="m6 9 6 6 6-6" /></svg> </p>
                            </div>
                            <hr />
                            <div className='flex items-center flex-col justify-center'>

                        
                            <div className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px] '>
                                <div className='w-[20%]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
                                </div>
                                <div className='w-[80%]'>
                                    <p className='font-semibold text-[14px] text-[#3F3F46]'>Short Answer</p>

                                </div>

                            </div>

                            <div className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px] '>
                                <div className='w-[20%]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                                </div>
                                <div className='w-[80%]'>
                                    <p className='font-semibold text-[14px] text-[#3F3F46]'>Single Best <br /> Answer</p>

                                </div>
                            </div>


                            <div className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px] '>
                                <div className='w-[20%]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bone"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" /></svg>                               
                                </div>
                                <div className='w-[80%]'>
                                    <p className='font-semibold text-[14px] text-[#3F3F46]'>Mock Paper</p>

                                </div>
                            </div>

                            <div className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px] '>
                                <div className='w-[20%]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
                                </div>
                                <div className='w-[80%]'> 
                                    <p className='font-semibold text-[14px] text-[#3F3F46]'>Anatomy Quiz</p>

                                </div>
                            </div>


                            <div className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px]'>
                                <div className='w-[20%]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-no-axes-combined"><path d="M12 16v5" /><path d="M16 14v7" /><path d="M20 10v11" /><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" /><path d="M4 18v3" /><path d="M8 14v7" /></svg>
                                </div>
                                <div className='w-[80%]'>
                                    <p className='font-semibold text-[14px] text-[#3F3F46]'>Question <br />
                                        Generation</p>

                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;

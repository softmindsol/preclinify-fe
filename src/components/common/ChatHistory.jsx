import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { fetchOSCEBotData } from '../../redux/features/osce-bot/osce-bot.service';
import { useDispatch, useSelector } from 'react-redux';

const HistoryList = () => {
    const [openItemId, setOpenItemId] = useState(null);
    const oscebot=useSelector(state=>state.osceBot.data)
    const dispatch = useDispatch();

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
        return `${year}/${month}/${day}`;
    };
    const toggleItem = (id) => {
        setOpenItemId(openItemId === id ? null : id);
    };

    useEffect(() => {
        dispatch(fetchOSCEBotData()).unwrap() .then((res) => {

        }) .catch((err) => {});
    }, [])
    console.log("oscebot:", oscebot);

    return (

        <div className='lg:flex w-full'>
            <div className=" hidden lg:block fixed h-full">
                <Sidebar />
            </div>
            <div className=" mt-24 w-[1113px] mx-auto bg-white shadow-md rounded-lg ">
                <h2 className="text-[18px] font-medium mb-2 flex gap-x-2 items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg> <span>History</span>
                </h2>
                <hr />
                <div className="space-y-2">
                    {oscebot.map((item) => (
                        <div key={item.id} className="border-b last:border-none ">
                            <div className="flex items-center justify-between py-2 px-5">
                                <div className='flex items-center justify-between w-[30%]'>
                                    <h3 className="text-[16px] text-[#3F3F46] font-medium">{item.category}</h3>
                                    <p className="text-[16px] text-[#A1A1AA] font-bold">{formatDate(item.created_at) }</p>
                                </div>
                                <div className="flex items-center justify-between w-[30%] gap-x-2 space-x-2">
                                    <div className="relative w-40 h-[27px]  bg-[#E4E4E7] rounded-[3px]">
                                        <div
                                            className="absolute top-0 left-0 bg-[#3CC8A1] h-[27px] rounded-[3px]"
                                            style={{ width: `${item.score*10}% ` }}
                                        ></div>
                                    </div>
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => toggleItem(item.id)}
                                    >
                                        {openItemId === item.id ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>}
                                    </button>
                                </div>
                            </div>
                            {openItemId === item.id && (
                                <div className="bg-gray-50 p-4 rounded">
                                    <p className="text-sm text-gray-700">{item.transcript}</p>
                                    <p className='text-black text-[18px] font-semibold mt-10'>Feedback: <br /> <span className='font-normal text-[14px]'>{item.summary}</span></p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div></div>
    );
};

export default HistoryList;

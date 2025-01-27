import React, { useState } from 'react';
import Sidebar from './Sidebar';

const HistoryList = () => {
    const [openItemId, setOpenItemId] = useState(null);

    const historyItems = [
        { id: 1, title: 'Headache 2', time: '15:35', percentage: 80, details: 'Details about Headache 2' },
        { id: 2, title: 'Abdominal Pain', time: '09:12', percentage: 60, details: 'Details about Abdominal Pain' },
        { id: 3, title: 'Headache', time: '20/01', percentage: 70, details: 'Details about Headache' },
        { id: 4, title: 'Chest Pain', time: '19/01', percentage: 50, details: 'Details about Chest Pain' },
        { id: 5, title: 'Cough 2', time: '04/01', percentage: 75, details: 'Details about Cough 2' },
        { id: 6, title: 'Tiredness', time: '03/01', percentage: 40, details: 'Details about Tiredness' },
        { id: 7, title: 'Fever', time: '31/12/24', percentage: 90, details: 'Details about Fever' },
        { id: 8, title: 'Diarrhoea', time: '24/12/24', percentage: 65, details: 'Details about Diarrhoea' },
        { id: 9, title: 'Cough', time: '24/12/24', percentage: 60, details: 'Details about Cough' },
        { id: 10, title: 'Shoulder stiffness', time: '21/12/24', percentage: 55, details: 'Details about Shoulder stiffness' },
        { id: 11, title: 'Haemoptysis', time: '20/12/24', percentage: 80, details: 'Details about Haemoptysis' },
        { id: 12, title: 'Haematuria', time: '20/12/24', percentage: 45, details: 'Details about Haematuria' },
        { id: 13, title: 'Confusion', time: '16/12/24', percentage: 30, details: 'Details about Confusion' },
    ];

    const toggleItem = (id) => {
        setOpenItemId(openItemId === id ? null : id);
    };

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
                {historyItems.map((item) => (
                    <div key={item.id} className="border-b last:border-none ">
                        <div className="flex items-center justify-between py-2 px-5">
                            <div className='flex items-center justify-between w-[30%]'>
                                <h3 className="text-[16px] text-[#3F3F46] font-medium">{item.title}</h3>
                                <p className="text-[16px] text-[#A1A1AA] font-bold">{item.time}</p>
                            </div>
                            <div className="flex items-center justify-between w-[30%] gap-x-2 space-x-2">
                                <div className="relative w-40 h-[27px]  bg-[#E4E4E7] rounded-[3px]">
                                    <div
                                        className="absolute top-0 left-0 bg-[#3CC8A1] h-[27px] rounded-[3px]"
                                        style={{ width: `${item.percentage}%` }}
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
                                <p className="text-sm text-gray-700">{item.details}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            </div></div>
    );
};

export default HistoryList;

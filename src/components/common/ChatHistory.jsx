import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { fetchOSCEBotData } from "../../redux/features/osce-bot/osce-bot.service";
import { useDispatch, useSelector } from "react-redux";

const HistoryList = () => {
  const [openItemId, setOpenItemId] = useState(null);
  const oscebot = useSelector((state) => state.osceBot.data);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}/${month}/${day}`;
  };
  const toggleItem = (id) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchOSCEBotData({ user_id: userId }))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.error("Failed to fetch OSCE bot data:", err);
        });
    }
  }, [dispatch, userId]);

  

  return (
    <div className="w-full lg:flex">
      <div className="fixed hidden h-full lg:block">
        <Sidebar />
      </div>
      <div className="ml-[280px] mt-24 w-[1113px] rounded-lg bg-white shadow-md">
        <h2 className="mb-2 flex items-center gap-x-2 p-4 text-[18px] font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-history"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </svg>{" "}
          <span>History</span>
        </h2>
        <hr />
        <div className="space-y-2">
          {oscebot?.map((item, index) => (
            <div key={item.id} className="border-b last:border-none">
              <div className="flex items-center justify-between px-5 py-2">
                <div className="flex w-[30%] items-center justify-between">
                  <h3 className="text-[16px] font-medium text-[#3F3F46]">
                    {/* {item?.category} */}
                    {index+1}
                  </h3>
                  <p className="text-[16px] font-bold text-[#A1A1AA]">
                    {formatDate(item?.created_at)}
                  </p>
                </div>
                <div className="flex w-[30%] items-center justify-between gap-x-2 space-x-2">
                  <div className="relative h-[27px] w-40 rounded-[3px] bg-[#E4E4E7]">
                    <div
                      className="absolute left-0 top-0 h-[27px] rounded-[3px] bg-[#3CC8A1]"
                      style={{ width: `${item?.score * 10}% ` }}
                    ></div>
                  </div>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => toggleItem(item.id)}
                  >
                    {openItemId === item.id ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-up"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-down"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {openItemId === item.id && (
                <div className="rounded bg-gray-50 p-4">
                  <p className="text-sm text-gray-700">{item?.summary}</p>
                  <p className="mt-10 text-[18px] font-semibold text-black">
                    Feedback: <br />{" "}
                    <span className="text-[14px] font-normal">
                      {item?.feedback}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryList;

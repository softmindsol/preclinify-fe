import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { calculateDaysRemaining } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { insertExamDate } from "./../../redux/features/examDate/service";
const ExamCountdown = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirmedDate, setConfirmedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const daysRemaining = confirmedDate
    ? calculateDaysRemaining(confirmedDate)
    : null;

  const handleConfirmDate = async () => {
    if (!selectedDate) return;
    const formattedDate = selectedDate.toISOString().split("T")[0];

    dispatch(insertExamDate({ userId, exam_date: formattedDate }));
    setConfirmedDate(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className="mb-6 bg-white p-4 text-black shadow-md dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white lg:rounded-md">
      <h2 className="mb-4 text-[14px] font-semibold text-[#000000] dark:text-white sm:text-[16px]">
        General
      </h2>
      <div className="mb-4 flex max-w-96 items-center justify-between">
        <div>
          <p className="flex items-center gap-x-2 text-[12px] font-medium text-[#3F3F46] dark:text-white sm:text-[14px]">
            <FaClock /> Exam Date Countdown
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer text-[#3F3F46] dark:text-white"
          >
            <FaCalendarAlt size={20} />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-12 z-50 rounded-md bg-white p-2 shadow-md dark:bg-[#1E1E2A]">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                minDate={new Date()}
              />
              <button
                onClick={handleConfirmDate}
                className="mt-2 w-full rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
              >
                Select Date
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-[12px] text-[#71717A] dark:text-white sm:text-[14px]">
        Tracks the time remaining until your exam day.
      </p>

      {confirmedDate && (
        <p className="mt-2 text-[14px] font-semibold text-[#3F3F46] dark:text-white">
          {daysRemaining > 0
            ? `📅 ${daysRemaining} days remaining until your exam.`
            : "🎉 Exam day is today!"}
        </p>
      )}
    </div>
  );
};

export default ExamCountdown;

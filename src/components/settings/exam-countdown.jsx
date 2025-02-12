import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';
import { calculateDaysRemaining } from '../../lib/utils';
import { useDispatch } from 'react-redux';
import { insertExamDate } from '../../redux/features/exam-countdown/service';

const ExamCountdown = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirmedDate, setConfirmedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const daysRemaining = confirmedDate ? calculateDaysRemaining(confirmedDate) : null;

  const handleConfirmDate = async () => {
    if (!selectedDate) return;

    const formattedDate = selectedDate.toISOString().split('T')[0];

    await dispatch(
      insertExamDate({
        exam_date: formattedDate,
        user_id: 'acb01928-efce-4f32-96df-ff179494f580',
      })
    );

    setConfirmedDate(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className='bg-white shadow-md lg:rounded-md mb-6 p-4 dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] text-black dark:text-white'>
      <h2 className='text-[14px] sm:text-[16px] font-semibold mb-4 text-[#000000] dark:text-white'>
        General
      </h2>
      <div className='flex items-center justify-between mb-4 max-w-96'>
        <div>
          <p className='font-medium text-[#3F3F46] text-[12px] sm:text-[14px] flex items-center gap-x-2 dark:text-white'>
            <FaClock /> Exam Date Countdown
          </p>
        </div>

        <div className='relative'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-[#3F3F46] dark:text-white cursor-pointer'
          >
            <FaCalendarAlt size={20} />
          </button>

          {isOpen && (
            <div className='absolute top-12 left-0 bg-white shadow-md rounded-md p-2 dark:bg-[#1E1E2A] z-50'>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                inline
                minDate={new Date()}
              />
              <button
                onClick={handleConfirmDate}
                className='bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 w-full mt-2'
              >
                Select Date
              </button>
            </div>
          )}
        </div>
      </div>

      <p className='text-[12px] sm:text-[14px] text-[#71717A] dark:text-white'>
        Tracks the time remaining until your exam day.
      </p>

      {confirmedDate && (
        <p className='mt-2 text-[14px] font-semibold text-[#3F3F46] dark:text-white'>
          {daysRemaining > 0
            ? `📅 ${daysRemaining} days remaining until your exam.`
            : '🎉 Exam day is today!'}
        </p>
      )}
    </div>
  );
};

export default ExamCountdown;

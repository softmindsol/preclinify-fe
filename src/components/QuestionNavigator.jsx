import { useState, useMemo, useEffect } from 'react';

const QuestionNavigator = ({
  currentIndex,
  attempted,
  flaggedQuestions,
  visited,
  setCurrentIndex,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [pagination, setPagination] = useState({
    All: visited.length > 0 ? 1 : 0,
    Flagged: 0,
    Unseen: 0,
  });
  const [isManualNavigation, setIsManualNavigation] = useState(false);

  const pageSize = 10;

  const filteredQuestions = useMemo(() => {
    const validNumbers = obj =>
      Object.keys(obj)
        .map(key => {
          const num = Number(key);
          return !isNaN(num) && num !== null && num !== undefined ? num : null;
        })
        .filter(num => num !== null);

    switch (selectedFilter) {
      case 'Flagged':
        return validNumbers(flaggedQuestions).filter(
          key => flaggedQuestions[key] === true
        );
      case 'Unseen':
        return validNumbers(visited).filter(key => visited[key] === true);
      case 'All':
      default:
        return Array.from(
          new Set([
            ...validNumbers(attempted).filter(key => attempted[key] === true),
            ...validNumbers(flaggedQuestions).filter(
              key => flaggedQuestions[key] === true
            ),
            ...validNumbers(visited).filter(
              key => visited[key] === true || attempted[key] === false
            ),
          ])
        ).sort((a, b) => a - b);
    }
  }, [selectedFilter, attempted, flaggedQuestions, visited]);

  useEffect(() => {
    if (filteredQuestions.length > 0 && !isManualNavigation) {
      const indexInFilteredList = filteredQuestions.indexOf(currentIndex - 1);
      if (indexInFilteredList !== -1) {
        const currentPage = Math.floor(indexInFilteredList / pageSize);

        const start = pagination[selectedFilter] * pageSize;
        const end = start + pageSize;
        if (indexInFilteredList < start || indexInFilteredList >= end) {
          setPagination(prev => ({
            ...prev,
            [selectedFilter]: currentPage,
          }));
        }
      }
    }
  }, [currentIndex, filteredQuestions, selectedFilter, pagination, isManualNavigation]);

  // Paginated questions based on selected filter
  const paginatedQuestions = useMemo(() => {
    const start = pagination[selectedFilter] * pageSize;
    const end = start + pageSize;
    return filteredQuestions.slice(start, end);
  }, [pagination, selectedFilter, filteredQuestions]);

  // Function to change filter and reset pagination for the new filter
  const handleFilterChange = filter => {
    setSelectedFilter(filter);
    setPagination(prev => ({
      ...prev,
      [filter]: 0,
    }));
    setIsManualNavigation(false); // Reset manual navigation state
  };

  // Pagination handlers
  const handleNextPage = () => {
    setIsManualNavigation(true); // Set manual navigation state
    setPagination(prev => ({
      ...prev,
      [selectedFilter]: prev[selectedFilter] + 1,
    }));
  };

  const handlePrevPage = () => {
    setIsManualNavigation(true); // Set manual navigation state
    setPagination(prev => ({
      ...prev,
      [selectedFilter]: Math.max(0, prev[selectedFilter] - 1),
    }));
  };

  // Reset manual navigation state when currentIndex changes
  useEffect(() => {
    setIsManualNavigation(false);
  }, [currentIndex]);

  return (
    <div>
      {/* Filter Tabs */}
      <div className='flex items-center justify-between p-5 w-full text-[12px] dark:text-white'>
        {['All', 'Flagged', 'Unseen'].map(filter => (
          <span
            key={filter}
            className={`w-[30%] text-center cursor-pointer ${
              selectedFilter === filter
                ? 'text-[#3CC8A1] border-b-[1px] border-[#3CC8A1]'
                : 'hover:text-[#3CC8A1]'
            }`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </span>
        ))}
      </div>

      {/* Question Grid */}
      <div className='flex justify-center items-center'>
        <div className='grid grid-cols-5 gap-2'>
          {paginatedQuestions.map(num => {
            const isFlagged = flaggedQuestions[num] === true;
            const isAttempted = attempted[num];

            const bgColor = isAttempted
              ? 'bg-[#3CC8A1]'
              : isAttempted === false
              ? 'bg-[#FF453A]'
              : 'bg-gray-300';

            return (
              <div key={num}>
                {isFlagged ? (
                  <div
                    className={`${bgColor} flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px] cursor-pointer`}
                    onClick={() => setCurrentIndex(num)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='white'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-flag cursor-pointer hover:opacity-80'
                    >
                      <path d='M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z' />
                      <line x1='4' x2='4' y1='22' y2='15' />
                    </svg>
                  </div>
                ) : (
                  <div
                    className={`${bgColor} flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px] cursor-pointer`}
                    onClick={() => setCurrentIndex(num)}
                  >
                    <p>{num + 1}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Buttons */}
      <div className='flex justify-around gap-3 mt-4'>
        <button
          className='px-3 py-1 text-gray-500 rounded disabled:opacity-50'
          onClick={handlePrevPage}
          disabled={pagination[selectedFilter] === 0}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='lucide lucide-move-left'
          >
            <path d='M6 8L2 12L6 16' />
            <path d='M2 12H22' />
          </svg>
        </button>
        <button
          className='px-3 py-1 text-gray-500 rounded disabled:opacity-50'
          onClick={handleNextPage}
          disabled={
            (pagination[selectedFilter] + 1) * pageSize >= filteredQuestions.length
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='lucide lucide-move-right'
          >
            <path d='M18 8L22 12L18 16' />
            <path d='M2 12H22' />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuestionNavigator;

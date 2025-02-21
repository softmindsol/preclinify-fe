import React, { useEffect, useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import DeepChatAI from '../DeepChat';

const Chatbot = ({setIsAIExpanded}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleChatbot = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setIsAIExpanded(isExpanded);
  }
  , [isExpanded, setIsAIExpanded]);
  return (
    <div
      className={`fixed bottom-0 right-10 md:right-[280px] w-[300px] shadow-xl rounded-t-2xl overflow-hidden bg-white transition-all duration-300 ease-in-out ${
        isExpanded ? 'h-[500px]' : 'h-[60px]'
      }`}
    >
      <button
        onClick={toggleChatbot}
        className='absolute top-2 right-2 p-2 bg-[#3CC8A1] hover:bg-[#3CC8A5] text-white rounded-full shadow-md transition-transform duration-300'
      >
        {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
      </button>

      <div className='p-4 w-full'>
        {isExpanded ? (
          <div className='w-full space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800'>Chatbot</h3>
            <p className='text-gray-600'>Welcome! How can I help you today?</p>
            <div className='border border-gray-300 rounded-lg p-2'>
              <DeepChatAI W='250px' />
            </div>
          </div>
        ) : (
          <p className='text-lg font-semibold text-gray-800'>Open for AI Chat</p>
        )}
      </div>
    </div>
  );
};

export default Chatbot;

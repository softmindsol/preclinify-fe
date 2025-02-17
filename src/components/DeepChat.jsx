import { DeepChat } from 'deep-chat-react';
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const DeepChatAI = props => {
  const [width, setWidth] = useState(window.innerWidth);
  const darkModeRedux = useSelector(state => state.darkMode.isDarkMode);

  // Function to update width on screen resize
  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const dynamicStyle = useMemo(
    () => ({
      border: 'none',
      width: Math.min(width <= 1024 ? props.W : 240, width - 20),
    }),
    [width, props.W]
  );

  const deepChatComponent = useMemo(
    () => (
      <DeepChat
        style={{
          ...dynamicStyle,
          backgroundColor: darkModeRedux ? '#1E1E2A' : 'white',
        }}
        directConnection={{ openAI: { key: process.env.REACT_APP_OPENAI_API } }}
      />
    ),
    [dynamicStyle, darkModeRedux]
  );

  return (
    <div className={`${darkModeRedux ? 'dark' : ''}`}>
      <div className='dark:dark:bg-[#1E1E2A] text-black'>{deepChatComponent}</div>
    </div>
  );
};

export default DeepChatAI;

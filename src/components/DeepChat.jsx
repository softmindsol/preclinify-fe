import { DeepChat } from 'deep-chat-react';
import React, { useMemo, useState, useEffect } from 'react';

const DeepChatAI = (props) => {
    const [width, setWidth] = useState(window.innerWidth);


    // Function to update width on screen resize
    const handleResize = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Determine style based on screen width
    const dynamicStyle = useMemo(() => ({
        border: 'none',

        width: width <= 1024 ? props.W : '240px', // Adjust width based on screen size
    }), [width]);


    const deepChatComponent = useMemo(() => (
        <DeepChat
            style={dynamicStyle}
            directConnection={{ openAI: { key: process.env.REACT_APP_OPENAI_API } }}
        />
    ), [dynamicStyle]);


    return (
        <div className=''>
            {deepChatComponent}
        </div>
    );
};

export default DeepChatAI;

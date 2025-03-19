import React, { useState, useEffect, useRef } from "react";

const BouncingBall = ({ isRecording, transcript, isAISpeaking, isLoader }) => {
  const [greeting, setGreeting] = useState("");
  const [lastText, setLastText] = useState("");
  const hasShownGreeting = useRef(false); // Track if greeting has been shown

  useEffect(() => {
    setLastText(
      transcript.length > 0 ? transcript[transcript.length - 1].text : "",
    );
  }, [transcript]);

  useEffect(() => {
    if (!hasShownGreeting.current) {
      const currentHour = new Date().getHours();
      const morningGreetings = [
        "Good Morning! ☀️",
        "Rise and shine! 🌞",
        "Hope you have a fresh start! 🍃",
        "Wishing you a productive day! 🚀",
      ];
      const afternoonGreetings = [
        "Good Afternoon! ☀️",
        "Hope your day is going well! 😊",
      
       
      ];
      const eveningGreetings = [
        "Good Evening! 🌙",
        "Relax and unwind! 😌",
        "Hope you had a great day! 🌆",
        "Enjoy your evening with peace! 🍵",
      ];

      let greetingsList = morningGreetings;
      if (currentHour >= 12 && currentHour < 17) {
        greetingsList = afternoonGreetings;
      } else if (currentHour >= 17) {
        greetingsList = eveningGreetings;
      }

      const randomGreeting =
        greetingsList[Math.floor(Math.random() * greetingsList.length)];
      setGreeting(randomGreeting);
      hasShownGreeting.current = true; // Mark greeting as shown
    }
  }, []);

  return (
    <div className="ml-4 flex h-[100%] flex-col items-center justify-center">
      {greeting && !isLoader && !isRecording && (
        <h1 className="mb-4 text-xl font-light text-gray-500">{greeting}</h1>
      )}

      {isLoader && (
        <h1 className="mb-2 text-lg font-medium text-[#34D399]">
          {"Connecting..."}
        </h1>
      )}

      {!isAISpeaking && !isLoader && isRecording && (
        <h2 className="mb-2 text-lg font-medium text-[#34D399]">Your turn</h2>
      )}
      <div
        className={`${isAISpeaking && "custom-heartbeat"} h-[200px] w-[200px] rounded-full bg-gradient-to-r from-[#28C3A6] to-[#34D399]`}
      ></div>
      <span className="mt-2 w-[50%] text-[12px] font-light">{lastText}</span>
    </div>
  );
};

export default BouncingBall;

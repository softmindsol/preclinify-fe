import React, { useState, useEffect } from "react";

const BouncingBall = ({ isRecording }) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Get current hour
    const currentHour = new Date().getHours();

    // Different greetings based on time
    const morningGreetings = [
      "Good Morning! ☀️",
      "Rise and shine! 🌞",
      "Hope you have a fresh start! 🍃",
      "Wishing you a productive day! 🚀",
    ];
    const afternoonGreetings = [
      "Good Afternoon! ☀️",
      "Hope your day is going well! 😊",
      "Keep pushing forward! 💪",
      "Take a break, you deserve it! ☕",
    ];
    const eveningGreetings = [
      "Good Evening! 🌙",
      "Relax and unwind! 😌",
      "Hope you had a great day! 🌆",
      "Enjoy your evening with peace! 🍵",
    ];

    // Select greetings based on time
    let greetingsList = morningGreetings;
    if (currentHour >= 12 && currentHour < 17) {
      greetingsList = afternoonGreetings;
    } else if (currentHour >= 17) {
      greetingsList = eveningGreetings;
    }

    // Pick a random greeting once
    const randomGreeting =
      greetingsList[Math.floor(Math.random() * greetingsList.length)];
    setGreeting(randomGreeting);
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div className="ml-4 flex h-[100%] flex-col items-center justify-center">
      {/* Random Greeting Text (Only Set Once) */}
      <h1 className="mb-4 text-xl font-light text-gray-500">{greeting}</h1>

      {/* Bouncing Ball (Heart Beat Effect) */}
      <div
        className={`${!isRecording && "custom-heartbeat"} h-[200px] w-[200px] rounded-full bg-gradient-to-r from-[#28C3A6] to-[#34D399]`}
      ></div>
    </div>
  );
};

export default BouncingBall;

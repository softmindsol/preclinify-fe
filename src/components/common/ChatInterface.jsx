import React from "react";

const ChatInterface = () => {
  return (
    <div className="flex h-screen flex-col bg-gray-100 p-4">
      {/* Chat Header */}
      <div className="rounded-t-lg bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold">Chat</h1>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        <div className="flex justify-end">
          <div className="max-w-[70%] rounded-lg bg-blue-500 p-3 text-white">
            Hello! How can I help you?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[70%] rounded-lg bg-gray-200 p-3">
            Hi! I need some assistance.
          </div>
        </div>
      </div>

      {/* Typing Area with Bouncing Ball */}
      <div className="rounded-b-lg bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-bounce rounded-full bg-[#28C3A6]"></div>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-[#28C3A6]"
          />
          <button className="rounded-lg bg-[#28C3A6] p-2 text-white transition-colors hover:bg-[#1f9c7f]">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

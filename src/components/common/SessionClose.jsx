import React, { useState } from "react";

const Popup = ({ setSessionClose, sessionClose, stopRecording }) => {
  const handleConfirm = () => {
    stopRecording();
        setSessionClose(false);

  };

  const handleCancel = () => {
    // Cancel button ka logic yahan dalen
    console.log("Cancelled");
    setSessionClose(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Want to end the session?</h2>
        <p className="mb-4">No worries, you can continue anytime.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="rounded border border-[#FF453A] bg-transparent px-4 py-2 text-[#FF453A] transition-all duration-200 hover:bg-[#FF453A] hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="rounded bg-[#3CC8A1] px-4 py-2 text-white hover:bg-[#39be98]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

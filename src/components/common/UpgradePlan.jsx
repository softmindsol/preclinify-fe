import React from "react";

const UpgradePlanModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Upgrade Your Plan</h2>
        <p className="mb-4">
          Your token limit has been exceeded. Please upgrade your plan to
          continue.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Redirect to pricing page or handle upgrade logic
              window.location.href = "/pricing";
            }}
            className="rounded bg-[#3CC8A1] px-4 py-2 text-white"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlanModal;

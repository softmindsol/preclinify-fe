import React, { useState } from "react";
import { useSelector } from "react-redux";
const ManageModal = ({
  managePackageModal,
  setManagePackageModal,
  handleManageSubscription,
}) => {
  const openModal = () => setManagePackageModal(true);
  const closeModal = () => setManagePackageModal(!managePackageModal);
  const subscription = useSelector(
    (state) => state?.subscription?.subscriptions,
  );

 const handleManage = () => {
   const customerId = subscription[0]?.customer;
   if (!customerId) {
     console.error("Customer ID not found!");
     return;
   }
   handleManageSubscription(customerId);
   closeModal();
 };

  return (
    <div className="flex h-64 items-center justify-center bg-gray-100">
   
      {managePackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          ></div>
          {/* Modal content */}
          <div className="z-50 mx-4 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Manage Subscription
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                You can manage your subscription from here. Click the Manage
                button to update settings or the OK button to close the modal.
              </p>
            </div>
            {/* Modal footer with buttons */}
            <div className="flex justify-end space-x-3 bg-gray-50 px-6 py-3">
              <button
                onClick={closeModal}
                className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none"
              >
                OK
              </button>
              <button
                onClick={handleManage}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageModal;

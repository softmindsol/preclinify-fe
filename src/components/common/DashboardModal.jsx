import React from 'react'

const DashboardModal = ({ setShowPopup, handleBackToDashboard }) => {
  return (
    <div>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center dark:bg-black text-black  dark:border">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 dark:text-white">
                      Are you sure you want to go back to the dashboard?
                  </h2>
                  <div className="flex justify-center gap-4">
                      <button
                          className="px-4 py-2 bg-[#3CC8A1] hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300"
                          onClick={handleBackToDashboard}
                      >
                          Yes
                      </button>
                      <button
                          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-all duration-300"
                          onClick={() => setShowPopup(false)}
                      >
                          No
                      </button>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default DashboardModal
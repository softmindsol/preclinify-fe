const ConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold">Confirmation</h2>
                <p>Are you sure you want to end this conversation?</p>
                <div className="mt-4 flex justify-center gap-5">
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className="bg-gray-300 py-2 px-4 rounded"
                        onClick={onCancel}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal
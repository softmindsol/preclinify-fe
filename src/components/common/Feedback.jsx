import axios from "axios";
import { useState } from "react";
import { toast } from 'sonner';

const FeedbackModal = ({ showFeedBackModal ,setShowFeedBackModal  }) => {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const handleFeedBack = async () => {
        if (!feedback) {
            // Optional: Add validation to ensure feedback is provided
            toast.error("Please provide feedback before submitting.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/submit-feedback`, {
                feedback,
            });

            if (response.status === 200) {
                toast.success("Feedback submitted successfully!");
                setShowFeedBackModal(false);
            }
        }
        catch (error) {
            toast.error("Failed to submit feedback.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white  w-[800px] p-6 rounded-lg shadow-lg ">
                <h2 className="text-xl font-semibold mb-4">Give Your Feedback</h2>
                <textarea
                    className=" w-[750px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3CC8A1] placeholder:text-start"
                    rows="4"
                    placeholder="Write your feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    style={{ textAlign: 'start' }}
                />
                <div className="flex items-center justify-center mt-4 space-x-2">
                    <button
                        className="px-4 py-2 bg-[#FF453A] text-white rounded-md hover:bg-[#ae615e]"
                        onClick={() => setShowFeedBackModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        className="px-4 py-2 bg-[#3CC8A1] text-white rounded-md hover:bg-[#2c9d7d]"
                        onClick={handleFeedBack}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;

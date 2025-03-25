import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { insertQuesGenData } from '../redux/features/question-gen/question-gen.service';
import { useDispatch } from 'react-redux';

const FileUpload = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null); // Reference for file input
    const dispatch = useDispatch();

    // Handle file selection
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            await handleSubmit(selectedFile); // Automatically submit after file selection
            e.target.value = null; // Clear the input value to allow re-uploading the same file
        }
    };

    // Handle file upload and API call
    const handleSubmit = async (fileToUpload) => {
        if (!fileToUpload) {
            toast.error("Please upload a file!");
            return;
        }  

        const formData = new FormData();
        formData.append("file", fileToUpload);

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setData(response.data.generatedQuestions); // Set the generated questions
            toast.success("Question generated successfully!");
        } catch (error) {
           
            toast.error(
              "Something went wrong. Please try uploading the file again.",
            );

        } finally {
            setLoading(false);
        }
    };

    // Trigger file input programmatically
    const triggerFileInput = () => {
        fileInputRef.current?.click(); // Safely trigger file input
    };

    // Save data to Redux store when `data` changes
    useEffect(() => {
        if (data) {
            dispatch(insertQuesGenData(data))
                .then(() => {
                    toast.success("Question successfully stored in the database!");
                })
                .catch((error) => {
                    console.error("Error storing question in database:", error);
                    toast.error("Error storing question in database");
                });
        }
    }, [data, dispatch]);

    return (
        <div>
            <form>
                <div className="bg-[#FFFFFF] m-4 rounded-[8px]">
                    <p className="text-[#3F3F46] text-[20px] font-semibold px-[50px] py-8">
                        How this works
                    </p>
                    <div className="flex items-center justify-center pb-10">
                        <img src="/assets/quesGen.png" alt="Question Generation Illustration" />
                    </div>
                </div>
                <div className="bg-[#FFFFFF] m-4 rounded-[8px] h-[210px] flex justify-center items-center flex-col">
                    <p className="text-[16px] text-[#3F3F46] font-medium">
                        Drag and drop files here.
                    </p>
                    <p className="text-[16px] text-[#71717A] font-medium">
                        Upload anything from PDFs, to Powerpoints, to Word Docs!
                    </p>
                    <button
                        className={`font-bold mt-3 text-[#FF9741] hover:bg-[#FF9741] ${loading ? 'bg-[#FF9741] cursor-not-allowed' : 'bg-[#FFE9D6]'
                            } px-1.5 text-center w-[143px] h-[44px] rounded-[10px] flex items-center gap-x-3 hover:text-white transition-all duration-200`}
                        type="button"
                        onClick={triggerFileInput} // Trigger file input on button click
                        disabled={loading} // Disable button during loading
                    >
                        {loading ? (
                            <div className="flex items-center justify-center w-full">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    ></path>
                                </svg>
                            </div>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-upload"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" x2="12" y1="3" y2="15" />
                                </svg>
                                File Upload
                            </>
                        )}
                    </button>
                    <input
                        type="file"
                        id="fileInput"
                        accept=".docx,.pptx,.pdf"
                        style={{ display: 'none' }} // Keep input hidden
                        ref={fileInputRef} // Bind input to ref
                        onChange={handleFileChange} // Handle file selection
                    />
                </div>
            </form>
        </div>
    );
};

export default FileUpload;

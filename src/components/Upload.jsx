import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { fetchQuesGenModules, insertQuesGenData } from "../redux/features/question-gen/question-gen.service";
import { useDispatch } from "react-redux";

const FileUpload = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // Reference for file input
  const dispatch = useDispatch();
  const userId=localStorage.getItem('userId')
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
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setData(response.data.generatedQuestions); // Set the generated questions
      toast.success("Question generated successfully!");
    } catch (error) {
      toast.error("Something went wrong. Please try uploading the file again.");
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
           dispatch(fetchQuesGenModules(userId))
                 .unwrap()
                 .then(() => {
                  
                 })
                 .catch((err) => {
                  
                 });
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
        <div className="m-4 rounded-[8px] bg-[#FFFFFF]">
          <p className="px-[50px] py-8 text-[20px] font-semibold text-[#3F3F46]">
            How this works
          </p>
          <div className="flex items-center justify-center pb-10">
            <img
              src="/assets/quesGen.png"
              alt="Question Generation Illustration"
            />
          </div>
        </div>
        <div className="m-4 flex h-[210px] flex-col items-center justify-center rounded-[8px] bg-[#FFFFFF]">
          <p className="text-[16px] font-medium text-[#3F3F46]">
            Drag and drop files here.
          </p>
          <p className="text-[16px] font-medium text-[#71717A]">
            Upload anything from PDFs, to Powerpoints, to Word Docs!
          </p>
          <button
            className={`mt-3 font-bold text-[#FF9741] hover:bg-[#FF9741] ${
              loading ? "cursor-not-allowed bg-[#FF9741]" : "bg-[#FFE9D6]"
            } flex h-[44px] w-[143px] items-center gap-x-3 rounded-[10px] px-1.5 text-center transition-all duration-200 hover:text-white`}
            type="button"
            onClick={triggerFileInput} // Trigger file input on button click
            disabled={loading} // Disable button during loading
          >
            {loading ? (
              <div className="flex w-full items-center justify-center">
                <svg
                  className="h-5 w-5 animate-spin text-white"
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
            style={{ display: "none" }} // Keep input hidden
            ref={fileInputRef} // Bind input to ref
            onChange={handleFileChange} // Handle file selection
          />
        </div>
      </form>
    </div>
  );
};

export default FileUpload;

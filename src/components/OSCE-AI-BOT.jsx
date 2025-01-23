import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";

const OSCEAIBOT = () => {
    const recognitionRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState([]);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onresult = async (event) => {
                const transcriptText = event.results[event.results.length - 1][0].transcript;
                setTranscript((prevTranscript) => [
                    ...prevTranscript,
                    { fromAI: false, text: transcriptText },
                ]);

                // Fetch AI response
                const aiResponse = await fetchAIResponse(transcriptText);
                playAIResponse(aiResponse); // Text-to-Speech
                setTranscript((prevTranscript) => [
                    ...prevTranscript,
                    { fromAI: true, text: aiResponse },
                ]);
            };
        } else {
            console.error("SpeechRecognition API is not supported in this browser.");
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    const fetchAIResponse = async (userText) => {
        const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_OSCE_KEY;
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: userText }],
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    };

    const playAIResponse = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const handleStartRecording = () => {
        setIsRecording((prev) => !prev);
        if (!isRecording && recognitionRef.current) {
            recognitionRef.current.start();
        } else if (isRecording && recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="w-full flex items-center justify-center">
                <header className="w-[70%] bg-white shadow-md py-4 px-8 flex justify-between items-center">
                    <Logo />
                    <nav className="flex items-center space-x-4 text-[#3CC8A1] font-medium">
                        <a href="#" className="hover:underline">MCQ</a>
                        <a href="#" className="hover:underline">SAQ</a>
                        <a href="#" className="hover:underline">OSCE</a>
                        <div className="bg-[#3CC8A1] text-white rounded-full h-8 w-8 flex items-center justify-center">N</div>
                    </nav>
                </header>
            </div>

            {/* Main */}
            <main className="w-[100%] mt-8 px-4">
                <div className="bg-[#EDF2F7] w-[30%] p-6 rounded-lg shadow-md mb-4">
                    <p className="text-[#26303d] text-[16px]">
                        Hello! Welcome to the OSCE history station! I will be the patient and you will be the doctor...
                    </p>
                </div>
                <div className="transcript mb-4">
                    {transcript.map((entry, index) => (
                        <div key={index} className={`message ${entry.fromAI ? "ai-message" : "user-message"}`}>
                            <strong>{entry.fromAI ? "AI: " : "You: "}</strong>
                            <span className="w-[]">{entry.text}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <button
                        className="bg-[#3CC8A1] w-[100%] text-white py-2 px-6 rounded-[8px] text-[16px] font-bold hover:bg-transparent hover:border hover:border -[#3CC8A1] hover:text-[#3CC8A1] transition-all duration-200"
                        onClick={handleStartRecording}
                    >
                        {isRecording ? "Stop Recording" : "Start Recording"}
                    </button>
                </div>
            </main>

            <style jsx>{`
                .transcript {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .message {
                    display: flex;
                    align-items: center;
                }
                .ai-message {
                    justify-content: flex-start;
                    background-color: #f0f0f0;
                    padding: 10px;
                    border-radius: 5px;
                }
                .user-message {
                    justify-content: flex-end;
                    background-color: #3CC8A1;
                    color: white;
                    padding: 10px;
                    width:300px
                    border-radius: 5px;
                }
            `}</style>
        </div>
    );
};

export default OSCEAIBOT;
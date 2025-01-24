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
            // Cleanup: Stop Speech Recognition and Cancel Speech
            if (recognitionRef.current) recognitionRef.current.stop();
            window.speechSynthesis.cancel(); // Stop all AI speech
        };
    }, []);

    const fetchAIResponse = async (userText) => {
        const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_OSCE_KEY;
        try {
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
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return "Sorry, I couldn't process your request.";
        }
    };

    const playAIResponse = (text) => {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Set speech properties
        utterance.pitch = 1.2; // Adjust for brighter tone
        utterance.rate = 1;    // Normal rate
        utterance.volume = 1;  // Max volume

        // Select a specific voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find((voice) => voice.name.includes("Google US English"));
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

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
            <div className="w-full fixed top-0 flex items-center justify-center">
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
            <main className="w-[100%] mt-20 px-4">
                <div className="bg-[#EDF2F7] w-[30%] p-6 rounded-lg shadow-md mb-4">
                    <p className="text-[#26303d] text-[16px]">
                        Hello! Welcome to the OSCE history station! I will be the patient and you will be the doctor...
                    </p>
                </div>
                <div className="transcript">
                    {transcript.map((entry, index) => (
                        <div key={index} className={`message ${entry.fromAI ? "ai-message" : "user-message"}`}>
                            <div className={`${entry.fromAI ? "bg-[#3CC8A1]" : "bg-[#EDF2F7]"} py-5 px-14 border-[1px] rounded-full`}>
                                <strong>{entry.fromAI ? "AI: " : "You: "}</strong>
                                <span>{entry.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                    <button
                        className="bg-[#3CC8A1] w-[100%] text-white py-2 px-6 rounded-[8px] text-[16px] font-bold hover:bg-transparent hover:border hover:border-[#3CC8A1] hover:text-[#3CC8A1] transition-all duration-200"
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
                    gap: 16px;
                    margin-top: 16px;
                }
                .message {
                    display: flex;
                    align-items: center;
                }
                .ai-message {
                    justify-content: flex-start;
                    padding: 20px;
                    border-radius: 5px;
                    color: white;
                    width: 80%;
                }
                .user-message {
                    justify-content: flex-end;
                    color: black;
                    padding: 10px;
                    display: flex;
                    border-radius: 5px;
                }
            `}</style>
        </div>
    );
};

export default OSCEAIBOT;

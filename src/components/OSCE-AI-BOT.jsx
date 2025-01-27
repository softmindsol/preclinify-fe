import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";
import { useNavigate } from "react-router-dom";
import supabase from "../helper";

const OSCEAIBOT = () => {
    const recognitionRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const timeoutRef = useRef(null); // To store the timeout reference
    const navigate = useNavigate(); // Initialize navigate
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
            window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        // Initialize AI greeting and follow-up
        const initializeAI = async () => {
            const initialPrompt =
                "Hello! Welcome to the OSCE history station! I will be the patient and you will be the doctor. How can I assist you?";
            playAIResponse(initialPrompt); // Text-to-Speech
            setTranscript([{ fromAI: true, text: initialPrompt }]);
        };

        initializeAI();
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
        // Check if the speech synthesis is speaking
        if (window.speechSynthesis.speaking) {
            console.warn("Speech synthesis is already speaking. Skipping new utterance.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.2;
        utterance.rate = 1;
        utterance.volume = 1;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find((voice) => voice.name.includes("Google US English"));
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // When speech ends, reset the button text
        utterance.onend = () => {
            resetToStartRecording();
        };

        // Speak the text
        window.speechSynthesis.speak(utterance);

        // Set timeout to reset button in case of inactivity
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            resetToStartRecording();
        }, 20000); // 20 seconds
    };

    const insertTranscriptToSupabase = async (transcriptArray) => {
        // Combine the transcript into one string
        const formattedTranscript = transcriptArray
            .map(entry => `${entry.fromAI ? 'AI' : 'You'}: ${entry.text}`)
            .join(' '); // Join all messages together with space (you can adjust the separator as needed)

        const { data, error } = await supabase
            .from("AI_OSCE") // Table name
            .insert([
                {
                    transcript: formattedTranscript, // Insert the entire transcript as a single string
                    created_at: new Date(), // Add timestamp for the entry
                  
                }
            ]);

        if (error) {
            console.error("Error inserting transcript:", error.message);
        } else {
            console.log("Transcript inserted successfully:", data);
            // Redirect to chat-history table after successful insert
            navigate("/chat-history");
        }
    };

    const resetToStartRecording = () => {
        setIsRecording(false);
        if (recognitionRef.current) recognitionRef.current.stop();
    };

    const handleStartRecording = () => {
        setIsRecording((prev) => !prev);

        if (!isRecording && recognitionRef.current) {
            recognitionRef.current.start();
        } else if (isRecording && recognitionRef.current) {
            recognitionRef.current.stop();
            insertTranscriptToSupabase(transcript); // Passing the entire transcript
           

        }

        // Clear timeout if user interacts with the button
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    useEffect(() => {
        // Ensure voices are loaded
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
    }, []);
    console.log(window.speechSynthesis.getVoices());


    return (
        <div>
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

            <main className="w-[100%] mt-20 px-4">
                <div className="transcript">
                    {transcript.map((entry, index) => (
                        <div key={index} className={`message ${entry.fromAI ? "ai-message" : "user-message"}`}>
                            <div className={`${entry.fromAI ? "bg-[#3CC8A1]" : "bg-[#EDF2F7]"} py-3 px-14 border-[1px] rounded-full`}>
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
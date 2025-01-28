import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";
import { useNavigate } from "react-router-dom";
import supabase from "../helper";
import ConfirmationModal from "./common/Confirmation-OSCE";

const OSCEAIBOT = () => {
    const recognitionRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [voices, setVoices] = useState([]);
    const [summary, setSummary] = useState(""); // State for summary

    // Define categories and their associated keywords
    const categories = {
        "Acute and Emergency": ["emergency", "acute", "urgent"],
        "Cancer": ["cancer", "tumor", "malignancy"],
        "Cardiovascular": ["heart", "cardiac", "blood pressure"],
        "Child Health": ["child", "pediatric", "infant"],
        "Clinical Haematology": ["blood", "haematology", "anemia"],
        "Clinical Imaging": ["imaging", "x-ray", "MRI", "CT"],
        "Dermatology": ["skin", "rash", "dermatitis"],
        "Ear, Nose and Throat": ["ear", "nose", "throat", "ENT"],
        "Endocrine and Metabolic": ["hormone", "thyroid", "diabetes"],
        "Gastrointestinal including Liver": ["stomach", "liver", "gastro"],
        "General Practice and Primary Healthcare": ["general", "primary care"],
        "Medicine of Older Adult Mental Health": ["elderly", "mental health"],
        "Musculoskeletal": ["joint", "muscle", "bone"],
        "Neurosciences": ["neurology", "nervous", "brain"],
        "Obstetrics and Gynaecology": ["pregnancy", "gynecology"],
        "Ophthalmology": ["eye", "vision", "sight"],
        "Palliative and End of Life Care": ["palliative", "end of life"],
        "Perioperative Medicine and Anaesthesia": ["surgery", "anesthesia"],
        "Renal and Urology": ["kidney", "urinary", "urology"],
        "Respiratory": ["lung", "breathing", "respiratory"],
        "Sexual Health": ["sexual", "STD", "contraception"],
        "Surgery": ["surgery", "operation"],
        "Allergy and Immunology": ["allergy", "immune"],
        "Biomedical Sciences": ["biomedical", "science"],
        "Clinical Biochemistry": ["biochemistry", "metabolism"],
        "Clinical Pharmacology and Therapeutics": ["medication", "pharmacology"],
        "Genetics and Genomics": ["genetics", "DNA"],
        "Histopathology": ["histopathology", "tissue"],
        "Human Factors and Quality Improvement": ["quality", "improvement"],
        "Laboratory Haematology": ["laboratory", "haematology"],
        "Medical Ethics and Law": ["ethics", "law"],
        "Microbiology": ["microbiology", "bacteria"],
        "Psychological Principles": ["psychology", "mental"],
        "Social and Population Health": ["social", "population"]
    };

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onstart = () => {
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                }
            };

            recognition.onresult = async (event) => {
                const transcriptText = event.results[event.results.length - 1][0].transcript;
                setTranscript((prevTranscript) => [
                    ...prevTranscript,
                    { fromAI: false, text: transcriptText },
                ]);

                const aiResponse = await fetchAIResponse(transcriptText);
                playAIResponse(aiResponse);
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
        const initializeAI = async () => {
            const initialPrompt =
                "Hello! Welcome to the OSCE history station! I will be the patient and you will be the doctor. Please ask me about my symptoms or concerns.";
            playAIResponse(initialPrompt);
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
                    messages: [
                        { role: "user", content: `As a patient, I am experiencing: ${userText}` }
                    ],
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
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const sentences = text.split('. ');
        let index = 0;

        const speakNext = () => {
            if (index < sentences.length) {
                const utterance = new SpeechSynthesisUtterance(sentences[index]);
                utterance.pitch = 1.2;
                utterance.rate = 1;
                utterance.volume = 1;

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }

                utterance.onend = () => {
                    index++;
                    speakNext();
                };

                window.speechSynthesis.speak(utterance);
            }
        };

        speakNext();
    };

    const inferCategory = (transcriptArray) => {
        const transcriptText = transcriptArray.map(entry => entry.text).join(' ').toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => transcriptText.includes(keyword))) {
                return category;
            }
        }
        return "General"; // Default category if none matched
    };

    const generateFeedback = (transcriptArray) => {
        // Simple feedback generation based on the length of the transcript
        const totalEntries = transcriptArray.length;
        if (totalEntries < 5) {
            return "The conversation was quite brief. Consider asking more detailed questions.";
        } else if (totalEntries < 10) {
            return "Good job! You covered several important points.";
        } else {
            return "Excellent! You had a comprehensive discussion.";
        }
    };

    const insertTranscriptToSupabase = async (transcriptArray) => {
        const formattedTranscript = transcriptArray
            .map(entry => `${entry.fromAI ? 'AI (Patient): ' : 'You (Doctor): '}${entry.text}`)
            .join(' ');

        const inferredCategory = inferCategory(transcriptArray); // Infer category based on transcript
        const feedback = generateFeedback(transcriptArray); // Generate feedback

        const { data, error } = await supabase
            .from("AI_OSCE")
            .insert([
                {
                    transcript: formattedTranscript,
                    category: inferredCategory, // Use inferred category
                    summary: feedback, // Set feedback as summary
                    created_at: new Date(),
                }
            ]);

        if (error) {
            console.error("Error inserting transcript:", error.message);
        } else {
            console.log("Transcript inserted successfully:", data);
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
        } else if (isRecording) {
            setShowModal(true);
        }
    };

    const handleConfirmEndConversation = () => {
        setShowModal(false);
        insertTranscriptToSupabase(transcript);
    };

    const handleCancelEndConversation = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);
                if (availableVoices.length > 0) {
                    setSelectedVoice(availableVoices[0]);
                }
            };
        }
    }, []);

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
                <div>
                    <p className="w-[30%] bg-blue-100 text-black p-5 rounded-[8px]">
                        Choose one from: Acute and Emergency, Cancer, Cardiovascular, Child Health, Clinical Haematology, Clinical Imaging, Dermatology, Ear, Nose and Throat, Endocrine and Metabolic, Gastrointestinal including Liver, General Practice and Primary Healthcare, Medicine of Older Adult Mental Health, Musculoskeletal, Neurosciences, Obstetrics and Gynaecology, Ophthalmology, Palliative and End of Life Care, Perioperative Medicine and Anaesthesia, Renal and Urology, Respiratory, Sexual Health, Surgery, Allergy and Immunology, Biomedical Sciences, Clinical Biochemistry, Clinical Pharmacology and Therapeutics, Genetics and Genomics, Histopathology, Human Factors and Quality Improvement, Laboratory Haematology, Medical Ethics and Law, Microbiology, Psychological Principles, Social and Population Health
                    </p>
                </div>
                <div className="transcript">
                    {transcript.map((entry, index) => (
                        <div key={index} className={`message ${entry.fromAI ? "ai-message" : "user-message"}`}>
                            <div className={`${entry.fromAI ? "bg-[#3CC8A1]" : "bg-[#EDF2F7]"} py-3 px-14 border-[1px] rounded-[8px]`}>
                                <strong>{entry.fromAI ? "AI (Patient): " : "You (Doctor): "}</strong>
                                <span>{entry.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center mb-10">
                    <button
                        className="bg-[#3CC8A1] w-[100%] text-white py-2 px-6 rounded-[8px] text-[16px] font-bold hover:bg-transparent hover:border hover:border-[#3CC8A1] hover:text-[#3CC8A1] transition-all duration-200"
                        onClick={handleStartRecording}
                    >
                        {isRecording ? "Stop Recording" : "Start Recording"}
                    </button>
                </div>
            </main>

            {showModal && (
                <ConfirmationModal
                    onConfirm={handleConfirmEndConversation}
                    onCancel={handleCancelEndConversation}
                />
            )}

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
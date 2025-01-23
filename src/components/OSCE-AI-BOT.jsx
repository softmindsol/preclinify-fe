import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";

const OSCEAIBOT = () => {
    const audioRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const dataChannelRef = useRef(null);
    const recognitionRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false); // State to control recording
    const [transcript, setTranscript] = useState([]); // Transcript state
    const [localStream, setLocalStream] = useState(null); // Local audio stream

    const handleStartRecording = () => {
        setIsRecording((prev) => !prev); // Toggle recording state
    };

    useEffect(() => {
        // Initialize WebRTC
        const initWebRTC = async () => {
            const OPENAI_API_KEY = `${process.env.REACT_APP_OPENAI_API_OSCE_KEY}`;
            const baseUrl = "https://api.openai.com/v1/realtime";
            const model = "gpt-4o-realtime-preview-2024-12-17";

            const peerConnection = new RTCPeerConnection();
            peerConnectionRef.current = peerConnection;

            const audioElement = audioRef.current;
            peerConnection.ontrack = (event) => {
                audioElement.srcObject = event.streams[0];
            };

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setLocalStream(stream); // Store the local stream
            peerConnection.addTrack(stream.getTracks()[0]);

            const dataChannel = peerConnection.createDataChannel("oai-events");
            dataChannelRef.current = dataChannel;

            dataChannel.addEventListener("message", (event) => {
                const message = JSON.parse(event.data);
                if (message && message.transcript) {
                    setTranscript((prevTranscript) => [
                        ...prevTranscript,
                        { fromAI: true, text: message.transcript },
                    ]);
                }
            });

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
                method: "POST",
                body: offer.sdp,
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/sdp",
                },
            });

            const answer = { type: "answer", sdp: await sdpResponse.text() };
            await peerConnection.setRemoteDescription(answer);
        };

        initWebRTC();

        // Initialize Speech Recognition
        const initSpeechRecognition = () => {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognitionRef.current = recognition;

                recognition.continuous = true; // Continuous listening
                recognition.interimResults = false; // Only final results
                recognition.lang = "en-US"; // Set language (change as needed)

                recognition.onresult = (event) => {
                    const transcriptText = event.results[event.results.length - 1][0].transcript;
                    setTranscript((prevTranscript) => [
                        ...prevTranscript,
                        { fromAI: false, text: transcriptText },
                    ]);
                };

                recognition.start(); // Start listening
            } else {
                console.error("SpeechRecognition API is not supported in this browser.");
            }
        };

        initSpeechRecognition();

        return () => {
            if (peerConnectionRef.current) peerConnectionRef.current.close();
            if (recognitionRef.current) recognitionRef.current.stop();
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop()); // Stop all tracks
            }
        };
    }, []);

    useEffect(() => {
        if (isRecording) {
            // Start recording
            if (localStream) {
                audioRef.current.srcObject = localStream; // Set the audio element's source to the local stream
                audioRef.current.play(); // Play the audio
            }
        } else {
            // Stop recording
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop()); // Stop all tracks
                audioRef.current.srcObject = null; // Clear the audio element's source
            }
        }
    }, [isRecording, localStream]);

    return (
        <div>
            <div className="w-full flex items-center justify-center">
                <header className="w-[70%] bg-white shadow-md py-4 px-8 flex justify-between items-center">
                    <Logo />
                    <nav className="flex items-center space-x-4 text-[#3CC8A1] font-medium">
                        <a href="#" className="hover:underline">
                            MCQ
                        </a>
                        <a href="#" className="hover:underline">
                            SAQ
                        </a>
                        <a href="#" className="hover:underline">
                            OSCE
                        </a>
                        <div className="bg-[#3CC8A1] text-white rounded-full h-8 w-8 flex items-center justify-center">
                            N
                        </div>
                    </nav>
                </header>
            </div>

            <main className="w-[100%] mt-8 px-4">
                <div className="bg-[#EDF2F7] w-[30%] p-6 rounded-lg shadow-md mb-4">
                    <p className="text-[#26303d] text-[16px]">
                        Hello! Welcome to the OSCE history station! I will be the patient
                        and you will be the doctor. At the end, I will ask you some
                        follow-up questions and then give you feedback on your performance.
                        If you want to end the consultation please state "End consultation
                        move on to the questions". Please state the module you would like us
                        to focus on.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                    <p className="text-gray-600">
                        Choose one from: Acute and Emergency, Cancer, Cardiovascular, Child
                        Health, Clinical Haematology, Clinical Imaging, Dermatology, Ear,
                        Nose and Throat, Endocrine and Metabolic, Gastrointestinal including
                        Liver, General Practice and Primary Healthcare, Medicine of Older
                        Adult, Mental Health, Musculoskeletal, Neurosciences, Obstetrics
                        and Gynaecology, Ophthalmology, Palliative and End of Life Care,
                        Perioperative Medicine and Anaesthesia, Renal and Urology,
                        Respiratory, Sexual Health, Surgery, Allergy and Immunology,
                        Biomedical Sciences, Clinical Biochemistry, Clinical Pharmacology
                        and Therapeutics, Genetics and Genomics, Histopathology, Human
                        Factors and Quality Improvement, Laboratory Haematology, Medical
                        Ethics and Law, Microbiology, Psychological Principles, Social and
                        Population Health
                    </p>
                </div>
                <div className="flex items-center justify-center">
                    <button
                        className="bg-[#3CC8A1] w-[100%] text-white py-2 px-6 rounded-[8px] text-[16px] font-bold hover:bg-transparent hover:border hover:border-[#3CC8A1] hover:text-[#3CC8A1] transition-all duration-200"
                        onClick={handleStartRecording}
                    >
                        {isRecording ? "Stop Recording" : "Start Recording"}
                    </button>
                </div>

                <audio ref={audioRef} autoPlay controls className="hidden" />
                <h2>Transcript</h2>
                <div className="transcript">
                    {transcript.map((entry, index) => (
                        <div key={index} className={entry.fromAI ? "ai-message" : "user-message"}>
                            <strong>{entry.fromAI ? "AI: " : "You: "}</strong>{entry.text}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default OSCEAIBOT;
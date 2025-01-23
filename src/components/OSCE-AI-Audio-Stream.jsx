import React, { useEffect, useRef, useState } from "react";

const AudioStreamingClient = ({ isRecording, setTranscript }) => {
    const audioRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const dataChannelRef = useRef(null);
    // const [transcript, setTranscript] = useState([]); // State to hold the conversation
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Initialize WebRTC
        const initWebRTC = async () => {
            const OPENAI_API_KEY = `${process.env.REACT_APP_OPENAI_API_KEY}`;
            const baseUrl = "https://api.openai.com/v1/realtime";
            const model = "gpt-4o-realtime-preview-2024-12-17";

            const peerConnection = new RTCPeerConnection();
            peerConnectionRef.current = peerConnection;

            const audioElement = audioRef.current;
            peerConnection.ontrack = (event) => {
                audioElement.srcObject = event.streams[0];
            };

            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            peerConnection.addTrack(localStream.getTracks()[0]);

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
        };
    }, [isRecording, setTranscript]);

    return (
        <div>
            <h1>Realtime Audio Streaming (Client-Side)</h1>
            <audio ref={audioRef} autoPlay controls />

            {/* <div>
                <h2>Transcript</h2>
                <div className="transcript">
                    {transcript.map((entry, index) => (
                        <div key={index} className={entry.fromAI ? "ai-message" : "user-message"}>
                            <strong>{entry.fromAI ? "AI: " : "You: "}</strong>{entry.text}
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

export default AudioStreamingClient;


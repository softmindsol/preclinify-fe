import { useState, useRef } from "react";

const useVoiceRecorder = (AIPrompt) => {
  const audioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);

  const initWebRTC = async () => {
    try {
      setIsRecording(true);
console.log("prompt:", prompt);

      // Fetch Ephemeral Key for WebRTC Session
 const tokenResponse = await fetch(
   `http://localhost:7001/session`,
   {
     method: "POST", // POST request to send data
     headers: {
       "Content-Type": "application/json", // Telling backend that body contains JSON
     },
     body: JSON.stringify({
       prompt: AIPrompt, // AI Prompt pass kar rahe hain
     }),
   },
 );
      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret.value;
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-mini-realtime-preview-2024-12-17";

      // Create WebRTC Peer Connection
      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      peerConnection.ontrack = (event) => {
        console.log("Incoming audio stream:", event.streams[0]);
        if (audioRef.current) {
          audioRef.current.srcObject = event.streams[0];
          audioRef.current
            .play()
            .catch((err) => console.error("Audio play error:", err));
        }
      };

      // Get Microphone Access
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));

      // Create Data Channel
      const dataChannel = peerConnection.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;

      dataChannel.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message?.transcript) {
          setTranscript((prev) => [
            ...prev,
            { fromAI: true, text: message.transcript },
          ]);
        }
      });

      // Create & Send Offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      const answer = { type: "answer", sdp: await sdpResponse.text() };
      await peerConnection.setRemoteDescription(answer);

      initSpeechRecognition();
    } catch (error) {
      console.error("Error initializing WebRTC:", error);
      setIsRecording(false);
    }
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcriptText =
        event.results[event.results.length - 1][0].transcript;
      setTranscript((prev) => [
        ...prev,
        { fromAI: false, text: transcriptText },
      ]);
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (recognitionRef.current) recognitionRef.current.stop();
    if (dataChannelRef.current) dataChannelRef.current.close();
    setIsRecording(false);
  };

  function sendTextMessage(message) {
    if (
      dataChannelRef.current &&
      dataChannelRef.current.readyState === "open"
    ) {
      const event = {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text: message,
            },
          ],
        },
      };

      dataChannelRef.current.send(JSON.stringify(event));
    } else {
      console.error("Data channel is not open");
    }
  }

  return {
    isRecording,
    setTranscript,
    transcript,
    audioRef,
    initWebRTC,
    stopRecording,
    sendTextMessage,
  };
};

export default useVoiceRecorder;

import { useState, useRef, useEffect } from "react";

const useVoiceRecorder = (AIPrompt) => {
  const audioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [localStream, setLocalStream] = useState(null); // Store local stream
const [dataChannel, setDataChannel] = useState(null);
const [isLoader,setIsLoader] = useState(false);
  const initWebRTC = async () => {
    try {
      setIsRecording(true);
      setIsLoader(true);
      const tokenResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: AIPrompt }),
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
        if (audioRef.current) {
          audioRef.current.srcObject = event.streams[0];
          audioRef.current
            .play()
            .catch((err) => console.error("Audio play error:", err));
        }
      };

      // Get Microphone Access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setLocalStream(stream); // Store the local stream
      // stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      // Create Data Channel
      const dataChannel = peerConnection.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;
      setDataChannel(dataChannel);

      dataChannel.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message from AI:", message);
        if (message?.transcript) {
          setTranscript((prev) => [
            ...prev,
            { fromAI: true, text: message.transcript },
          ]);
          setIsAISpeaking(true); // AI started responding
          console.log("AI is speaking:", message.transcript);
        }

        // Check if the AI has finished speaking
        if (message?.type === "output_audio_buffer.stopped") {
          setIsAISpeaking(false); // AI has finished speaking
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
            setIsLoader(false);

    
    } catch (error) {
      console.error("Error initializing WebRTC:", error);
      setIsRecording(false);
      setIsLoader(false);

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

    // Start recognition only if AI is not speaking
    if (!isAISpeaking) {
      recognition.start();
    }
    
        console.log("Initializing Speech Recognition...");

  };

  const stopRecording = () => {
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (recognitionRef.current) recognitionRef.current.stop();
    if (dataChannelRef.current) dataChannelRef.current.close();
    setIsRecording(false);
  };

//  useEffect(() => {
//     if (isAISpeaking) {
//       // Stop microphone tracks when AI is speaking
//       console.log("AI is speaking. Disabling microphone.");
//       localStream?.getTracks().forEach(track => track.stop());
      
//       // Stop speech recognition when AI is speaking
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//         console.log("Speech recognition stopped.");
//       }
//     } else {
//       // Restart microphone tracks when AI is not speaking
//       console.log("AI has finished speaking. Enabling microphone.");
//       if (localStream) {
//         localStream.getTracks().forEach(track => {
//           // Check if the track is already added
//           const sender = peerConnectionRef.current.getSenders().find(s => s.track === track);
//           if (!sender) {
//             // Re-add the track to the peer connection
//             peerConnectionRef.current.addTrack(track, localStream);
//           }
//         });
//       }

//       // Start speech recognition when AI is not speaking
//       initSpeechRecognition();
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, [isAISpeaking, localStream]);

 useEffect(() => {
   if (isAISpeaking) {
     // Stop microphone tracks when AI is speaking
     console.log("AI is speaking. Disabling microphone.");
     localStream?.getTracks().forEach((track) => {
       track.enabled = false; // Disable the track instead of stopping it
     });

     // Stop speech recognition when AI is speaking
     if (recognitionRef.current) {
       recognitionRef.current.stop();
       console.log("Speech recognition stopped.");
     }
   } else {
     // Restart microphone tracks when AI is not speaking
     console.log("AI has finished speaking. Enabling microphone.");
     if (isRecording){
       if (localStream) {
         localStream.getTracks().forEach((track) => {
           track.enabled = true; // Re-enable the track
           const sender = peerConnectionRef.current
             .getSenders()
             .find((s) => s.track === track);
           if (!sender) {
             peerConnectionRef.current.addTrack(track, localStream);
             console.log("Re-added track to peer connection:", track);
           }
         });
       }
     }
     // Start speech recognition when AI is not speaking
     initSpeechRecognition();
   }

   return () => {
     if (recognitionRef.current) {
       recognitionRef.current.stop();
       console.log("Cleanup: Speech recognition stopped.");
     }
   };
 }, [isAISpeaking, localStream]);

  const sendTextMessage = (message) => {
    if (
      dataChannelRef.current &&
      dataChannelRef.current.readyState === "open"
    ) {
      const event = {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: message }],
        },
      };

      dataChannelRef.current.send(JSON.stringify(event));
    } else {
      console.error("Data channel is not open");
    }
  };

  return {
    isRecording,
    setTranscript,
    transcript,
    audioRef,
    initWebRTC,
    stopRecording,
    sendTextMessage,
    isAISpeaking,
    setIsAISpeaking,
    initSpeechRecognition,
    recognitionRef,
    isLoader,
  };
};

export default useVoiceRecorder;
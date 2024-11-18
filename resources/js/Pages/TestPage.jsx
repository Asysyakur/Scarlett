import axios from "axios";
import { useState, useRef, useEffect } from "react";

const TestPage = () => {
    const [localStream, setLocalStream] = useState(null);
    const localVideoRef = useRef(null);
    const signalingSocketRef = useRef(null);

    // Capture the student's video stream
    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setLocalStream(stream);
            localVideoRef.current.srcObject = stream;

            // Connect to the WebSocket server
            // signalingSocketRef.current = new WebSocket('http://localhost:8080');
            // signalingSocketRef.current.onopen = () => {
            //     console.log('WebSocket connection established');
            // };

            // signalingSocketRef.current.onmessage = (message) => {
            //     const data = JSON.parse(message.data);
            //     // Handle incoming messages (e.g., signaling messages)
            // };

            const videoBlob = new Blob([stream], { type: "video/webm" });
            const reader = new FileReader();
            reader.onloadend = function () {
                const base64Video = reader.result.split(",")[1]; // Base64 encoding of video data

                // // Send the video data to the server via WebSocket
                // signalingSocketRef.current.send(
                //     JSON.stringify({
                //         type: 'video',
                //         videoData: base64Video, // Send the video data to the server
                //     })
                // );

                // Trigger Laravel event to broadcast video stream to teacher
                axios.post("/broadcast-video", { videoData: base64Video });
            };
            reader.readAsDataURL(videoBlob);
            // Send video data every 3 seconds

            // Stop the stream when unmounting
            return () => {
                clearInterval(sendStream);
                if (signalingSocketRef.current) {
                    signalingSocketRef.current.close();
                }
                stream.getTracks().forEach((track) => track.stop());
            };
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    useEffect(() => {
        return () => {
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div>
            <h2>Student Page</h2>
            <button
                onClick={startStream}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
                Start Share
            </button>
            <div>
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-auto"
                ></video>
            </div>
        </div>
    );
};

export default TestPage;

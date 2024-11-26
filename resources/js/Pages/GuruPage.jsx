import { useState, useRef, useEffect } from "react";

const TeacherPage = ({ teacherId }) => {
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        // Listen to the channel for video streams from the student
        window.Echo.channel("testChannel." + 1) // replace with actual teacherId if needed
            .listen("TestingEvent", (event) => {
                // Decode the base64 string to get the raw binary data
                const videoData = event.videoData; // This is the base64 string sent by the student
                const binaryData = atob(videoData); // Decode the base64 string to binary data

                // Convert binary data to a byte array
                const byteArray = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    byteArray[i] = binaryData.charCodeAt(i);
                }

                // Create a Blob from the binary data
                const videoBlob = new Blob(
                    [
                        new Uint8Array(
                            videoData
                                .split("")
                                .map((char) => char.charCodeAt(0))
                        ),
                    ],
                    { type: "video/webm" }
                );

                // Create a URL for the Blob (we'll use this to set the srcObject)
                const videoUrl = URL.createObjectURL(videoBlob);
                remoteVideoRef.current.src = videoUrl; // Use src instead of srcObject

                // Assign the URL to the video element
                const videoElement = remoteVideoRef.current;
                videoElement.srcObject = null; // Clear any previous streams
                videoElement.src = videoUrl; // Set the new video URL to the video element
            });

        return () => {
            window.Echo.leave("testChannel." + 1); // Clean up on component unmount
        };
    }, []);
console.log(remoteVideoRef.current.src);
    return (
        <div>
            <h2>Teacher Page</h2>
            <video
                ref={remoteVideoRef}
                autoPlay
                controls
                className="w-full h-auto"
            ></video>
        </div>
    );
};

export default TeacherPage;

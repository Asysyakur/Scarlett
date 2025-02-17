import { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Peer from "peerjs";
import axios from "axios";
import WarnigIlu from "./assets/Warning.svg";
import { useActivity } from "@/Contexts/ActivityContext";

function StudentScreenShare({ auth, test }) {
    const [isSharing, setIsSharing] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [remainingTime, setRemainingTime] = useState(60);
    const [showTooltip, setShowTooltip] = useState(false);
    const streamRef = useRef(null);
    const peerRef = useRef(null);
    const { startActivity, stopActivity, currentPath, changePath } = useActivity();

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.hidden) {
                await stopActivity(); // Wait for stopActivity to complete
            } else {
                startActivity();
            }
        };

        changePath(`/test/${test.id}`);
        startActivity();

        document.addEventListener("visibilitychange", handleVisibilityChange);

        const timer = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsButtonDisabled(false);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            clearInterval(timer);
            stopActivity(); // Ensure stopActivity completes before cleanup
        };
    }, [currentPath, startActivity, stopActivity, changePath]);

    const startScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false,
            });

            // Add event listener to stop screen share when stream ends
            stream.getTracks().forEach((track) => {
                track.onended = () => {
                    stopScreenShare();
                };
            });

            if (streamRef.current) {
                streamRef.current.srcObject = stream;
            }

            const peer = new Peer();

            peer.on("open", async (peerId) => {
                await axios.post("/start-screen-share", {
                    studentId: auth.user.id,
                    name: auth.user.name,
                    peerId,
                });

                sessionStorage.setItem("peerId", peerId);

                peer.on("call", (call) => {
                    if (streamRef.current) {
                        const localStream = streamRef.current.srcObject;
                        call.answer(localStream);
                        call.on("stream", function (remoteStream) {
                            const remoteVideo = document.getElementById("remote-video");
                            if (remoteVideo) {
                                remoteVideo.srcObject = remoteStream;
                            }
                        });
                        call.on("error", (err) => console.error("Error during call:", err));
                    } else {
                        console.log("No local stream available to answer the call.");
                    }
                });
            });

            peerRef.current = peer;
            setIsSharing(true);
            sessionStorage.setItem("isSharing", "true");
        } catch (err) {
            console.error("Error starting screen share:", err);
        }
    };

    const resumeScreenShare = async (peerId) => {
        try {
            const peer = new Peer(peerId);

            peer.on("call", (call) => {
                if (streamRef.current) {
                    const localStream = streamRef.current.srcObject;
                    call.answer(localStream);
                    call.on("stream", function (remoteStream) {
                        const remoteVideo = document.getElementById("remote-video");
                        if (remoteVideo) {
                            remoteVideo.srcObject = remoteStream;
                        }
                    });
                    call.on("error", (err) => console.error("Error during call:", err));
                } else {
                    console.log("No local stream available to answer the call.");
                }
            });

            peerRef.current = peer;
            setIsSharing(true);
        } catch (err) {
            console.error("Error resuming screen share:", err);
        }
    };

    const stopScreenShare = () => {
        if (streamRef.current?.srcObject) {
            const tracks = streamRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
        }

        if (peerRef.current) {
            peerRef.current.destroy();
        }

        setIsSharing(false);
        sessionStorage.setItem("isSharing", "false");
        sessionStorage.removeItem("peerId");

        // Send notification to server that screen sharing has stopped
        axios.post("/stop-screen-share", {
            studentId: auth.user.id,
        });
    };

    const handleNextClick = async () => {
        if(isButtonDisabled) {
            return;
        }
        try {
            await axios.post("/update-progress", { progress: 2 });
            router.visit("/test"); // Adjust this route as needed
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Screen Share" />
            <div className="max-w-7xl mx-auto p-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {test.name}
                </h2>

                {!isSharing ? (
                    <button
                        onClick={startScreenShare}
                        className="transform transition-all hover:scale-105 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-lg hover:bg-amber-600 duration-200 w-full md:w-auto px-6 py-2 mb-8 shadow-md"
                    >
                        Mulai Screen Sharing
                    </button>
                ) : (
                    <button
                        onClick={stopScreenShare}
                        className="transform transition-all hover:scale-105 bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg mb-8 shadow-md"
                    >
                        Berhenti Screen Sharing
                    </button>
                )}

                {isSharing && test.link && (
                    <iframe
                        src={test.link}
                        className="w-full h-screen rounded-xl border border-amber-300 shadow-lg mt-6"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                )}

                {!isSharing && (
                    <div className="mt-8">
                        <img
                            src={WarnigIlu}
                            alt="Test Illustration"
                            className="mx-auto max-w-[200px] md:max-w-xs mb-4" // Reduced image size
                        />
                        <div className="text-gray-500 italic font-bold text-xl">
                            Anda harus memulai screen sharing untuk mengakses
                            test ini.
                        </div>
                    </div>
                )}

                <div className="hidden mt-4">
                    <video
                        ref={streamRef}
                        autoPlay
                        muted
                        className="border rounded-lg w-full h-64"
                    ></video>
                </div>

                <div className="mt-8 text-center relative">
                    <button
                        onClick={handleNextClick}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className={`bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                            isButtonDisabled ? "opacity-50" : ""
                        }`}
                    >
                        Next
                    </button>
                    {showTooltip && isButtonDisabled && (
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-700 text-white text-sm rounded">
                            Sisa waktu: {remainingTime} detik
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default StudentScreenShare;
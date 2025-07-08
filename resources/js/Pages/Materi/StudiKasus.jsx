import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useActivity } from "@/Contexts/ActivityContext";
import WarnigIlu from "./assets/Warning.svg";
import Peer from "peerjs";
import axios from "axios";
export default function StudiKasus({ materi }) {
    const streamRef = useRef(null);
    const peerRef = useRef(null);
    const [isSharing, setIsSharing] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [remainingTime, setRemainingTime] = useState(5);
    const [showTooltip, setShowTooltip] = useState(false);
    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.hidden) {
                await stopActivity(); // Wait for stopActivity to complete
            } else {
                startActivity();
            }
        };

        changePath(`/materi/${materi.id}/studi-kasus`);
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
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            stopActivity(); // Ensure stopActivity completes before cleanup
        };
    }, [currentPath]);

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
                    from: "Materi",
                });

                sessionStorage.setItem("peerId", peerId);

                peer.on("call", (call) => {
                    if (streamRef.current) {
                        const localStream = streamRef.current.srcObject;
                        call.answer(localStream);
                        call.on("stream", function (remoteStream) {
                            const remoteVideo =
                                document.getElementById("remote-video");
                            if (remoteVideo) {
                                remoteVideo.srcObject = remoteStream;
                            }
                        });
                        call.on("error", (err) =>
                            console.error("Error during call:", err)
                        );
                    } else {
                        console.log(
                            "No local stream available to answer the call."
                        );
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

    return (
        <AuthenticatedLayout>
            <Head title={materi.title} />
            <div className="max-w-7xl mx-auto my-6 p-6 border border-amber-300 bg-white rounded-lg shadow-md min-h-screen">
                {/* Back Link */}
                {!isSharing ? (
                    <div className="mb-4 ">
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                            Studi Kasus
                        </h1>
                        <div className="justify-center flex flex-col items-center">
                            <button
                                onClick={startScreenShare}
                                className="transform transition-all hover:scale-105 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-lg hover:bg-amber-600 duration-200 w-full md:w-auto px-6 py-2 mb-8 shadow-md"
                            >
                                Mulai Screen Sharing
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="justify-center flex flex-col items-center">
                        <button
                            onClick={stopScreenShare}
                            className="transform transition-all hover:scale-105 bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg mb-8 shadow-md w-full md:w-auto"
                        >
                            Berhenti Screen Sharing
                        </button>
                    </div>
                )}
                {isSharing && (
                    <div>
                        <h2 className="text-2xl font-semibold text-center text-red-700 mb-4">
                            Step Open Inquiry : Identifying Problem
                        </h2>
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                            Studi Kasus: {materi.title}
                        </h1>
                        <div className="mb-6">
                            <iframe
                                src={`/storage/${materi.studikasusfile}`}
                                className="w-full h-[calc(100vh-160px)] rounded-md shadow-lg"
                                frameBorder="0"
                            >
                                Your browser does not support PDFs.
                            </iframe>
                        </div>
                        <div className="flex justify-center">
                            <div className="mt-6 flex justify-center relative">
                                {isButtonDisabled ? (
                                    <button
                                        className={`bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                            isButtonDisabled ? "opacity-50" : ""
                                        }`}
                                        onMouseEnter={() =>
                                            setShowTooltip(true)
                                        }
                                        onMouseLeave={() =>
                                            setShowTooltip(false)
                                        }
                                    >
                                        Selanjutnya
                                    </button>
                                ) : (
                                    <Link
                                        href={`/materi/${materi.id}`}
                                        className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Selanjutnya
                                    </Link>
                                )}
                                {showTooltip && isButtonDisabled && (
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-700 text-white text-sm rounded">
                                        Sisa waktu: {remainingTime} detik
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {!isSharing && (
                    <div className="mt-8 flex flex-col items-center">
                        <img
                            src={WarnigIlu}
                            alt="Test Illustration"
                            className="mx-auto max-w-[200px] md:max-w-xs mb-4" // Reduced image size
                        />
                        <div className="text-gray-500 italic font-bold text-xl">
                            Anda harus memulai screen sharing untuk mengakses
                            Studi Kasus ini.
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
            </div>
        </AuthenticatedLayout>
    );
}

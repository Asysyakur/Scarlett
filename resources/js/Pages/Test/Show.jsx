import { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Peer from "peerjs";
import axios from "axios";
import WarnigIlu from "./assets/Warning.svg";
import { useActivity } from "@/Contexts/ActivityContext";

function StudentScreenShare({ auth, test }) {
    const [isSharing, setIsSharing] = useState(false);
    const streamRef = useRef(null);
    const peerRef = useRef(null);
    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();

    useEffect(() => {
        changePath(`/test/${test.id}`);
        startActivity();

        const handleVisibilityChange = () => {
            if (document.hidden) stopActivity();
            else startActivity();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            stopActivity();
        };
    }, [currentPath]);

    const startScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false,
            });

            // Tambahkan event listener untuk menghentikan screen share saat stream berakhir
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

        // Kirim notifikasi ke server bahwa screen sharing telah dihentikan
        axios.post("/stop-screen-share", {
            studentId: auth.user.id,
        });
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
            </div>
        </AuthenticatedLayout>
    );
}

export default StudentScreenShare;

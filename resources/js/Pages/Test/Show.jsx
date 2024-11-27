import { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Peer from "peerjs";
import axios from "axios";

function StudentScreenShare({ auth, test }) {
    const [isSharing, setIsSharing] = useState(false);
    const streamRef = useRef(null);
    const peerRef = useRef(null);

    const startScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false,
            });

            // Menampilkan preview stream di video element
            if (streamRef.current) {
                streamRef.current.srcObject = stream;
            }

            const peer = new Peer(); // Inisialisasi Peer untuk siswa

            peer.on("open", async (peerId) => {
                console.log("Student Peer ID:", peerId);

                // Kirim Peer ID ke server
                await axios.post("/start-screen-share", {
                    studentId: auth.user.id,
                    peerId,
                });

                // Mendengarkan panggilan dari guru
                peer.on("call", (call) => {
                    console.log("Received call from:", call.peer);

                    // Make sure the local media stream is available
                    if (streamRef.current) {
                        const localStream = streamRef.current.srcObject;

                        // Answer the call with the local stream (screen share or webcam)
                        call.answer(localStream);

                        // Display the remote stream (the other peer's media stream)
                        call.on("stream", function (remoteStream) {
                            const remoteVideo =
                                document.getElementById("remote-video");
                            if (remoteVideo) {
                                remoteVideo.srcObject = remoteStream;
                            }
                        });

                        call.on("error", (err) => {
                            console.error("Error during call:", err);
                        });
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
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Screen Share" />
            <div className="container mx-auto text-center mt-10">
                <h2 className="text-2xl font-bold mb-4">{test.name}</h2>
                {!isSharing ? (
                    <button
                        onClick={startScreenShare}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                    >
                        Start Screen Sharing
                    </button>
                ) : (
                    <button
                        onClick={stopScreenShare}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg"
                    >
                        Stop Screen Sharing
                    </button>
                )}
                {test.link && (
                    <iframe
                        src={test.link}
                        className=" flex w-full h-screen"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                )}
                <div className="mt-4 hidden">
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

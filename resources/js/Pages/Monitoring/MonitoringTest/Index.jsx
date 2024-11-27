import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Pusher from "pusher-js";
import Peer from "peerjs";

function TeacherMonitoring() {
    const [streams, setStreams] = useState([]);
    const [peer, setPeer] = useState(null);
    const [activeCalls, setActiveCalls] = useState({});
    
    // Inisialisasi PeerJS untuk guru
    useEffect(() => {
        const teacherPeer = new Peer();

        teacherPeer.on("open", (id) => {
            console.log("Teacher Peer ID:", id);
            setPeer(teacherPeer);
        });

        teacherPeer.on("error", (err) => {
            console.error("PeerJS error:", err);
        });

        return () => {
            if (teacherPeer) teacherPeer.destroy();
        };
    }, []);

    // Inisialisasi Pusher untuk menerima data siswa
    useEffect(() => {
        const pusher = new Pusher("850300e98d76a0db2c51", {
            cluster: "ap1",
        });

        const channel = pusher.subscribe("test-monitoring");

        channel.bind("screen-share-started", (data) => {
            console.log("Received screen share data:", data);
            setStreams((prev) => [
                ...prev,
                { studentId: data.studentId, peerId: data.peerId },
            ]);
        });

        return () => {
            pusher.unsubscribe("test-monitoring");
        };
    }, []);

    // Fungsi untuk memulai monitoring stream
    const startMonitoring = (peerId, index) => {
        if (!peer) {
            console.error("PeerJS instance not initialized.");
            return;
        }

        if (!peer.open) {
            console.error("Peer connection is not open yet.");
            return;
        }

        console.log("Attempting to call Peer ID:", peerId);

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                // Make a call to another peer with the local stream
                var call = peer.call(peerId, stream);

                // Set the call as active for this student
                setActiveCalls((prev) => ({
                    ...prev,
                    [index]: { peerId, call, active: true },
                }));

                // Handle the remote stream from the other peer
                call.on("stream", function (remoteStream) {
                    const videoElement = document.getElementById(`video-${index}`);
                    if (videoElement) {
                        videoElement.srcObject = remoteStream;
                    }
                });

                call.on("close", () => {
                    stopMonitoring(index); // Handle stopping the call when it's closed
                });
            })
            .catch(function (err) {
                console.error("Failed to get local stream", err);
            });
    };

    // Fungsi untuk menghentikan monitoring stream
    const stopMonitoring = (index) => {
        const activeCall = activeCalls[index];

        if (activeCall) {
            activeCall.call.close(); // Close the call
            setActiveCalls((prev) => ({
                ...prev,
                [index]: { ...activeCall, active: false },
            }));
        }

        const videoElement = document.getElementById(`video-${index}`);
        if (videoElement) {
            videoElement.srcObject = null; // Stop showing the remote stream
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Teacher Monitoring" />
            <div className="container mx-auto">
                <h2 className="text-xl font-bold mb-4">Monitoring Streams</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {streams.length === 0 ? (
                        <p>No streams available</p>
                    ) : (
                        streams.map((stream, index) => (
                            <div key={index} className="border p-4 rounded-lg">
                                <p>Student ID: {stream.studentId}</p>
                                <video
                                    id={`video-${index}`}
                                    controls
                                    autoPlay
                                    className="w-full h-48"
                                ></video>
                                <button
                                    onClick={() =>
                                        activeCalls[index]?.active
                                            ? stopMonitoring(index)
                                            : startMonitoring(stream.peerId, index)
                                    }
                                    className={`mt-2 px-4 py-2 ${
                                        activeCalls[index]?.active
                                            ? "bg-red-500"
                                            : "bg-green-500"
                                    } text-white rounded-lg`}
                                >
                                    {activeCalls[index]?.active ? "Stop" : "View Stream"}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default TeacherMonitoring;

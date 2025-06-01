import { useContext, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Warning from "../assets/Warning.svg";
import { ScreenShareContext } from "@/Contexts/ScreenShareContext";

function TeacherMonitoring() {
    const { streams, peer } = useContext(ScreenShareContext);
    const [activeCalls, setActiveCalls] = useState({});

    const startMonitoring = (peerId, index) => {
        if (!peer) return console.error("PeerJS instance not initialized.");
        if (!peer.open) return console.error("Peer connection is not open yet.");

        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
                const call = peer.call(peerId, stream);
                setActiveCalls((prev) => ({
                    ...prev,
                    [index]: { peerId, call, active: true },
                }));

                call.on("stream", (remoteStream) => {
                    const videoElement = document.getElementById(`video-${index}`);
                    if (videoElement) {
                        videoElement.srcObject = remoteStream;
                    }
                });

                call.on("close", () => {
                    stopMonitoring(index);
                });
            })
            .catch((err) => console.error("Failed to get local stream", err));
    };

    const stopMonitoring = (index) => {
        const activeCall = activeCalls[index];
        if (activeCall) activeCall.call.close();

        setActiveCalls((prev) => ({
            ...prev,
            [index]: { ...activeCall, active: false },
        }));

        const videoElement = document.getElementById(`video-${index}`);
        if (videoElement) videoElement.srcObject = null;
    };

    return (
        <AuthenticatedLayout header={<>Monitoring Test dan Materi</>}>
            <Head title="Teacher Monitoring" />
            <div className="max-w-7xl mx-auto p-6">
                {streams.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <img src={Warning} alt="Monitoring Illustration" className="mx-auto max-w-[200px] md:max-w-xs mb-4" />
                        <p className="italic">Belum ada stream tersedia</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                        {streams.map((stream, index) => (
                            <div key={index} className="bg-white shadow-lg rounded-lg p-6">
                                <h2 className="text-base font-semibold">ID: {stream.studentId}</h2>
                                <h2 className="text-base font-semibold">Name: {stream.name}</h2>
                                <video id={`video-${index}`} autoPlay controls className="w-full h-48 mb-4 rounded-lg"></video>
                                {!activeCalls[index]?.active ? (
                                    <button
                                        onClick={() => startMonitoring(stream.peerId, index)}
                                        className="mt-2 px-4 py-2 w-full text-white bg-green-500 rounded-lg"
                                    >
                                        View Stream
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => stopMonitoring(index)}
                                        className="mt-2 px-4 py-2 w-full text-white bg-red-500 rounded-lg"
                                    >
                                        Stop Monitoring
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

export default TeacherMonitoring;

import { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useActivity } from "@/Contexts/ActivityContext";

function TestShow({ test }) {
    const [isRecording, setIsRecording] = useState(false);
    const [streamLink, setStreamLink] = useState(null); // To store the stream URL
    const streamRef = useRef(null);
    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();

    useEffect(() => {
        // Manually update the path when the component mounts
        changePath(`/test/${test.id}`);

        // Start activity when page is loaded or path changes
        startActivity();

        // Event listener to stop/resume activity on tab visibility change
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopActivity();
            } else {
                startActivity();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            stopActivity(); // Ensure activity is stopped when component unmounts
        };
    }, [currentPath]); // Depend on functions and manually updating path
    if (!test) {
        return <div>Loading...</div>;
    }
    // Start screen capture
    const startCapture = async () => {
        try {
            // Request permission to capture screen
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false,
            });

            // Display the captured screen in the video element
            streamRef.current.srcObject = stream;
            setStreamLink(URL.createObjectURL(stream)); // Create a temporary URL for the stream
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting screen capture:", err);
        }
    };

    // Stop screen capture
    const stopCapture = () => {
        if (streamRef.current.srcObject) {
            const tracks = streamRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop()); // Stop all tracks
            setStreamLink(null); // Clear the stream URL
            setIsRecording(false);
        }
    };
    console.log(streamLink);
    return (
        <AuthenticatedLayout>
            <Head title="Test" />
            <div className="container mx-auto">
                {/* Button to start/stop recording */}
                <div className="mt-4 text-center">
                    {!isRecording ? (
                        <button
                            onClick={startCapture}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Mulai Rekam Layar
                        </button>
                    ) : (
                        <button
                            onClick={stopCapture}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg"
                        >
                            Hentikan Rekam
                        </button>
                    )}
                </div>

                {/* Display the screen recording */}
                <video ref={streamRef} className="video" autoPlay controls />

                {test.link && (
                    <iframe
                        src={test.link}
                        className=" flex w-full h-screen"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                )}
                {/* If screen capture is available, provide the link to view it */}
                {streamLink && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold">Lihat Stream</h3>
                        <Link
                            href={`/stream`} // Direct link to the stream page
                            className="text-blue-500 hover:underline"
                        >
                            Klik untuk melihat stream
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

export default TestShow;

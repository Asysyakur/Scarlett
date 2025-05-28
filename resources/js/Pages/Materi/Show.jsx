import { useActivity } from "@/Contexts/ActivityContext";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

export default function Show({ materi }) {
    const [activeTab, setActiveTab] = useState("content"); // Default tab is "content"
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [remainingTime, setRemainingTime] = useState(60);
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

        changePath(`/materi/${materi.id}`);
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
            clearInterval(timer);
            stopActivity(); // Ensure stopActivity completes before cleanup
        };
    }, [currentPath]);

    function convertToEmbedURL(youtubeUrl) {
        const regex =
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = youtubeUrl.match(regex);

        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }

        return null; // jika tidak valid, kembalikan null
    }

    const contentWithLineBreaks = materi.content.replace(/\n/g, "<br />");
    return (
        <AuthenticatedLayout>
            <Head title={materi.title} />
            <div className="max-w-7xl mx-auto my-6 p-6 border border-amber-300 bg-white rounded-lg shadow-md">
                {/* Back Link */}
                <div className="mb-4">
                    <Link
                        href={route("materi.index")} // Adjust this route as needed
                        className="text-amber-500 hover:text-amber-700 font-semibold"
                    >
                        Kembali ke Materi
                    </Link>
                </div>
                <h2 className="text-2xl font-semibold text-center text-red-700 mb-4">
                    Step Open Inquiry : Formulating Hypotheses
                </h2>
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {materi.title}
                </h1>

                {/* Centering the image with 16:9 aspect ratio and responsive sizing */}
                {materi.image && (
                    <div className="w-full max-w-[800px] mx-auto mb-6">
                        <div className="relative pb-[40%] w-full rounded-md overflow-hidden">
                            <img
                                src={`/storage/${materi.image}`}
                                alt={materi.title}
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-300 hover:opacity-90"
                                style={{ maxHeight: "450px" }} // Maximum height of the image
                            />
                        </div>
                    </div>
                )}

                {/* Tabs for content, video, and file */}
                <div className="mb-4">
                    <div className="flex space-x-6 justify-center border-b border-gray-300">
                        <button
                            className={`py-2 px-6 font-semibold text-lg ${
                                activeTab === "content"
                                    ? "border-b-2 border-amber-500 text-gray-800"
                                    : "text-gray-500 hover:text-gray-700"
                            } transition-colors`}
                            onClick={() => setActiveTab("content")}
                        >
                            Content
                        </button>
                        {materi.video && (
                            <button
                                className={`py-2 px-6 font-semibold text-lg ${
                                    activeTab === "video"
                                        ? "border-b-2 border-amber-500 text-gray-800"
                                        : "text-gray-500 hover:text-gray-700"
                                } transition-colors`}
                                onClick={() => setActiveTab("video")}
                            >
                                Video
                            </button>
                        )}
                        {materi.file && (
                            <button
                                className={`py-2 px-6 font-semibold text-lg ${
                                    activeTab === "file"
                                        ? "border-b-2 border-amber-500 text-gray-800"
                                        : "text-gray-500 hover:text-gray-700"
                                } transition-colors`}
                                onClick={() => setActiveTab("file")}
                            >
                                File
                            </button>
                        )}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "content" && (
                    <div
                        className="prose max-w-none text-gray-700 mb-6"
                        dangerouslySetInnerHTML={{
                            __html: contentWithLineBreaks,
                        }}
                    ></div>
                )}

                {activeTab === "video" && materi.video && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Video
                        </h2>
                        <iframe
                            width="100%"
                            height="500"
                            src={convertToEmbedURL(materi.video)}
                            frameBorder="0"
                            allowFullScreen
                            title="Video"
                            className="rounded-md shadow-lg"
                        ></iframe>
                    </div>
                )}

                {activeTab === "file" && materi.file && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            View PDF
                        </h2>
                        <iframe
                            src={`/storage/${materi.file}`}
                            width="100%"
                            height="600"
                            frameBorder="0"
                            className="rounded-md shadow-lg"
                        >
                            Your browser does not support PDFs.
                        </iframe>
                    </div>
                )}

                {/* Add a button below the tabs */}
                <div className="mt-6 flex justify-center relative">
                    {isButtonDisabled ? (
                        <button
                            className={`bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                isButtonDisabled ? "opacity-50" : ""
                            }`}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            Selanjutnya
                        </button>
                    ) : (
                        <Link
                            href={
                                materi?.studikasus === true ||
                                materi?.studikasus === 1
                                    ? `/materi/${materi?.id}/studi-kasus`
                                    : materi?.dnd === true || materi?.dnd === 1
                                    ? `/materi/${materi?.id}/drag-and-drop`
                                    : "/materi"
                            }
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
        </AuthenticatedLayout>
    );
}

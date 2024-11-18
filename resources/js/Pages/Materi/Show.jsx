import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import React, { useState } from "react";

export default function Show({ materi }) {
    const [activeTab, setActiveTab] = useState("content"); // Default tab is "content"

    function convertToEmbedURL(youtubeUrl) {
        const regex =
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = youtubeUrl.match(regex);

        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }

        return null; // jika tidak valid, kembalikan null
    }

    const handlePageChange = () => {
        if (materi.id === 1) {
            window.location.href = '/materi/1/drag-and-drop';
        } else {
            window.location.href = `/materi/${materi.id + 1}`;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={materi.title} />
            <div className="max-w-7xl mx-auto my-6 p-6 border border-amber-300 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {materi.title}
                </h1>

                {/* Centering the image with 16:9 aspect ratio and responsive sizing */}
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
                        dangerouslySetInnerHTML={{ __html: materi.content }}
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
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handlePageChange}
                        className="px-8 py-3 text-white bg-amber-500 rounded-md hover:bg-amber-600 transition duration-200 ease-in-out"
                    >
                        Selanjutnya
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

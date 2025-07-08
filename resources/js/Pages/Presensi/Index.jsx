import { useActivity } from "@/Contexts/ActivityContext";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Presensi({ data }) {
    const { startActivity, stopActivity, currentPath, changePath } = useActivity();
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [remainingTime, setRemainingTime] = useState(5);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.hidden) {
                await stopActivity(); // Wait for stopActivity to complete
            } else {
                startActivity();
            }
        };

        changePath("/presensi");
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

    const handleNextClick = async () => {
        if(isButtonDisabled) {
            return;
        }
        try {
            await axios.post(`/update-progress`, {
                progress: 1,
            });
            router.get(route("test.pre"));
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Presensi" />
            <div className="container mx-auto">
                <iframe
                    src={data.link_presensi}
                    className="flex w-full h-screen"
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
                <div className="mt-4 text-center relative">
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

export default Presensi;
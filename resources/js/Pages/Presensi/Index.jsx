import { useActivity } from "@/Contexts/ActivityContext";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

function Presensi() {
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
        
        changePath("/presensi");
        startActivity();

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            stopActivity(); // Ensure stopActivity completes before cleanup
        };
    }, [currentPath]);
    return (
        <AuthenticatedLayout>
            <Head title="Test" />
            <div className="container mx-auto">
                <iframe
                    src="https://forms.gle/VZKm6NT4CthUM1yY8"
                    className=" flex w-full h-screen"
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            </div>
        </AuthenticatedLayout>
    );
}

export default Presensi;

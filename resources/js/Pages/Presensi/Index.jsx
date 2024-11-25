import { useActivity } from "@/Contexts/ActivityContext";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

function Presensi() {
    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();

    useEffect(() => {
        // Manually update the path when the component mounts
        changePath("/presensi");

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

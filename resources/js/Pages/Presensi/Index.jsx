import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

function Presensi() {

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

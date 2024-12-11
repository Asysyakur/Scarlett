import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function StudiKasus({ materi }) {
    console.log(materi);
    return (
        <AuthenticatedLayout>
            <Head title={materi.title} />
            <div className="max-w-7xl mx-auto my-6 p-6 border border-amber-300 bg-white rounded-lg shadow-md min-h-screen">
                {/* Back Link */}
                <div className="mb-4 flex justify-between items-center">
                    <Link
                        href={route("materi.index")} // Adjust this route as needed
                        className="text-amber-500 hover:text-amber-700 font-semibold"
                    >
                        Kembali ke Materi
                    </Link>
                    <Link
                        href={`/materi/${materi.id}/drag-and-drop`} // Adjust this route as needed
                        className="text-white hover:bg-amber-700 bg-amber-500 transition-all ease-in-out duration-200 font-semibold px-4 py-2 rounded"
                    >
                        Diagram Erd
                    </Link>
                </div>
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Studi Kasus: {materi.title}
                </h1>
                <div className="mb-6">
                    <iframe
                        src={`/storage/${materi.studikasusfile}`}
                        className="w-full h-[calc(100vh-160px)] rounded-md shadow-lg"
                        frameBorder="0"
                    >
                        Your browser does not support PDFs.
                    </iframe>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

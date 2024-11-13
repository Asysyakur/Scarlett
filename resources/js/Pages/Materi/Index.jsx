import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";

export default function Index({ materis }) {
    return (
        <AuthenticatedLayout header={<>Materi</>}>
            <Head title="Materi" />

            <div className="max-w-7xl mx-auto p-6">
                {/* Container for the grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
                    {materis.map((materi) => (
                        <Link
                            key={materi.id}
                            href={`/materi/${materi.id}`}
                            className="transform transition-all hover:scale-105 bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-50 hover:shadow-xl"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                {materi.title}
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                {materi.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

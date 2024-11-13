import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Monitoring() {
    const monitoringOptions = [
        { name: "Monitoring Test", href: "/monitoring/monitoring-test" },
        { name: "Aktivitas Siswa", href: "/monitoring/aktivitas-siswa" },
    ];

    return (
        <AuthenticatedLayout header={<>Monitoring</>}>
            <Head title="Monitoring" />
            <div className="max-w-7xl mx-auto p-6">
                {/* Styled grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
                    {monitoringOptions.map((option, index) => (
                        <Link
                            key={index}
                            href={option.href}
                            className="transform transition-all hover:scale-105 bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-50 hover:shadow-xl"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {option.name}
                            </h2>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import monitoringIlu from "./assets/MonitoringIlu.svg";
import activityIlu from "./assets/ActivityIlu.svg";

export default function Monitoring() {
    const monitoringOptions = [
        {
            name: "Monitoring Test",
            href: "/monitoring/monitoring-test",
            ilu: monitoringIlu,
            descriptiom: "Monitoring siswa saat mengerjakan test",
        },
        {
            name: "Aktivitas Siswa",
            href: "/monitoring/aktivitas-siswa",
            ilu: activityIlu,
            descriptiom: "Melihat aktivitas siswa selama pembelajaran",
        },
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
                            className="transform transition-all md:mx-24 mx-12 hover:scale-105 bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-50 hover:shadow-xl"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {option.name}
                            </h2>
                            <img
                                src={option.ilu}
                                alt="Test Illustration"
                                className="mx-auto max-w-[200px] md:max-w-xs mb-4" // Reduced image size
                            />
                            <p className="text-sm text-gray-600 mb-4">
                                {option.descriptiom}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

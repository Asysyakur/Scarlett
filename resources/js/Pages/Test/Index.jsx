import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PretestIlu from "./assets/PreTestIlus.svg";
import PostestIlu from "./assets/PostTestIlus.svg";

export default function Index({ tests }) {
    return (
        <AuthenticatedLayout header={<>Semua Test</>}>
            <Head title="Test" />
            <div className="max-w-7xl mx-auto p-6">
                {/* Container for the grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
                    {tests.map((test) => (
                        <Link
                            key={test.id}
                            href={`/test/${test.id}`}
                            className="transform md:mx-24 mx-12 transition-all hover:scale-105 bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-100 hover:shadow-xl"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                {test.name}
                            </h2>
                            <img
                                src={test.id === 1 ? PretestIlu : PostestIlu}
                                alt="Test Illustration"
                                className="mx-auto max-w-[200px] md:max-w-xs mb-4" // Reduced image size
                            />
                            <p className="text-sm text-gray-600 mb-4">
                                {test.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

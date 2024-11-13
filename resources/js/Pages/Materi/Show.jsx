import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

export default function Show({ materi }) {
    return (
        <AuthenticatedLayout>
            <Head title={materi.title} />
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    {materi.title}
                </h1>
                <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: materi.content }}
                ></div>
            </div>
        </AuthenticatedLayout>
    );
}

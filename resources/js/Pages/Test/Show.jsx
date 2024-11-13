import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

function TestShow({ test }) {
    if (!test) {
        return <div>Loading...</div>;
    }

    return (
        <AuthenticatedLayout>
            <Head title="Test" />
            <div className="container mx-auto">
                {test.link && (
                    <iframe
                        src={test.link}
                        className=" flex w-full h-screen"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

export default TestShow;

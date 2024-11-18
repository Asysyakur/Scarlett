import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

function DrawioEmbed({ auth, groups }) {
    // Check if user is admin (role_id === 1)
    const isAdmin = auth.user.role_id === 1;

    // Find the group that the authenticated user belongs to
    const group = groups.find((group) =>
        group.users.find((user) => user.id === auth.user.id)
    );

    return (
        <AuthenticatedLayout header={<>Buat Diagram</>}>
            <Head title="Test" />

            <div className="max-w-7xl mx-auto p-6">
                {groups.length === 0 ? (
                    // Show message if no groups are available
                    <div className="text-center text-xl text-red-500">
                        Tidak ada Kelompok yang tersedia.
                    </div>
                ) : isAdmin ? (
                    // Admin view: Display all groups in a 3-column grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className="transform transition-all hover:scale-105 bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-50 hover:shadow-xl"
                            >
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    {group.name}
                                </h2>
                                <iframe
                                    src={`${group.drawio_link}`}
                                    title={`Draw.io Diagram for ${group.name}`}
                                    className="w-full h-64"
                                    style={{ border: "none" }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    // User view: Display the diagram for the user's group
                    <div className="flex justify-center items-center w-full h-[70vh] bg-gray-100">
                        {group && (
                            <iframe
                                src={`${group.drawio_link}`}
                                title="User's Draw.io Diagram"
                                className="w-full h-full"
                                style={{ border: "none" }}
                            />
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

export default DrawioEmbed;

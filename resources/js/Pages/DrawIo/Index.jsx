import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

function DrawioEmbed({ auth, groups }) {
    // Check if user is admin (role_id === 1)
    const isAdmin = auth.user.role_id === 1;

    return (
        <AuthenticatedLayout header={<>Buat Diagram</>}>
            <Head title="Test" />

            <div className="max-w-7xl mx-auto p-6">
                {isAdmin ? (
                    // Admin view: Display all groups in a 3-column grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className="transform transition-all hover:scale-105 bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-50 hover:shadow-xl"
                            >
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    Grup {group.name}
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
                    // User view: Display only their group's diagram
                    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
                        {groups.length > 0 && (
                            <iframe
                                src={`https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Untitled%20Diagram.drawio#U${encodeURIComponent(groups[0].drawio_link)}`}
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

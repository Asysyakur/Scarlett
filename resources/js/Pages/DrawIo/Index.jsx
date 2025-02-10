import { useActivity } from "@/Contexts/ActivityContext";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function DrawioEmbed({ auth, groups, nilaiERDGroups }) {
    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();
    const [comments, setComments] = useState({});
    const [evaluations, setEvaluations] = useState({});

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.hidden) {
                await stopActivity(); // Wait for stopActivity to complete
            } else {
                startActivity();
            }
        };

        changePath(`/diagram`);
        startActivity();

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            stopActivity(); // Ensure stopActivity completes before cleanup
        };
    }, [currentPath]);

    useEffect(() => {
        const initialComments = {};
        const initialEvaluations = {};

        nilaiERDGroups.forEach((group) => {
            initialComments[group.group_id] = group.catatan || "";
            initialEvaluations[group.group_id] = group.nilai || "Belum Benar";
        });

        setComments(initialComments);
        setEvaluations(initialEvaluations);
    }, [nilaiERDGroups]);

    const handleCommentChange = (e, groupId) => {
        setComments({ ...comments, [groupId]: e.target.value });
    };

    const handleEvaluationChange = (e, groupId) => {
        setEvaluations({ ...evaluations, [groupId]: e.target.value });
    };
    const handleSubmit = (e, id) => {
        e.preventDefault();
        // Kirim data ke backend
        if (nilaiERDGroups.some((group) => group.group_id === id)) {
            axios
                .post(`/diagram/${id}/edit`, {
                    catatan: comments[id] || "",
                    nilai: evaluations[id] || "Belum Benar",
                })
                .then((response) => {
                    // Tampilkan pesan sukses
                    Swal.fire("Berhasil!", "Berhasil diubah", "success").then(
                        () => {
                            window.location.href = "/diagram";
                        }
                    );
                })
                .catch((error) => {
                    Swal.fire(
                        "Gagal!",
                        "Terjadi kesalahan saat menghapus data.",
                        "error"
                    );
                    console.error(error);
                });
        } else {
            axios
                .post(`/diagram/${id}`, {
                    catatan: comments[id] || "",
                    nilai: evaluations[id] || "Belum Benar",
                })
                .then((response) => {
                    // Tampilkan pesan sukses
                    Swal.fire("Berhasil!", "Berhasil dibuat", "success").then(
                        () => {
                            window.location.href = "/diagram";
                        }
                    );
                })
                .catch((error) => {
                    Swal.fire(
                        "Gagal!",
                        "Terjadi kesalahan saat menghapus data.",
                        "error"
                    );
                    console.error(error);
                });
        }
    };

    const isAdmin = auth.user.role_id === 1;

    // Find the group that the authenticated user belongs to
    const group = groups.find((group) =>
        group.users.find((user) => user.id === auth.user.id)
    );

    const nilaiGroup = nilaiERDGroups.find(
        (nilaiERDGroup) => nilaiERDGroup.group_id === group?.id
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
                                <form
                                    onSubmit={(e) => handleSubmit(e, group.id)}
                                    className="mt-6"
                                >
                                    <div className="mt-6">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor={`comment-${group.id}`}
                                        >
                                            Catatan:
                                        </label>
                                        <textarea
                                            id={`comment-${group.id}`}
                                            value={comments[group.id] || ""}
                                            onChange={(e) =>
                                                handleCommentChange(e, group.id)
                                            }
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            rows="4"
                                        ></textarea>
                                    </div>

                                    <div className="mt-4">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor={`evaluation-${group.id}`}
                                        >
                                            Nilai ERD:
                                        </label>
                                        <select
                                            id={`evaluation-${group.id}`}
                                            value={
                                                evaluations[group.id] ||
                                                "Belum Benar"
                                            }
                                            onChange={(e) =>
                                                handleEvaluationChange(
                                                    e,
                                                    group.id
                                                )
                                            }
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        >
                                            <option value="Belum Benar">
                                                Belum Benar
                                            </option>
                                            <option value="Benar Setelah Diperbaiki">
                                                Benar Setelah Diperbaiki
                                            </option>
                                            <option value="Benar">Benar</option>
                                        </select>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ))}
                    </div>
                ) : (
                    // User view: Display the diagram for the user's group
                    <div>
                        {group ? (
                            <>
                                <div className="flex justify-center items-center w-full h-[70vh] bg-gray-100">
                                    <iframe
                                        src={`${group.drawio_link}`}
                                        title="User's Draw.io Diagram"
                                        className="w-full h-full"
                                        style={{ border: "none" }}
                                    />
                                </div>
                                <div className="mt-6">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="comment"
                                    >
                                        Catatan:
                                    </label>
                                    {nilaiGroup?.catatan ? (
                                        <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                            {nilaiGroup?.catatan}
                                        </p>
                                    ) : (
                                        <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                            Belum ada catatan
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="evaluation"
                                    >
                                        Nilai ERD:
                                    </label>
                                    {nilaiGroup?.nilai ? (
                                        <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                            {nilaiGroup.nilai}
                                        </p>
                                    ) : (
                                        <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                            Belum dinilai
                                        </p>
                                    )}
                                </div>
                            </>
                        ):(
                            <div className="text-center text-xl text-red-500">
                                Anda belum bergabung dalam kelompok manapun.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

export default DrawioEmbed;

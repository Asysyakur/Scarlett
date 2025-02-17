import { useActivity } from "@/Contexts/ActivityContext";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function DrawioEmbed({
    auth,
    groups,
    nilaiERDGroups,
    erdUser,
    commentUser,
    usersGroups,
}) {
    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();
    const uniqueErdUser = Array.from(
        new Map(erdUser.map((item) => [item.user_id, item])).values()
    );
    const [comments, setComments] = useState({});
    const [evaluations, setEvaluations] = useState({});
    const [activeTab, setActiveTab] = useState("diagramAnggota");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedErdUser, setSelectedErdUser] = useState(null);
    const [pembagianTugas, setPembagianTugas] = useState(null);

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

    const openModal = (image, userId, erdUserId) => {
        setSelectedImage(image);
        setSelectedUserId(userId);
        setSelectedErdUser(erdUserId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setSelectedUserId(null);
        setIsModalOpen(false);
    };

    const handleComment = (e, userId, erdUserId) => {
        e.preventDefault();
        axios
            .post(`/comment`, {
                comment: comments[userId] || "",
                erd_user_id: erdUserId,
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
    };

    const isAdmin = auth.user.role_id === 1;

    // Find the group that the authenticated user belongs to
    const group = groups.find((group) =>
        group.users.find((user) => user.id === auth.user.id)
    );

    const nilaiGroup = nilaiERDGroups.find(
        (nilaiERDGroup) => nilaiERDGroup.group_id === group?.id
    );

    useEffect(() => {
        setPembagianTugas(nilaiGroup?.task);
    }, [nilaiGroup]);

    const handleTask = async (e, id) => {
        e.preventDefault();
        try {
            await axios.post(`/diagram/${id}/task`, {
                task: pembagianTugas,
            });
            Swal.fire(
                "Berhasil!",
                "Pembagian tugas berhasil disimpan",
                "success"
            );
        } catch (error) {
            Swal.fire(
                "Gagal!",
                "Terjadi kesalahan saat menyimpan pembagian tugas",
                "error"
            );
        }
    };
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
                    <div className="max-w-7xl mx-auto p-6">
                        <div className="flex justify-center gap-6 mb-4">
                            <button
                                onClick={() => setActiveTab("diagramAnggota")}
                                className={`px-4 py-2 rounded-t-lg ${
                                    activeTab === "diagramAnggota"
                                        ? "bg-amber-500 text-white"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                Diagram Anggota
                            </button>
                            <button
                                onClick={() => setActiveTab("diagramKelompok")}
                                className={`px-4 py-2 rounded-t-lg ${
                                    activeTab === "diagramKelompok"
                                        ? "bg-amber-500 text-white"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                Diagram Kelompok
                            </button>
                        </div>

                        {activeTab === "diagramAnggota" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {uniqueErdUser.map((erdUser) => (
                                    <div
                                        key={erdUser.user_id}
                                        className="bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-50 hover:shadow-xl cursor-pointer"
                                        onClick={() =>
                                            openModal(
                                                `storage/${erdUser.screenshoot}`,
                                                erdUser.user_id,
                                                erdUser.id
                                            )
                                        }
                                    >
                                        <div className="text-lg font-semibold text-gray-800 mb-4">
                                            {
                                                group.users.find(
                                                    (user) =>
                                                        user.id ===
                                                        erdUser.user_id
                                                ).name
                                            }
                                        </div>
                                        <div className="flex justify-center items-center w-full h-[30vh] bg-gray-100">
                                            <img
                                                src={`storage/${erdUser.screenshoot}`}
                                                alt={`Screenshot of ${erdUser.id}`}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "diagramKelompok" && (
                            <div>
                                {group ? (
                                    <>
                                        {/* Tampilan Diagram */}
                                        <div className="flex justify-center items-center w-full h-[70vh] bg-gray-100">
                                            <iframe
                                                src={`${group.drawio_link}`}
                                                title="User's Draw.io Diagram"
                                                className="w-full h-full"
                                                style={{ border: "none" }}
                                            />
                                        </div>

                                        {/* Pembagian Tugas */}
                                        {usersGroups.find(
                                            (userGroup) =>
                                                userGroup.group_id ===
                                                    group.id &&
                                                userGroup.user_id ===
                                                    auth.user.id
                                        )?.is_leader ? (
                                            <form
                                                className="mt-6"
                                                onSubmit={(e) =>
                                                    handleTask(e, group.id)
                                                }
                                            >
                                                <label
                                                    htmlFor="taskAssignment"
                                                    className="block text-gray-700 text-sm font-bold mb-2"
                                                >
                                                    Pembagian Tugas:
                                                </label>
                                                <textarea
                                                    id="taskAssignment"
                                                    name="taskAssignment"
                                                    value={pembagianTugas || ""}
                                                    onChange={(e) =>
                                                        setPembagianTugas(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Masukkan pembagian tugas"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                                <button
                                                    type="submit"
                                                    className="mt-4 bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                >
                                                    Kirim
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="mt-6">
                                                <label
                                                    htmlFor="taskAssignment"
                                                    className="block text-gray-700 text-sm font-bold mb-2"
                                                >
                                                    Pembagian Tugas:
                                                </label>
                                                {pembagianTugas ? (
                                                    <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                        {pembagianTugas}
                                                    </p>
                                                ) : (
                                                    <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                        Belum ada catatan
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Catatan */}
                                        <div className="mt-6">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
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

                                        {/* Nilai ERD */}
                                        <div className="mt-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
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
                                ) : (
                                    <div className="text-center text-xl text-red-500">
                                        Anda belum bergabung dalam kelompok
                                        manapun.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={closeModal} // Klik luar akan menutup modal
                >
                    <div
                        className="bg-white p-4 rounded shadow-lg flex flex-col max-w-5xl relative"
                        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutupnya
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <div className="flex justify-center items-center mb-4">
                            <img
                                src={selectedImage}
                                alt="Enlarged screenshot"
                                className="max-w-full max-h-full"
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="font-semibold mb-4">
                                Komentar{" "}
                                {
                                    commentUser.filter(
                                        (comment) =>
                                            comment.erd_user_id ===
                                            selectedErdUser
                                    ).length
                                }
                            </h2>
                            <div className="overflow-y-auto max-h-64">
                                {commentUser
                                    .filter(
                                        (comment) =>
                                            comment.erd_user_id ===
                                            selectedErdUser
                                    )
                                    .map((comment) => (
                                        <div key={comment.id} className="mb-2">
                                            {/* Nama dan Tanggal */}
                                            <div className="flex justify-between items-center">
                                                <div className="font-semibold">
                                                    {comment.user.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(
                                                        comment.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                            {/* Isi Komentar */}
                                            <div>{comment.comment}</div>
                                            <hr />
                                        </div>
                                    ))}
                            </div>

                            <div className="mb-4">
                                <textarea
                                    value={comments[selectedUserId] || ""}
                                    onChange={(e) =>
                                        handleCommentChange(e, selectedUserId)
                                    }
                                    placeholder="Masukan Komentar"
                                    className="w-full p-2 border rounded"
                                    rows="1"
                                ></textarea>
                            </div>
                            <button
                                onClick={(e) =>
                                    handleComment(
                                        e,
                                        selectedUserId,
                                        selectedErdUser
                                    )
                                }
                                className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

export default DrawioEmbed;

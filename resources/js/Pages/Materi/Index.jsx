import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import IluMateriAwal from "./assets/MateriAwal.svg";
import IluMateriAdvance from "./assets/MateriAdvance.svg";
import { useActivity } from "@/Contexts/ActivityContext";
import Swal from "sweetalert2";

export default function Index({ materis: initialMateri, auth }) {
    const [materis, setMateris] = useState(initialMateri || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // To toggle between add and edit mode
    const [selectedMateri, setSelectedMateri] = useState(null); // To store the materi being edited
    const [newMateri, setNewMateri] = useState({
        title: "",
        description: "",
        content: "",
        video: "",
        image: null,
        file: null,
        dnd: false,
        studikasus: false,
        studikasusfile: null,
    });
    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Manually update the path when the component mounts
        changePath("/materi");

        // Start activity when page is loaded or path changes
        startActivity();

        // Event listener to stop/resume activity on tab visibility change
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopActivity();
            } else {
                startActivity();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            stopActivity(); // Ensure activity is stopped when component unmounts
        };
    }, [currentPath]); // Depend on functions and manually updating path

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMateri((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newMateri.title) newErrors.title = "Title wajib diisi.";
        if (!newMateri.content) newErrors.content = "Konten wajib diisi.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form before proceeding
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("title", newMateri.title);
        formData.append("description", newMateri.description);
        formData.append("content", newMateri.content || "");
        formData.append("video", newMateri.video || "");
        formData.append("dnd", newMateri.dnd ? "true" : "false");
        formData.append("studikasus", newMateri.studikasus ? "true" : "false");

        // Add files if they exist
        if (newMateri.image) {
            formData.append("image", newMateri.image);
        }
        if (newMateri.file) {
            formData.append("file", newMateri.file);
        }
        if (newMateri.studikasusfile) {
            formData.append("studikasusfile", newMateri.studikasusfile);
        }

        try {
            let response;

            if (isEditing) {
                // Update materi
                response = await axios.post(
                    `/materi/${selectedMateri.id}`,
                    formData
                );
                console.log(response);

                // Success response
                Swal.fire({
                    icon: "success",
                    title: "Materi Updated Successfully!",
                    text: "Your materi has been updated.",
                    timer: 1000, // Dismiss after 3 seconds
                    showConfirmButton: false,
                }).then(() => {
                    // Reset form and close modal after Swal
                    setIsModalOpen(false);
                    setIsEditing(false);
                    setSelectedMateri(null);

                    // Reset form data and reload the page
                    setNewMateri({
                        title: "",
                        description: "",
                        content: "",
                        video: "",
                        image: null,
                        file: null,
                        dnd: false,
                        studikasus: false,
                        studikasusfile: null,
                    });

                    window.location.reload();
                });
            } else {
                // Add new materi
                response = await axios.post("/materi", formData);

                // Success response
                Swal.fire({
                    icon: "success",
                    title: "Materi Added Successfully!",
                    text: "Your new materi has been added.",
                    timer: 1000, // Dismiss after 3 seconds
                    showConfirmButton: false,
                }).then(() => {
                    // Reset form and close modal after Swal
                    setIsModalOpen(false);

                    // Reset form data and reload the page
                    setNewMateri({
                        title: "",
                        description: "",
                        content: "",
                        video: "",
                        image: null,
                        file: null,
                        dnd: false,
                        studikasus: false,
                        studikasusfile: null,
                    });

                    window.location.reload();
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);

            // Show error toast if submission fails
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: "There was an error submitting your form. Please try again.",
                timer: 1000,
                showConfirmButton: false,
            });
        }
    };

    const handleEditClick = (materi) => {
        setIsEditing(true);
        setSelectedMateri(materi);
        setNewMateri({
            title: materi.title,
            description: materi.description,
            content: materi.content,
            video: materi.video,
            image: null,
            file: null,
            dnd: materi.dnd,
            studikasus: materi.studikasus,
            studikasusfile: null,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (materi) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#f59e0b",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Adjusted to delete materi
                    await axios.delete(`/materi/${materi.id}`);
                    // Remove the deleted materi from the list (this part depends on your state management)
                    setMateris((prevMateris) =>
                        prevMateris.filter((m) => m.id !== materi.id)
                    );
                    Swal.fire(
                        "Berhasil!",
                        "Materi berhasil dihapus.",
                        "success"
                    );
                } catch (error) {
                    console.error("Error saat menghapus materi: ", error);
                    Swal.fire(
                        "Gagal!",
                        "Terjadi kesalahan saat menghapus materi.",
                        "error"
                    );
                }
            }
        });
    };

    const handleCloseModal = () => {
        return () => {
            setIsModalOpen(false);
            setIsEditing(false);
            setSelectedMateri(null);
            setNewMateri({
                title: "",
                description: "",
                content: "",
                link: "",
                video: "",
                image: null,
                file: null,
                studikasusfile: null,
            });
        };
    };

    const modalRef = useRef();

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsModalOpen(false);
                setIsEditing(false);
                setSelectedMateri(null);
                setNewMateri({
                    title: "",
                    description: "",
                    content: "",
                    link: "",
                    video: "",
                    image: null,
                    file: null,
                    studikasusfile: null,
                });
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <AuthenticatedLayout header={<>Materi</>}>
            <Head title="Materi" />

            <div className="max-w-7xl mx-auto p-6">
                {/* Render Add Materi button if the user is an admin */}
                {auth.user?.role_id === 1 && (
                    <div className="text-right mb-10 -mt-20">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-block bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-all"
                        >
                            Tambah Materi
                        </button>
                    </div>
                )}

                {/* Modal for adding/editing materi */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                        <div
                            ref={modalRef}
                            className="bg-white mt p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-hidden"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                {isEditing ? "Edit Materi" : "Tambah Materi"}
                            </h3>
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 overflow-y-auto max-h-[70vh] px-4" // Added padding-right for scrollbar visibility
                            >
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newMateri.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                    {errors.title && (
                                        <p className="text-red-500">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newMateri.description}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Content
                                    </label>
                                    <textarea
                                        name="content"
                                        value={newMateri.content}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    ></textarea>
                                    {errors.content && (
                                        <p className="text-red-500">
                                            {errors.content}
                                        </p>
                                    )}
                                </div>

                                {/* File Uploads */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setNewMateri((prev) => ({
                                                ...prev,
                                                image: e.target.files[0],
                                            }))
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Video URL
                                    </label>
                                    <input
                                        type="url"
                                        name="video"
                                        value={newMateri.video || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        File
                                    </label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) =>
                                            setNewMateri((prev) => ({
                                                ...prev,
                                                file: e.target.files[0],
                                            }))
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                        <input
                                            type="checkbox"
                                            name="dnd"
                                            checked={newMateri.dnd}
                                            onChange={(e) =>
                                                setNewMateri((prev) => ({
                                                    ...prev,
                                                    dnd: e.target.checked,
                                                }))
                                            }
                                            className="mr-2"
                                        />
                                        Drag and Drop
                                    </label>
                                </div>
                                <div className="mb-4">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                        <input
                                            type="checkbox"
                                            name="studikasus"
                                            checked={newMateri.studikasus}
                                            onChange={(e) =>
                                                setNewMateri((prev) => ({
                                                    ...prev,
                                                    studikasus:
                                                        e.target.checked,
                                                }))
                                            }
                                            className="mr-2"
                                        />
                                        Studi Kasus
                                    </label>
                                    {newMateri.studikasus ? (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Upload File
                                            </label>
                                            <input
                                                type="file"
                                                onChange={(e) =>
                                                    setNewMateri((prev) => ({
                                                        ...prev,
                                                        studikasusfile:
                                                            e.target.files[0],
                                                    }))
                                                }
                                                className="p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                <div className="flex justify-between pb-6">
                                    <button
                                        type="submit"
                                        className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal()}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Container for the grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
                    {materis.map((materi) => (
                        <div key={materi.id} className="relative">
                            <Link
                                href={`/materi/${materi.id}`}
                                className="transform flex flex-col md:mx-24 mx-12 transition-all hover:scale-105 bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-100 hover:shadow-xl"
                            >
                                <img
                                    src={
                                        materi.id % 2 !== 0
                                            ? IluMateriAwal
                                            : IluMateriAdvance
                                    }
                                    alt="Test Illustration"
                                    className="mx-auto max-w-[200px] md:max-w-xs mb-4" // Reduced image size
                                />
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    {materi.title}
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    {materi.description}
                                </p>
                            </Link>

                            {/* Edit Button */}
                            {auth.user?.role_id === 1 && (
                                <div className="absolute top-2 right-2 flex flex-col gap-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the card link from being clicked
                                            handleEditClick(materi);
                                        }}
                                        className="  bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(materi)}
                                        className="  bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

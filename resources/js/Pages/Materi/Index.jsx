import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import IluMateriAwal from "./assets/MateriAwal.svg";
import IluMateriAdvance from "./assets/MateriAdvance.svg";

export default function Index({ materis, auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // To toggle between add and edit mode
    const [selectedMateri, setSelectedMateri] = useState(null); // To store the materi being edited
    const [newMateri, setNewMateri] = useState({
        title: "",
        description: "",
        content: "",
        link: "",
        video: "",
        image: null,
        file: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMateri((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", newMateri.title);
        formData.append("description", newMateri.description);
        formData.append("content", newMateri.content || "");
        formData.append("link", newMateri.link || "");
        formData.append("video", newMateri.video || "");

        // Add files if they exist
        if (newMateri.image) {
            formData.append("image", newMateri.image);
        }
        if (newMateri.file) {
            formData.append("file", newMateri.file);
        }

        // Submit the form via Inertia for adding or updating
        if (isEditing) {
            // Update materi
            console.log(formData);
            const response = await axios
                .post(`/materi/${selectedMateri.id}`, formData)
                .then(() => {
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
                    });
                    window.location.reload();
                });
            console.log(response);
        } else {
            // Add new materi
            await axios.post("/materi", formData).then(() => {
                setIsModalOpen(false);
                setNewMateri({
                    title: "",
                    description: "",
                    content: "",
                    link: "",
                    video: "",
                    image: null,
                    file: null,
                });
                window.location.reload();
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
            link: materi.link,
            video: materi.video,
            image: null,
            file: null,
        });
        setIsModalOpen(true);
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
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Link
                                    </label>
                                    <input
                                        type="text"
                                        name="link"
                                        value={newMateri.link}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
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
                                        required
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
                                        required
                                    ></textarea>
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
                        <div
                            key={materi.id}
                            className="relative"
                        >
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
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent the card link from being clicked
                                        handleEditClick(materi);
                                    }}
                                    className="absolute top-2 right-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PretestIlu from "./assets/PreTestIlus.svg";
import PostestIlu from "./assets/PostTestIlus.svg";
import { useActivity } from "@/Contexts/ActivityContext";
import Swal from "sweetalert2";

export default function Index({ tests: initialTests, auth }) {
    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();

    const [tests, setTests] = useState(initialTests || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [newTest, setNewTest] = useState({
        name: "",
        description: "",
        link: "",
    });

    const modalRef = useRef();

    useEffect(() => {
        changePath("/test");
        startActivity();

        const handleVisibilityChange = () => {
            if (document.hidden) stopActivity();
            else startActivity();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            stopActivity();
        };
    }, [currentPath]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTest((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", newTest.name);
        formData.append("description", newTest.description);
        formData.append("link", newTest.link);

        try {
            let response;

            if (isEditing) {
                // Update the test
                response = await axios.post(
                    `/test/${selectedTest.id}`,
                    formData
                );

                // Success response
                Swal.fire({
                    icon: "success",
                    title: "Test Updated Successfully!",
                    text: "The test has been updated.",
                    timer: 1000, // Dismiss after 3 seconds
                    showConfirmButton: false,
                }).then(() => {
                    // Reload after Swal closes
                    setIsModalOpen(false);
                    resetForm();
                    window.location.reload();
                });
            } else {
                // Add new test
                response = await axios.post("/test", formData);

                // Success response
                Swal.fire({
                    icon: "success",
                    title: "Test Added Successfully!",
                    text: "The new test has been added.",
                    timer: 1000, // Dismiss after 3 seconds
                    showConfirmButton: false,
                }).then(() => {
                    // Reload after Swal closes
                    setIsModalOpen(false);
                    resetForm();
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

    const handleDelete = async (test) => {
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
                    await axios.delete(`/test/${test.id}`);
                    setTests((prevTests) =>
                        prevTests.filter((t) => t.id !== test.id)
                    );
                    Swal.fire("Berhasil!", "Test berhasil dihapus.", "success");
                } catch (error) {
                    console.error("Error saat menghapus test: ", error);
                    Swal.fire(
                        "Gagal!",
                        "Terjadi kesalahan saat menghapus test.",
                        "error"
                    );
                }
            }
        });
    };

    const handleEditClick = (test) => {
        setSelectedTest(test);
        setNewTest({
            name: test.name || "",
            description: test.description || "",
            link: test.link || "",
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedTest(null);
        setNewTest({
            name: "",
            description: "",
            link: "",
        });
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                resetForm();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <AuthenticatedLayout header={<>Semua Test</>}>
            <Head title="Test" />

            <div className="max-w-7xl mx-auto p-6">
                {/* Tombol Tambah Test hanya untuk Admin */}
                {auth.user?.role_id === 1 && (
                    <div className="text-right mb-10 -mt-20">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-block bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-all"
                        >
                            Tambah Test
                        </button>
                    </div>
                )}

                {/* Modal Tambah/Edit Test */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                        <div
                            ref={modalRef}
                            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-hidden"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                {isEditing ? "Edit Test" : "Tambah Test"}
                            </h3>
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 overflow-y-auto max-h-[70vh] px-4"
                            >
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nama Test
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newTest.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newTest.description}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Link test
                                    </label>
                                    <input
                                        type="text"
                                        name="link"
                                        value={newTest.link}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
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
                                        onClick={resetForm}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-2 text-center">
                    {tests.map((test) => (
                        <div key={test.id} className="relative">
                            <Link
                                key={test.id}
                                href={`/test/${test.id}`}
                                className="transform flex flex-col md:mx-24 mx-6 transition-all hover:scale-105 bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-100 hover:shadow-xl"
                            >
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    {test.name}
                                </h2>
                                <img
                                    src={
                                        test.id === 1 ? PretestIlu : PostestIlu
                                    }
                                    alt="Test Illustration"
                                    className="mx-auto max-w-[200px] md:max-w-xs mb-4" // Reduced image size
                                />
                                <p className="text-sm text-gray-600 mb-4">
                                    {test.description}
                                </p>
                            </Link>
                            {auth.user?.role_id === 1 && (
                                <div className="absolute top-2 right-2 flex flex-col gap-4">
                                    <button
                                        onClick={() => handleEditClick(test)}
                                        className="  bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(test)}
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

import { useActivity } from "@/Contexts/ActivityContext";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Dashboard({ auth, data }) {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [formValues, setFormValues] = useState({
        presensiLink: data?.link_presensi || "",
        capaianPembelajaran: data?.capaian_pembelajaran || "",
        tujuanPembelajaran: data?.tujuan_pembelajaran || "",
        identitasPembelajaran: data?.identitas_pembelajaran || "",
    });

    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.hidden) {
                await stopActivity(); // Wait for stopActivity to complete
            } else {
                startActivity();
            }
        };

        changePath("/dashboard");
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

    // Toggle modal visibility
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send data to the server
            const response = await axios.post("/dashboard/update", {
                link_presensi: formValues.presensiLink,
                capaian_pembelajaran: formValues.capaianPembelajaran,
                tujuan_pembelajaran: formValues.tujuanPembelajaran,
                identitas_pembelajaran: formValues.identitasPembelajaran,
            });

            // Display success toast
            Swal.fire({
                icon: "success",
                title: "Form Submitted Successfully!",
                text: "Your data has been updated.",
                timer: 3000, // Dismiss after 3 seconds
                showConfirmButton: false,
            });

            // Close the modal
            toggleModal();

            // Reload the page
            router.reload();
        } catch (error) {
            console.error("Error submitting form:", error);

            // Show error toast if submission fails
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: "There was an error submitting your form. Please try again.",
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    return (
        <AuthenticatedLayout header={<>Dashboard</>}>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto px-6 space-y-6">
                <h2 className="text-2xl font-semibold text-red-700 mb-4">
                    Step Open Inquiry : Identifying Problem
                </h2>
                {/* Banner for Attendance Reminder */}
                {auth?.user.id === 1 && (
                    <div className="w-full">
                        <button
                            onClick={toggleModal}
                            className="text-white hover:bg-amber-700 bg-amber-500 transition-all ease-in-out duration-200 font-semibold px-4 py-2 rounded"
                        >
                            Edit
                        </button>
                    </div>
                )}
                <Link
                    href="/presensi"
                    className="flex mb-6 p-6 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-red-700">
                            Klik disini untuk melakukan presensi
                        </span>
                    </div>
                </Link>

                {/* Main Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Card Capaian Pembelajaran */}
                    <div className="overflow-hidden border border-amber-300 bg-white shadow-lg rounded-lg transform transition hover:scale-105 hover:shadow-lg">
                        <div className="p-6 text-gray-800">
                            <h3 className="text-xl font-semibold text-red-700">
                                Capaian Pembelajaran
                            </h3>
                            <p className="mt-4 text-gray-600">
                                {data
                                    ? data?.capaian_pembelajaran
                                    : "data kosong"}
                            </p>
                        </div>
                    </div>

                    {/* Card Tujuan Pembelajaran */}
                    <div className="overflow-hidden border border-amber-300 bg-white shadow-lg rounded-lg transform transition hover:scale-105 hover:shadow-lg">
                        <div className="p-6 text-gray-800">
                            <h3 className="text-xl font-semibold text-red-700">
                                Tujuan Pembelajaran
                            </h3>
                            <ol className="mt-4 text-gray-600 list-decimal list-inside">
                                <li>
                                    Peserta didik dapat menjelaskan konsep dasar
                                    ERD, termasuk entitas, atribut, relasi, dan
                                    komponen utama lainnya dengan benar.
                                </li>
                                <li>
                                    Peserta didik dapat mengidentifikasi
                                    entitas, atribut, primary key, foreign key,
                                    dan hubungan antar-entitas berdasarkan studi
                                    kasus yang diberikan.
                                </li>
                                <li>
                                    Peserta didik dapat menentukan jenis
                                    kardinalitas (one-to-one, one-to-many,
                                    many-to-many) dalam relasi antar-entitas
                                    sesuai kebutuhan sistem.
                                </li>
                                <li>
                                    Peserta didik dapat merancang ERD yang
                                    memuat entitas, atribut, relasi,
                                    kardinalitas, primary key, dan foreign key
                                    berdasarkan studi kasus yang relevan.
                                </li>
                                <li>
                                    Peserta didik dapat melakukan evaluasi dan
                                    revisi terhadap ERD yang telah dibuat untuk
                                    memastikan kesesuaian dengan kebutuhan
                                    sistem.
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Card Identitas Pembelajaran */}
                <div className="overflow-hidden border border-amber-300 bg-white shadow-lg rounded-lg mt-6 transition-transform transform hover:scale-105 hover:shadow-lg">
                    <div className="p-6 text-gray-800">
                        <h3 className="text-xl font-semibold text-red-700">
                            Identitas Pembelajaran
                        </h3>
                        <p className="mt-4 text-gray-600">
                            {data
                                ? data?.identitas_pembelajaran
                                : "data kosong"}
                        </p>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                        <h2 className="text-xl font-semibold mb-4">
                            Edit Dashboard
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Link Presensi
                                </label>
                                <input
                                    type="text"
                                    name="presensiLink"
                                    value={formValues.presensiLink}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Capaian Pembelajaran
                                </label>
                                <input
                                    type="text"
                                    name="capaianPembelajaran"
                                    value={formValues.capaianPembelajaran}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Tujuan Pembelajaran
                                </label>
                                <input
                                    type="text"
                                    name="tujuanPembelajaran"
                                    value={formValues.tujuanPembelajaran}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Identitas Pembelajaran
                                </label>
                                <input
                                    type="text"
                                    name="identitasPembelajaran"
                                    value={formValues.identitasPembelajaran}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                                >
                                    Simpan
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="text-gray-500 px-4 py-2 hover:text-gray-700"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

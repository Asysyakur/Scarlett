import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import * as XLSX from "xlsx"; // Import pustaka xlsx
import Swal from "sweetalert2"; // Import SweetAlert2

const MonitoringPage = ({ activities }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredActivities, setFilteredActivities] = useState([]);
    const activitiesPerPage = 10;

    useEffect(() => {
        const filtered = Object.values(activities).filter((activity) =>
            activity.user_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredActivities(filtered);
    }, [searchQuery, activities]);

    const indexOfLastActivity = currentPage * activitiesPerPage;
    const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
    const currentActivities = filteredActivities.slice(
        indexOfFirstActivity,
        indexOfLastActivity
    );

    const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleDownloadExcel = () => {
        // Format data untuk Excel
        const dataForExcel = filteredActivities.map((activity, index) => ({
            "No": index + 1,
            "User ID": activity.user_id,
            Nama: activity.user_name,
            "Total Durasi":
                activity.total_duration < 60
                    ? `${activity.total_duration} detik`
                    : activity.total_duration < 3600
                    ? `${(activity.total_duration / 60).toFixed(2)} menit`
                    : `${(activity.total_duration / 3600).toFixed(2)} jam`,
        }));

        // Buat worksheet dan workbook
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Aktivitas Siswa");

        // Unduh file Excel
        XLSX.writeFile(workbook, "AktivitasSiswa.xlsx");
    };

    const confirmDownloadExcel = () => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data akan diunduh sebagai file Excel.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, unduh!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDownloadExcel(); // Unduh file jika dikonfirmasi
                Swal.fire("Berhasil!", "File Excel telah diunduh.", "success");
            }
        });
    };

    return (
        <AuthenticatedLayout header={<>Monitoring Aktivitas Siswa</>}>
            <Head title="Monitoring" />
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center mb-4">
                    {/* Button to go back */}
                    <Link
                        href="/monitoring"
                        className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
                    >
                        &larr; Kembali
                    </Link>

                    {/* Input pencarian dan tombol unduh Excel */}
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 border rounded-lg shadow"
                        />
                        <button
                            onClick={confirmDownloadExcel} // Gunakan Swal untuk konfirmasi
                            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                        >
                            Unduh Excel
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto shadow rounded-lg mt-6">
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead className="bg-red-500 text-amber-200">
                            <tr>
                                <th className="border border-red-500 px-4 py-2 text-left">
                                    User ID
                                </th>
                                <th className="border border-red-500 px-4 py-2 text-left">
                                    Nama
                                </th>
                                <th className="border border-red-500 px-4 py-2 text-left">
                                    Total Durasi
                                </th>
                                <th className="border border-red-500 px-4 py-2 text-left">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentActivities.map((activity, index) => (
                                <tr
                                    key={index}
                                    className={
                                        index % 2 === 0
                                            ? "bg-gray-50"
                                            : "bg-white"
                                    }
                                >
                                    <td className="border border-gray-300 px-4 py-2">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {activity.user_name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {activity.total_duration < 60
                                            ? `${activity.total_duration} detik`
                                            : activity.total_duration < 3600
                                            ? `${(
                                                  activity.total_duration / 60
                                              ).toFixed(2)} menit`
                                            : `${(
                                                  activity.total_duration / 3600
                                              ).toFixed(2)} jam`}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Link
                                            href={`/monitoring/aktivitas-siswa/${activity.user_id}`}
                                            className="bg-blue-500 text-white px-3 py-1 rounded shadow"
                                        >
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination buttons */}
                <div className="flex justify-between mt-4 items-center">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 disabled:opacity-50"
                    >
                        &larr; Previous
                    </button>
                    <span className="font-semibold">
                        Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 disabled:opacity-50"
                    >
                        Next &rarr;
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default MonitoringPage;
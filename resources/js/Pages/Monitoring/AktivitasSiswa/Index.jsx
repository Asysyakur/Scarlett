import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

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

    return (
        <AuthenticatedLayout header={<>Monitoring Aktivitas Siswa</>}>
            <Head title="Monitoring" />
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center">
                    {/* Button to go back */}
                    <div>
                        <Link
                            href="/monitoring"
                            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
                        >
                            &larr; Kembali
                        </Link>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border rounded-lg shadow"
                    />
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
                                            ? `${
                                                  activity.total_duration
                                              } detik`
                                            : activity.total_duration <
                                              3600
                                            ? `${(
                                                  (activity.total_duration) /
                                                  60
                                              ).toFixed(2)} menit`
                                            : `${(
                                                  (activity.total_duration) /
                                                  3600
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

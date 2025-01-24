import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

const MonitoringDetailPage = ({ user, activities }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortCriteria, setSortCriteria] = useState("path");
    const [sortDirection, setSortDirection] = useState("asc");
    const activitiesPerPage = 10;

    const sortActivities = (a, b) => {
        if (sortCriteria === "path") {
            if (a.path < b.path) return sortDirection === "asc" ? -1 : 1;
            if (a.path > b.path) return sortDirection === "asc" ? 1 : -1;
        } else if (sortCriteria === "duration") {
            if (a.duration < b.duration)
                return sortDirection === "asc" ? -1 : 1;
            if (a.duration > b.duration)
                return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
    };

    const activityArray = Object.values(activities).sort(sortActivities);

    const indexOfLastActivity = currentPage * activitiesPerPage;
    const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
    const currentActivities = activityArray.slice(
        indexOfFirstActivity,
        indexOfLastActivity
    );

    const totalPages = Math.ceil(activityArray.length / activitiesPerPage);

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

    const handleSort = (criteria) => {
        if (sortCriteria === criteria) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortCriteria(criteria);
            setSortDirection("asc");
        }
    };

    return (
        <AuthenticatedLayout header={<h2>Detail Aktivitas</h2>}>
            <Head title={`Detail Aktivitas`} />
            <div className="max-w-7xl mx-auto px-6 mb-6 ">
                <div className="flex items-center justify-between">
                    <Link
                        href="/monitoring/aktivitas-siswa"
                        className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
                    >
                        &larr; Kembali
                    </Link>
                    <h2 className="text-xl font-semibold">
                        Aktivitas Siswa: {user.name}
                    </h2>
                </div>
                <div className="overflow-x-auto shadow rounded-lg mt-4">
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead className="bg-red-500 text-amber-200">
                            <tr>
                                <th
                                    className="border border-red-500 px-4 py-2 text-left cursor-pointer"
                                    onClick={() => handleSort("path")}
                                >
                                    Halaman{" "}
                                    {sortCriteria === "path" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    className="border border-red-500 px-4 py-2 text-left cursor-pointer"
                                    onClick={() => handleSort("duration")}
                                >
                                    Durasi{" "}
                                    {sortCriteria === "duration" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentActivities.map((activity, index) => (
                                <tr
                                    key={index}
                                    className={
                                        index % 2 === 0
                                            ? "bg-amber-50"
                                            : "bg-white"
                                    }
                                >
                                    <td className="border border-gray-200 px-4 py-2">
                                        {activity.path}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2">
                                        {activity.duration < 60
                                            ? `${activity.duration} detik`
                                            : activity.duration < 3600
                                            ? `${(
                                                  activity.duration / 60
                                              ).toFixed(2)} menit`
                                            : `${(
                                                  activity.duration / 3600
                                              ).toFixed(2)} jam`}
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

export default MonitoringDetailPage;

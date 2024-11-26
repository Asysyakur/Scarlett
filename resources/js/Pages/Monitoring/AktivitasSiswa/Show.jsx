import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

const MonitoringDetailPage = ({ user, activities }) => {
    return (
        <AuthenticatedLayout header={<h2>Detail Aktivitas</h2>}>
            <Head title={`Detail Aktivitas`} />
            <div className="max-w-7xl mx-auto px-6 ">
                
                <h2 className="text-xl font-semibold mb-4">
                    Aktivitas Siswa: {user.name}
                </h2>
                <div className="overflow-x-auto shadow rounded-lg mt-6">
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Halaman
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Durasi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((activity, index) => (
                                <tr
                                    key={index}
                                    className={
                                        index % 2 === 0
                                            ? "bg-gray-50"
                                            : "bg-white"
                                    }
                                >
                                    <td className="border border-gray-300 px-4 py-2">
                                        {activity.path}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {(activity.duration * -1) < 60
                                            ? `${(activity.duration * -1)} detik`
                                            : `${(
                                                (activity.duration * -1) / 60
                                              ).toFixed(2)} menit`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Button to go back */}
                <div className="mt-4">
                    <Link
                        href="/monitoring/aktivitas-siswa"
                        className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
                    >
                        &larr; Kembali
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default MonitoringDetailPage;

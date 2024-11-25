import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

const MonitoringPage = ({ activities }) => {
    const [currentActivity, setCurrentActivity] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [isTabActive, setIsTabActive] = useState(true);

    // Convert the activities object into an array
    const activityArray = Object.values(activities);

    const handlePageClick = (page) => {
        const endTime = new Date();
        if (currentActivity) {
            const duration = Math.floor((endTime - startTime) / 1000);
            updateActivityDuration(currentActivity.page, duration);
        }

        setCurrentActivity({ page, student });
        setStartTime(new Date());
    };

    const updateActivityDuration = (page, additionalDuration) => {
        setActivities((prev) =>
            prev.map((activity) =>
                activity.page === page
                    ? {
                          ...activity,
                          duration: activity.duration + additionalDuration,
                      }
                    : activity
            )
        );
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            setIsTabActive(false);
            if (currentActivity) {
                const endTime = new Date();
                const duration = Math.floor((endTime - startTime) / 1000);
                updateActivityDuration(currentActivity.page, duration);
            }
        } else {
            setIsTabActive(true);
            setStartTime(new Date());
        }
    };

    useEffect(() => {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [currentActivity, startTime]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (currentActivity) {
                const endTime = new Date();
                const duration = Math.floor((endTime - startTime) / 1000);
                updateActivityDuration(currentActivity.page, duration);
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [currentActivity, startTime]);

    return (
        <AuthenticatedLayout header={<>Monitoring Aktivitas Siswa</>}>
            <Head title="Monitoring" />
            <div className="max-w-7xl mx-auto px-6">
                <div className="overflow-x-auto shadow rounded-lg mt-6">
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    User ID
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Nama
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Total Durasi
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {activityArray.map((activity, index) => (
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
                                        {activity.total_duration * -1 < 60
                                            ? `${
                                                  activity.total_duration * -1
                                              } detik`
                                            : `${(
                                                  (activity.total_duration *
                                                      -1) /
                                                  60
                                              ).toFixed(2)} menit`}
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
                {/* Button to go back */}
                <div className="mt-4">
                    <Link
                        href="/monitoring"
                        className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
                    >
                        &larr; Kembali
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default MonitoringPage;

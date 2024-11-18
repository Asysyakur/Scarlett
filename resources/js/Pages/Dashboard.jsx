import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Dashboard({auth}) {
    const [test, setTest] = useState([]);
    
    useEffect(() => {
    }, []);

    return (
        <AuthenticatedLayout header={<>Dashboard</>}>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Banner for Attendance Reminder */}
                <Link
                    href="/presensi"
                    className="flex mb-6 p-6 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-red-700">
                            Klik disini untuk melakukan presensi {test.stream}
                        </span>
                    </div>
                </Link>
                <video 
                    src={test.stream} 
                    controls 
                    className="w-full h-auto"
                />

                {/* Main Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Card Capaian Pembelajaran */}
                    <div className="overflow-hidden border border-amber-300 bg-white shadow-lg rounded-lg transform transition hover:scale-105 hover:shadow-lg">
                        <div className="p-6 text-gray-800">
                            <h3 className="text-xl font-semibold text-red-700">
                                Capaian Pembelajaran
                            </h3>
                            <p className="mt-4 text-gray-600">
                                Capaian Pembelajaran (CP) menunjukkan tujuan
                                atau kompetensi yang harus dicapai, sementara
                                Tingkat Pencapaian (TP) menggambarkan sejauh
                                mana siswa telah mencapai tujuan tersebut.
                            </p>
                        </div>
                    </div>

                    {/* Card Tujuan Pembelajaran */}
                    <div className="overflow-hidden border border-amber-300 bg-white shadow-lg rounded-lg transform transition hover:scale-105 hover:shadow-lg">
                        <div className="p-6 text-gray-800">
                            <h3 className="text-xl font-semibold text-red-700">
                                Tujuan Pembelajaran
                            </h3>
                            <p className="mt-4 text-gray-600">
                                Tujuan Pembelajaran adalah untuk menetapkan
                                hasil yang ingin dicapai oleh siswa setelah
                                mengikuti proses pembelajaran. Ini membantu
                                mengarahkan fokus pembelajaran.
                            </p>
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
                            Identitas Pembelajaran mencakup tujuan, metode, dan
                            hasil yang ingin dicapai dalam suatu proses
                            pembelajaran. Siswa akan mempelajari cara mendesain
                            dan menggambarkan hubungan antar entitas dalam basis
                            data menggunakan ERD.
                        </p>
                        <p className="mt-2 text-gray-600">
                            Tujuan dari pembelajaran ini adalah agar siswa
                            memahami dasar-dasar sistem basis data dan bagaimana
                            mendesain struktur data yang efektif.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

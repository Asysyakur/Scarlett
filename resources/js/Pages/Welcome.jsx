import { Link, Head } from "@inertiajs/react";
import { useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const berandaRef = useRef(null);
    const tentangRef = useRef(null);
    const fiturRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <Head title="Selamat Datang" />
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-100 bg-red-700 shadow-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between w-full">
                        <div className="flex w-full">
                            <div className="flex items-center justify-between w-full">
                                <Link href="/">
                                    <div className="text-white font-bold text-xl">
                                        Scarlett
                                    </div>
                                </Link>
                                <div className="flex space-x-8 text-xs md:text-base text-center">
                                    {["beranda", "fitur", "tentang"].map(
                                        (section) => (
                                            <button
                                                key={section}
                                                onClick={() => {
                                                    const refMap = {
                                                        beranda: berandaRef,
                                                        tentang: tentangRef,
                                                        fitur: fiturRef,
                                                    };
                                                    scrollToSection(
                                                        refMap[section]
                                                    );
                                                }}
                                                className="text-white hover:text-yellow-500 font-semibold cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105"
                                            >
                                                {section
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    section.slice(1)}
                                            </button>
                                        )
                                    )}
                                </div>
                                <div className="text-end">
                                    {auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="font-semibold text-white hover:text-yellow-500"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("login")}
                                                className="font-semibold text-white hover:text-yellow-500"
                                            >
                                                Masuk
                                            </Link>
                                            <Link
                                                href={route("register")}
                                                className="ml-6 font-semibold text-white hover:text-yellow-500"
                                            >
                                                Daftar
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div
                ref={berandaRef}
                className="pt-20 bg-gradient-to-b from-red-50 to-red-100 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-red-700 mb-4">
                        Selamat Datang di{" "}
                        <span className="text-yellow-500">Scarlett</span>
                    </h1>
                    <p className="text-lg text-gray-800 mb-6">
                        Student-Centered Academic Resources & Learning
                        Experience Transformation Tools
                    </p>
                    <Link
                        href="/login"
                        className="bg-red-700 text-white py-2 px-4 rounded-full font-bold hover:bg-red-800 transition duration-300"
                    >
                        Jelajahi Fitur
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div
                ref={fiturRef}
                className="pt-20 bg-gradient-to-b from-red-100 to-red-200"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8">
                        Fitur Kami
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Antarmuka Interaktif",
                                description:
                                    "Tampilan yang menarik untuk meningkatkan pengalaman belajar.",
                            },
                            {
                                title: "Desain Responsif",
                                description:
                                    "Tampilan yang dapat disesuaikan untuk semua perangkat.",
                            },
                            {
                                title: "Komponen Kustomisasi",
                                description:
                                    "Elemen yang fleksibel untuk memenuhi kebutuhan Anda.",
                            },
                            {
                                title: "Performa Halus",
                                description:
                                    "Aplikasi yang cepat dan responsif.",
                            },
                            {
                                title: "Keamanan yang Kuat",
                                description:
                                    "Melindungi data Anda dengan langkah-langkah keamanan terbaik.",
                            },
                            {
                                title: "Dukungan & Dokumentasi",
                                description:
                                    "Sumber daya lengkap untuk membantu pengguna.",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* About Us Section */}
            <div
                ref={tentangRef}
                className="pt-20 bg-gradient-to-b from-red-200 to-white"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
                        Tentang Kami
                    </h2>
                    <div className="bg-red-700 text-white p-6 rounded-lg shadow-lg">
                        <p className="text-xl text-center mb-4">
                            Kami adalah tim pengembang yang fokus dalam
                            menciptakan media interaktif untuk pendidikan.
                            Dengan visi untuk menggabungkan teknologi modern
                            dengan elemen gamifikasi, kami berkomitmen untuk
                            menyediakan platform pembelajaran yang inovatif dan
                            bermanfaat.
                        </p>
                        <ul className="text-lg list-disc px-8 space-y-4">
                            <li>
                                <strong>Desain Interaktif:</strong> Antarmuka
                                yang menarik secara visual dan nyaman digunakan.
                            </li>
                            <li>
                                <strong>Gamifikasi:</strong> Menambahkan elemen
                                permainan untuk meningkatkan motivasi.
                            </li>
                            <li>
                                <strong>Fleksibilitas Media:</strong> Platform
                                ini dapat disesuaikan dengan berbagai kurikulum.
                            </li>
                            <li>
                                <strong>Keamanan Data:</strong> Kami memastikan
                                bahwa data Anda tetap aman dengan perlindungan
                                terbaik.
                            </li>
                            <li>
                                <strong>Evaluasi & Analitik:</strong> Sistem
                                pelaporan berbasis data untuk mengukur progres
                                belajar.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 p-6">
                Laravel v{laravelVersion} (PHP v{phpVersion})
            </div>
        </>
    );
}

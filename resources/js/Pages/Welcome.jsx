import { Link, Head } from "@inertiajs/react";
import { useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import DashboardImg from "./Assets/Dash.jpg";
import Pretest from "./Assets/pre.jpg";
import MateriImg from "./Assets/Mat.jpg";
import StudiImg from "./Assets/stud.jpg";
import DndImg from "./Assets/dnd.jpg";
import KelompokImg from "./Assets/kel.jpg";
import DiagramImg from "./Assets/disku.jpg";
import ErdImg from "./Assets/erd.jpg";
import Posttest from "./Assets/post.jpg";

const steps = [
    {
        title: "1. Daftar akun baru atau masuk dengan akun yang sudah ada.",
    },
    {
        title: "2. Setelah masuk bacalah Capaian Pembelajaran, Tujuan Pembelajaran dan Identitas Pembelajaran",
    },
    {
        title: "3. Lakukan presensi pada menu yang tersedia di dashboard",
        image: DashboardImg,
    },
    {
        title: "4. Setelah absen kerjakanlah pretest di halaman test berikut ini",
        image: Pretest,
    },
    {
        title: "5. Setelah melakukan absensi bukalah halaman materi dan pelajari materi, lakukan eksplorasi pada halaman materi seperti membuka halaman konten, menonton video dan mempelajari file materi",
        image: MateriImg,
    },
    {
        title: "6. Setelah mempelajari materi awal, klik selanjutnya untuk mempelajari studi kasus yang akan dikerjakan",
        image: StudiImg,
    },
    {
        title: "7. Setelah mempelajari studi kasus isilah mini-game drag and drop dengan benar dan sesuai jawaban kamu terhadap studi kasus tersebut",
        image: DndImg,
    },
    {
        title: "8. Periksalah halaman kelompok untuk mengetahui pembagian kelompok dan ketua kelompok kamu",
        image: KelompokImg,
    },
    {
        title: "9. Bukalah halaman diagram dan diskusikanlah pekerjaanmu dan teman sekelompokmu pada mini game drag and drop sebelumnya, kamu bisa mengkomentari hasilmu atau temanmu",
        image: DiagramImg,
    },
    {
        title: "10. Sekarang bangunlah ERD kelompokmu, diskusikanlah pembagian tugas dan penunjukannya dengan ketua kelompokmu. Setelah itu buatlah ERD kelompok pada DrawIO",
        image: ErdImg,
    },
    {
        title: "11. Setelah membangun dan mempresentasikan ERD kerjakanlah posttest di halaman test berikut ini",
        image: Posttest,
    },
];

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const berandaRef = useRef(null);
    const tentangRef = useRef(null);
    const fiturRef = useRef(null);
    const panduanRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: "smooth" });
    };

    const [openStep, setOpenStep] = useState(null);

    const toggleStep = (index) => {
        setOpenStep(openStep === index ? null : index);
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
                                    {[
                                        "beranda",
                                        "fitur",
                                        "tentang",
                                        "panduan",
                                    ].map((section) => (
                                        <button
                                            key={section}
                                            onClick={() => {
                                                const refMap = {
                                                    beranda: berandaRef,
                                                    tentang: tentangRef,
                                                    fitur: fiturRef,
                                                    panduan: panduanRef,
                                                };
                                                scrollToSection(
                                                    refMap[section]
                                                );
                                            }}
                                            className="text-white hover:text-yellow-500 font-semibold cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105"
                                        >
                                            {section.charAt(0).toUpperCase() +
                                                section.slice(1)}
                                        </button>
                                    ))}
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
                        Fitur Scarlett
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Monitoring Siswa",
                                description:
                                    "Screen share quiz dan record aktivitas siswa agar guru dapat merencanakan pembelajaran yang optimal",
                            },
                            {
                                title: "Drag and Drop Games",
                                description:
                                    "Assesmen formatif drag and drop interaktif yang bisa mengasah kemampuan belajar basis data siswa sebelum dan diluar pembelajaran kelas",
                            },
                            {
                                title: "Pretest & Postest",
                                description:
                                    "Assesmen sumatif pembelajaran dengan teori Logical Thinking untuk mengukur kemampuan kognitif, berpikir logis dan pemahaman terhadap materi oleh siswa",
                            },
                            {
                                title: "Integrasi Pembelajaran",
                                description:
                                    "Seluruh elemen pembelajaran terintegrasi, mulai dari Capaian Pembelajaran, Tujuan Pembelajaran dan materi sehingga guru dapat melaksanakan pembelajaran sepenuhnya di Scarlett",
                            },
                            {
                                title: "Kanvas Diagram",
                                description:
                                    "Integrasi fitur pembuatan diagram agar siswa memahami pembuatan ERD berdasarkan studi kasus permasalahan",
                            },
                            {
                                title: "Evaluasi  & Analitik",
                                description:
                                    "Alat pembantu guru dalam mengevaluasi dan merencanakan pembelajaran yang berkelanjutan",
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
                        Tentang Scarlett
                    </h2>
                    <div className="bg-red-700 text-white p-6 rounded-lg shadow-lg">
                        <p className="text-xl text-center mb-4">
                            Scarlett adalah aplikasi Learning Management System
                            yang mengintegrasikan fitur - fitur esensial untuk
                            pembelajaran siswa di masa modern yang berlandaskan
                            teknologi dan memfasilitasi pembelajaran kurikulum
                            merdeka. Scarlett menyediakan fitur monitoring yang
                            sangat membantu guru untuk merencanakan pembelajaran
                            yang berkelanjutan, berfokus pada siswa dan sukses
                            menerapkan prinsip pembelajaran kurikulum merdeka
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

            <div ref={panduanRef} className="pt-20 bg-white">
                <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
                    Panduan Penggunaan
                </h2>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto px-6 py-4 bg-red-700 text-white rounded-lg shadow-lg">
                        <p className="mb-4 text-lg">
                            Selamat datang di aplikasi kami! Berikut adalah
                            panduan singkat untuk membantu Anda memulai:
                        </p>
                        <ol className="list-decimal list-inside mb-4">
                            {steps.map((step, index) => (
                                <div key={index} className="mb-2 text-lg">
                                    <button
                                        onClick={() => toggleStep(index)}
                                        className="w-full text-left font-bold"
                                    >
                                        {step.title}
                                    </button>
                                    {step.image && openStep === index && (
                                        <div className="mt-2">
                                            <img
                                                src={step.image}
                                                alt={step.title}
                                                className="mb-2"
                                            />
                                            <p>{step.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="p-8 mt-10 bg-gray-100">
                <div className="text-center text-lg text-gray-700 p-6">
                    <div className="font-bold text-2xl mb-4">Need Help?</div>
                    <div className="text-xl mb-2">Irham Jundurrahmaan</div>
                    <div className="mt-4">
                        <span className="font-semibold text-lg">
                            Contact Us:
                        </span>
                        <div className="flex justify-center items-center space-x-8 mt-2">
                            <div className="flex items-center space-x-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 text-gray-500"
                                >
                                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                </svg>
                                <span className="text-lg">
                                    irhammika47@upi.edu
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 text-gray-500"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-lg">081322547572</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="font-bold text-2xl mb-4">
                            Special Thanks to:
                        </div>
                        <ul className="flex flex-wrap justify-center space-x-4 text-lg">
                            <li>Image and Animation Resource: storyset on Freepik</li>
                            <li>Workspace: DrawIO</li>
                            <li>
                                Video Material: Decomplexify, Ilkom UNU Blitar
                            </li>
                            <li>
                                Database Project Guideline: Hogan, R. (2018). A
                                practical guide to database design. CRC Press.
                            </li>
                            <li>Website and Test Tools: Google LLC</li>
                            <li>
                                Material Reference: SMK BPI Bandung, Metrodata
                                Academy
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
}

import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

// Base navigation items
const baseNavigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Kelompok", href: "/kelompok" },
    { name: "Test", href: "/test" },
    { name: "Materi", href: "/materi" },
    { name: "Diagram", href: "/diagram" },
];

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user.role_id === 1; // Adjust based on your role structure
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-white">
            <nav className="sticky top-0 z-50 border-b border-gray-100 bg-red-700 shadow-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between w-full">
                        <div className="flex w-full z-50 justify-between">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <h2 className="text-white font-bold text-xl">
                                        Scarlett
                                    </h2>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:flex">
                                {baseNavigation.map((item, index) => {
                                    const isDisabled =
                                        !isAdmin &&
                                        ((item.name === "Test" &&
                                            (!user?.progress_user ||
                                                user.progress_user.progress <
                                                    1)) ||
                                            (item.name === "Materi" &&
                                                (!user?.progress_user ||
                                                    user.progress_user
                                                        .progress < 2)) ||
                                            (item.name === "Kelompok" &&
                                                (!user?.progress_user ||
                                                    user.progress_user
                                                        .progress < 2)) ||
                                            (item.name === "Diagram" &&
                                                (!user?.progress_user ||
                                                    user.progress_user
                                                        .progress < 3)));
                                    return (
                                        <NavLink
                                            key={index}
                                            href={item.href}
                                            active={
                                                window.location.pathname ===
                                                item.href
                                            }
                                            className={`text-white hover:text-yellow-500 ${
                                                isDisabled
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }`}
                                        >
                                            {item.name}
                                        </NavLink>
                                    );
                                })}

                                {/* Render "Monitoring" link if user is admin */}
                                {isAdmin && (
                                    <NavLink
                                        href="/monitoring"
                                        active={
                                            window.location.pathname ===
                                            "/monitoring"
                                        }
                                        className="text-white hover:text-yellow-500"
                                    >
                                        Monitoring
                                    </NavLink>
                                )}
                            </div>
                            {/* User profile dropdown and mobile nav button */}
                            <div className="hidden sm:flex sm:items-center">
                                {/* User profile dropdown */}
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}
                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                                className="text-red-600"
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="text-red-600"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        {/* Mobile nav button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (prev) => !prev
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-white transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile responsive navigation */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {baseNavigation.map((item, index) => {
                            const isDisabled =
                                !isAdmin &&
                                ((item.name === "Test" &&
                                    (!user?.progress_user ||
                                        user.progress_user.progress < 1)) ||
                                    (item.name === "Materi" &&
                                        (!user?.progress_user ||
                                            user.progress_user.progress < 2)) ||
                                    (item.name === "Kelompok" &&
                                        (!user?.progress_user ||
                                            user.progress_user.progress < 2)) ||
                                    (item.name === "Diagram" &&
                                        (!user?.progress_user ||
                                            user.progress_user.progress < 3)));
                            return (
                                <ResponsiveNavLink
                                    key={index}
                                    href={item.href}
                                    active={route().current(item.href)}
                                    className={`text-amber-200 hover:text-yellow-500 ${
                                        isDisabled
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }`}
                                >
                                    {item.name}
                                </ResponsiveNavLink>
                            );
                        })}

                        {/* Render "Monitoring" link for admin in mobile nav */}
                        {isAdmin && (
                            <ResponsiveNavLink
                                href="/monitoring"
                                active={route().current("/monitoring")}
                                className="text-amber-200 hover:text-yellow-500"
                            >
                                Monitoring
                            </ResponsiveNavLink>
                        )}
                    </div>
                </div>
            </nav>

            {header && (
                <header className="max-w-7xl mx-auto p-6">
                    <h1 className="text-3xl font-bold text-red-600">
                        {header}
                    </h1>
                </header>
            )}

            <main>{children}</main>
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
        </div>
    );
}

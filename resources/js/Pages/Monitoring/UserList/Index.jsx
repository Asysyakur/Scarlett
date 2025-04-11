import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import axios from "axios";

const UserList = ({ users }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const usersPerPage = 10;

    useEffect(() => {
        const filtered = users.filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedUser(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        // Validate name and email
        if (!formData.name.trim()) {
            Swal.fire("Gagal!", "Nama tidak boleh kosong.", "error");
            return;
        }

        if (!formData.email.trim()) {
            Swal.fire("Gagal!", "Email tidak boleh kosong.", "error");
            return;
        }

        // Validate password length
        if (formData.password && formData.password.length < 8) {
            Swal.fire(
                "Gagal!",
                "Password harus memiliki minimal 8 karakter.",
                "error"
            );
            return;
        }

        try {
            await axios.put(`/monitoring/users/${selectedUser.id}`, formData);
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUser.id
                        ? { ...user, ...formData }
                        : user
                )
            );
            Swal.fire(
                "Berhasil!",
                "Data pengguna berhasil diperbarui.",
                "success"
            );
            closeEditModal();
        } catch (error) {
            console.error("Error saat memperbarui pengguna: ", error);
            Swal.fire(
                "Gagal!",
                "Terjadi kesalahan saat memperbarui pengguna.",
                "error"
            );
        }
    };

    return (
        <AuthenticatedLayout header={<>List User</>}>
            <Head title="List User" />
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
                                    No
                                </th>
                                <th className="border border-red-500 px-4 py-2 text-left">
                                    Nama
                                </th>
                                <th className="border border-red-500 px-4 py-2 text-left">
                                    Email
                                </th>
                                <th className="border border-red-500 px-4 py-2 text-left">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr
                                    key={index}
                                    className={
                                        index % 2 === 0
                                            ? "bg-gray-50"
                                            : "bg-white"
                                    }
                                >
                                    <td className="border border-gray-300 px-4 py-2">
                                        {indexOfFirstUser + index + 1}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {user.name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {user.email}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(user)
                                                }
                                                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    Swal.fire({
                                                        title: "Apakah Anda yakin?",
                                                        text: "Data ini akan dihapus secara permanen!",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonColor:
                                                            "#d33",
                                                        cancelButtonColor:
                                                            "#f59e0b",
                                                        confirmButtonText:
                                                            "Ya, hapus!",
                                                        cancelButtonText:
                                                            "Batal",
                                                    }).then(async (result) => {
                                                        if (
                                                            result.isConfirmed
                                                        ) {
                                                            try {
                                                                await axios.delete(
                                                                    `/monitoring/users/${user.id}`
                                                                );
                                                                setFilteredUsers(
                                                                    (
                                                                        prevUsers
                                                                    ) =>
                                                                        prevUsers.filter(
                                                                            (
                                                                                u
                                                                            ) =>
                                                                                u.id !==
                                                                                user.id
                                                                        )
                                                                );
                                                                Swal.fire(
                                                                    "Berhasil!",
                                                                    "Pengguna berhasil dihapus.",
                                                                    "success"
                                                                );
                                                            } catch (error) {
                                                                console.error(
                                                                    "Error saat menghapus pengguna: ",
                                                                    error
                                                                );
                                                                Swal.fire(
                                                                    "Gagal!",
                                                                    "Terjadi kesalahan saat menghapus pengguna.",
                                                                    "error"
                                                                );
                                                            }
                                                        }
                                                    })
                                                }
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
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

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4">
                            Edit Pengguna
                        </h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-amber-500"
                                    required // HTML validation to ensure the field is not empty
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-amber-500"
                                    required // HTML validation to ensure the field is not empty
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-amber-500"
                                    minLength={8} // HTML validation for minimum 8 characters
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default UserList;

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Group({ auth, users, groups }) {
    const { post } = useForm();
    const [groupCount, setGroupCount] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [drawioLink, setDrawioLink] = useState("");

    const handleGroupCountChange = (event) => {
        setGroupCount(event.target.value);
    };

    const handleCreateGroups = async (event) => {
        event.preventDefault();
        await axios.post(route("group.storeMany"), { count: groupCount });
        router.reload();
    };

    const handleRandomizeGroups = () => {
        post(route("group.randomize"));
    };

    const handleShowModal = (groupId) => {
        setSelectedGroupId(groupId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedGroupId(null);
        setDrawioLink("");
    };

    const handleSaveDrawioLink = async () => {
        if (!drawioLink) {
            alert("Please provide a valid Draw.io link.");
            return;
        }

        // Send the link to the server
        await axios.post(route("group.updateDrawioLink", selectedGroupId), {
            drawio_link: drawioLink,
        });

        setShowModal(false);
        router.reload();
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<>Kelompok</>}>
            <Head title="Kelompok" />

            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white border border-amber-300 shadow-lg rounded-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg text-gray-700">
                            Total Kelompok : {groups.length}
                        </h3>
                        <h3 className="font-semibold text-lg text-gray-700">
                            Total Siswa : {users.length}
                        </h3>
                    </div>

                    {auth?.user?.role_id === 1 && (
                        <div className="mb-6">
                            <form
                                onSubmit={handleCreateGroups}
                                className="flex flex-col md:flex-row items-center mb-4 space-y-4 md:space-y-0"
                            >
                                <label className="block text-gray-700 mr-2">
                                    Masukan banyaknya kelompok:
                                </label>
                                <input
                                    type="number"
                                    value={groupCount}
                                    onChange={handleGroupCountChange}
                                    min="1"
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 w-full md:w-auto"
                                />
                                <button
                                    type="submit"
                                    className="ml-2 px-4 py-2 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200 w-full md:w-auto"
                                >
                                    Buat Kelompok
                                </button>
                            </form>


                            <button
                                onClick={handleRandomizeGroups}
                                className="w-full md:w-auto px-4 py-2 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200"
                            >
                                Random Kelompok
                            </button>
                        </div>
                    )}
                </div>

                {/* Groups List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                    {groups.length > 0 ? (
                        groups.map((group, index) => (
                            <div
                                key={index}
                                className="transform transition-all hover:scale-105 bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-100 hover:shadow-xl"
                            >
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    Grup {index + 1} : {group.name} (
                                    {group.users.length} Siswa)
                                </h2>
                                <ul>
                                    {group?.users?.length > 0 ? (
                                        group.users.map((user) => (
                                            <li
                                                key={user.id}
                                                className="text-gray-600"
                                            >
                                                👤 {user.name}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">
                                            Belum ada siapa-siapa.
                                        </li>
                                    )}
                                </ul>

                                {/* Button to open the modal */}
                                {auth?.user?.role_id === 1 && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleShowModal(group.id)}
                                            className="px-4 py-2 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200"
                                        >
                                            Input Draw.io Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">
                            Tidak ada grup yang tersedia saat ini.
                        </p>
                    )}
                </div>
            </div>

            {/* Modal for Inputting Draw.io Link */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">
                            Masukkan Link Draw.io
                        </h3>
                        <input
                            type="url"
                            value={drawioLink}
                            onChange={(e) => setDrawioLink(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg mb-4"
                            placeholder="https://embed.diagrams.net/..."
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveDrawioLink}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

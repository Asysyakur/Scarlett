import { useActivity } from "@/Contexts/ActivityContext";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Group({ auth, users, groups, usersGroups }) {
    const { post } = useForm();
    const [groupCount, setGroupCount] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [drawioLink, setDrawioLink] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();
    const groupMembers = groups.flatMap((group) =>
        group.users.map((user) => user.id)
    );
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [remainingTime, setRemainingTime] = useState(5);
    const [showTooltip, setShowTooltip] = useState(false);
    
    const usersNotInGroups = users.filter(
        (user) => !groupMembers.includes(user.id)
    );
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.hidden) {
                await stopActivity(); // Wait for stopActivity to complete
            } else {
                startActivity();
            }
        };

        changePath("/kelompok");
        startActivity();

        document.addEventListener("visibilitychange", handleVisibilityChange);

        const timer = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsButtonDisabled(false);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            stopActivity(); // Ensure stopActivity completes before cleanup
        };
    }, [currentPath]);

    const handleGroupCountChange = (event) => {
        setGroupCount(event.target.value);
    };

    const handleCreateGroups = async (event) => {
        event.preventDefault();
        await axios.post(route("group.storeMany"), { count: groupCount });
        router.reload();
    };

    const handleNextClick = async () => {
        if (isButtonDisabled) {
            return;
        }
        try {
            await axios.post(`/update-progress`, {
                progress: 3,
            });
            router.get(route("materi.toStudiKasus"));
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    const handleRandomizeGroups = () => {
        post(route("group.randomize"));
    };

    const handleShowModal = (group) => {
        setSelectedGroup(group);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedGroup(null);
        setSelectedMembers([]);
        setShowAddMemberModal(false);
        setDrawioLink("");
    };

    const handleSaveDrawioLink = async () => {
        if (!drawioLink) {
            alert("Please provide a valid Draw.io link.");
            return;
        }

        // Send the link to the server
        await axios.post(route("group.updateDrawioLink", selectedGroup.id), {
            drawio_link: drawioLink,
        });

        setShowModal(false);
        router.reload();
    };

    const handleEditGroup = (group) => {
        setShowAddMemberModal(true);
        setSelectedGroup();
        setSelectedGroup(group);
    };

    const handleAddMember = async () => {
        // Tambahkan logika untuk menambah anggota ke grup di sini
        try {
            await axios.post(route("group.addStudent", selectedGroup.id), {
                users: selectedMembers,
            });
            router.reload();
        } catch (error) {
            console.error(error);
        }

        setShowAddMemberModal(false);
        setSelectedMembers([]);
        setSelectedGroup(null);
    };

    const handleRemoveMember = async (userId) => {
        try {
            await axios.delete(
                route("group.removeStudent", {
                    group: selectedGroup.id,
                    id: userId,
                })
            );
            router.reload();
        } catch (error) {
            console.error(error);
        }
        setShowAddMemberModal(false);
        setSelectedMembers([]);
        setSelectedGroup(null);
        // Tambahkan logika untuk menghapus anggota dari grup di sini
    };

    const userGroups = groups.filter((group) =>
        group.users.some((user) => user.id === auth.user.id)
    );

    const handleMakeLeader = async (userId) => {
        try {
            console.log(userId);
            await axios.post(
                `/groups/${selectedGroup.id}/set-leader/${userId}`
            );
            router.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnmakeLeader = async (userId) => {
        try {
            await axios.post(
                `/groups/${selectedGroup.id}/unset-leader/${userId}`
            );
            router.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<>Kelompok</>}>
            <Head title="Kelompok" />
            {auth?.user?.role_id === 1 && (
                <>
                    <div className="max-w-7xl mx-auto p-6">
                        <div className="bg-white border border-amber-300 shadow-lg rounded-lg p-6 mb-8">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <h3 className="font-semibold text-lg text-gray-700">
                                    Total Kelompok : {groups.length}
                                </h3>
                                <h3 className="font-semibold text-lg text-gray-700">
                                    Total Siswa : {users.length}
                                </h3>
                            </div>
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
                                            {group.name} ({group.users.length}{" "}
                                            Siswa)
                                        </h2>
                                        <ul>
                                            {group?.users?.length > 0 ? (
                                                group.users
                                                    .sort((a, b) => {
                                                        const userGroupA =
                                                            usersGroups.find(
                                                                (usersGroup) =>
                                                                    usersGroup.user_id ===
                                                                        a.id &&
                                                                    usersGroup.group_id ===
                                                                        group.id
                                                            );
                                                        const userGroupB =
                                                            usersGroups.find(
                                                                (usersGroup) =>
                                                                    usersGroup.user_id ===
                                                                        b.id &&
                                                                    usersGroup.group_id ===
                                                                        group.id
                                                            );

                                                        const isLeaderA =
                                                            userGroupA &&
                                                            userGroupA.is_leader;
                                                        const isLeaderB =
                                                            userGroupB &&
                                                            userGroupB.is_leader;

                                                        if (
                                                            isLeaderA &&
                                                            !isLeaderB
                                                        )
                                                            return -1;
                                                        if (
                                                            !isLeaderA &&
                                                            isLeaderB
                                                        )
                                                            return 1;
                                                        return 0;
                                                    })
                                                    .map((user) => {
                                                        const userGroup =
                                                            usersGroups.find(
                                                                (usersGroup) =>
                                                                    usersGroup.user_id ===
                                                                        user.id &&
                                                                    usersGroup.group_id ===
                                                                        group.id
                                                            );
                                                        const isLeader =
                                                            userGroup &&
                                                            userGroup.is_leader;

                                                        return (
                                                            <li
                                                                key={user.id}
                                                                className={`text-gray-600 text-lg ${
                                                                    isLeader
                                                                        ? "font-bold text-blue-600"
                                                                        : ""
                                                                }`}
                                                            >
                                                                👤 {user.name}{" "}
                                                                {isLeader ? (
                                                                    <span>
                                                                        (Ketua)
                                                                    </span>
                                                                ) : null}
                                                            </li>
                                                        );
                                                    })
                                            ) : (
                                                <li className="text-gray-500">
                                                    Belum ada siapa-siapa.
                                                </li>
                                            )}
                                        </ul>

                                        {/* Buttons to open the modal and edit the group */}

                                        <div className="mt-4 flex gap-4 w-full">
                                            <button
                                                onClick={() =>
                                                    handleShowModal(group)
                                                }
                                                className="px-4 py-2 w-full bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200"
                                            >
                                                Input Draw.io Link
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleEditGroup(group)
                                                }
                                                className="px-4 py-2 w-full bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                            >
                                                Edit Group
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500">
                                    Tidak ada kelompok yang tersedia saat ini.
                                </p>
                            )}
                        </div>
                    </div>

                    {showAddMemberModal && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                    Tambah Anggota ke Kelompok
                                </h3>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="w-full">
                                        <h4 className="text-lg font-semibold text-gray-600 mb-2">
                                            Anggota di Kelompok
                                        </h4>
                                        <ul className="border border-gray-300 rounded-lg p-2 overflow-auto h-64">
                                            {selectedGroup?.users.map(
                                                (user) => {
                                                    const userGroup =
                                                        usersGroups.find(
                                                            (usersGroup) =>
                                                                usersGroup.user_id ===
                                                                    user.id &&
                                                                usersGroup.group_id ===
                                                                    selectedGroup.id
                                                        );
                                                    const isLeader =
                                                        userGroup &&
                                                        userGroup.is_leader;

                                                    return (
                                                        <li
                                                            key={user.id}
                                                            className="flex justify-between items-center mb-2"
                                                        >
                                                            <span>
                                                                {user.name}
                                                            </span>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleRemoveMember(
                                                                            user.id
                                                                        )
                                                                    }
                                                                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                                                >
                                                                    Hapus
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        isLeader
                                                                            ? handleUnmakeLeader(
                                                                                  user.id
                                                                              )
                                                                            : handleMakeLeader(
                                                                                  user.id
                                                                              )
                                                                    }
                                                                    className={`px-2 py-1 text-white rounded-lg transition duration-200 ${
                                                                        isLeader
                                                                            ? "bg-yellow-500 hover:bg-yellow-600"
                                                                            : "bg-green-500 hover:bg-green-600"
                                                                    }`}
                                                                >
                                                                    {isLeader
                                                                        ? "Unmake Leader"
                                                                        : "Jadikan Ketua"}
                                                                </button>
                                                            </div>
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </div>
                                    <div className="w-full">
                                        <h4 className="text-lg font-semibold text-gray-600 mb-2">
                                            Anggota yang Belum di Kelompok
                                        </h4>
                                        <select
                                            multiple
                                            value={selectedMembers}
                                            onChange={(e) => {
                                                const options =
                                                    e.target.options;
                                                const selectedValues = [];
                                                for (
                                                    let i = 0;
                                                    i < options.length;
                                                    i++
                                                ) {
                                                    if (options[i].selected) {
                                                        selectedValues.push(
                                                            options[i].value
                                                        );
                                                    }
                                                }
                                                setSelectedMembers(
                                                    selectedValues
                                                );
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded-lg mb-4 h-64 overflow-auto"
                                        >
                                            {usersNotInGroups.map((user) => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex w-full">
                                    <button
                                        onClick={() =>
                                            setShowAddMemberModal(false)
                                        }
                                        className="px-4 py-2 w-full bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 mr-2"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleAddMember}
                                        className="px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                    >
                                        Tambah
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
                                    onChange={(e) =>
                                        setDrawioLink(e.target.value)
                                    }
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
                </>
            )}
            {auth?.user?.role_id === 2 && (
                <>
                    <div className="max-w-7xl mx-auto p-6">
                        <div className="text-center">
                            {userGroups.length > 0 ? (
                                userGroups.map((group, index) => (
                                    <div>
                                        <div
                                            key={index}
                                            className="transform transition-all hover:scale-105 bg-white shadow-lg rounded-lg p-6 border border-amber-300 hover:bg-amber-100 hover:shadow-xl mb-6"
                                        >
                                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                                {group.name} (
                                                {group.users.length} Siswa)
                                            </h2>
                                            <ul className="space-y-2">
                                                {group?.users?.length > 0 ? (
                                                    group.users
                                                        .sort((a, b) => {
                                                            const userGroupA =
                                                                usersGroups.find(
                                                                    (
                                                                        usersGroup
                                                                    ) =>
                                                                        usersGroup.user_id ===
                                                                            a.id &&
                                                                        usersGroup.group_id ===
                                                                            group.id
                                                                );
                                                            const userGroupB =
                                                                usersGroups.find(
                                                                    (
                                                                        usersGroup
                                                                    ) =>
                                                                        usersGroup.user_id ===
                                                                            b.id &&
                                                                        usersGroup.group_id ===
                                                                            group.id
                                                                );

                                                            const isLeaderA =
                                                                userGroupA &&
                                                                userGroupA.is_leader;
                                                            const isLeaderB =
                                                                userGroupB &&
                                                                userGroupB.is_leader;

                                                            if (
                                                                isLeaderA &&
                                                                !isLeaderB
                                                            )
                                                                return -1;
                                                            if (
                                                                !isLeaderA &&
                                                                isLeaderB
                                                            )
                                                                return 1;
                                                            return 0;
                                                        })
                                                        .map(
                                                            (
                                                                user,
                                                                userIndex
                                                            ) => {
                                                                const userGroup =
                                                                    usersGroups.find(
                                                                        (
                                                                            usersGroup
                                                                        ) =>
                                                                            usersGroup.user_id ===
                                                                                user.id &&
                                                                            usersGroup.group_id ===
                                                                                group.id
                                                                    );
                                                                const isLeader =
                                                                    userGroup &&
                                                                    userGroup.is_leader;

                                                                return (
                                                                    <li
                                                                        key={
                                                                            userIndex
                                                                        }
                                                                        className={`flex text-lg items-center justify-between text-gray-600 bg-gray-100 p-2 rounded-lg ${
                                                                            isLeader
                                                                                ? "font-bold text-blue-600"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        <span>
                                                                            👤{" "}
                                                                            {
                                                                                user.name
                                                                            }{" "}
                                                                            {isLeader ? (
                                                                                <span>
                                                                                    (Ketua)
                                                                                </span>
                                                                            ) : null}
                                                                        </span>
                                                                    </li>
                                                                );
                                                            }
                                                        )
                                                ) : (
                                                    <li className="text-gray-500">
                                                        Belum ada siapa-siapa.
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                        <div className="mt-4 text-center relative">
                                            <button
                                                onClick={handleNextClick}
                                                onMouseEnter={() =>
                                                    setShowTooltip(true)
                                                }
                                                onMouseLeave={() =>
                                                    setShowTooltip(false)
                                                }
                                                className={`bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                                    isButtonDisabled
                                                        ? "opacity-50"
                                                        : ""
                                                }`}
                                            >
                                                Next
                                            </button>
                                            {showTooltip &&
                                                isButtonDisabled && (
                                                    <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-700 text-white text-sm rounded">
                                                        Sisa waktu:{" "}
                                                        {remainingTime} detik
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500">
                                    Anda belum masuk ke dalam kelompok.
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </AuthenticatedLayout>
    );
}

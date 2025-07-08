import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useActivity } from "@/Contexts/ActivityContext";
import html2canvas from "html2canvas";

const GameBoard = ({
    tables,
    attributes,
    relations,
    auth,
    materi,
    erdSave,
    nilaiERD,
}) => {
    const [tableData, setTableData] = useState(
        tables.map((table) => {
            // Find the saved ERD data for the current table based on materi_id and table_id
            const savedAttributes =
                erdSave.find(
                    (erd) =>
                        erd.table_id === table.id && erd.materi_id === materi.id
                )?.attributes || []; // Default to an empty array if no match

            return {
                ...table,
                ref: useRef(null),
                // Map over the saved attributes and add isPrimaryKey and isForeignKey
                attributes: savedAttributes.map((attr) => ({
                    ...attr,
                    isPrimaryKey: attr.isPrimaryKey || false, // Add default false if not defined
                    isForeignKey: attr.isForeignKey || false, // Add default false if not defined
                })),
            };
        })
    );
    const [isEditing, setIsEditing] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [relationsData, setRelationsData] = useState(relations);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTables, setNewTables] = useState([{ name: "", id: "" }]);
    const [newAttributes, setNewAttributes] = useState([{ label: "", id: "" }]);
    const [newRelations, setNewRelations] = useState([
        { from: "", to: "", type: "", id: "" }, // Initialize with empty values for each field
    ]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [remainingTime, setRemainingTime] = useState(5);
    const [showTooltip, setShowTooltip] = useState(false);
    const { startActivity, stopActivity, currentPath, changePath } =
        useActivity();

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.hidden) {
                await stopActivity(); // Wait for stopActivity to complete
            } else {
                startActivity();
            }
        };

        changePath(`/materi/${materi.id}/drag-and-drop`);
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

    const usedAttributes = tableData.flatMap((table) =>
        table.attributes.map((attr) => attr.id)
    );
    const availableAttributes = useMemo(() => {
        return attributes
            .filter((attr) => !usedAttributes.includes(attr.id))
            .map((attr) => ({ id: attr.id, label: attr.label }));
    }, [attributes, usedAttributes]);

    const modalRef = useRef();
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target) &&
                !document.querySelector(".swal2-container")
            ) {
                setIsModalOpen(false);
                setIsEditing(false);
                setNewAttributes([{ label: "", id: "" }]);
                setNewTables([{ name: "", id: "" }]);
                setNewRelations([{ from: "", to: "", type: "", id: "" }]);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let url = "";
        let payload = [];

        try {
            // Tentukan endpoint dan data yang dikirim sesuai dengan modalType dan isEditing
            switch (modalType) {
                case "table":
                    // Jika sedang dalam mode edit, kirim data dengan ID tabel untuk update
                    if (isEditing) {
                        payload = newTables
                            .filter(
                                (table) =>
                                    table.name && table.name.trim() !== ""
                            )
                            .map((table) => ({
                                id: table.id, // Pastikan untuk mengirim ID saat edit
                                name: table.name.trim(),
                            }));
                    } else {
                        // Jika tidak dalam mode edit, buat data baru
                        payload = newTables
                            .filter(
                                (table) =>
                                    table.name && table.name.trim() !== ""
                            )
                            .map((table) => ({
                                id: table.id, // Pastikan untuk mengirim ID saat edit
                                name: table.name.trim(),
                            }));
                    }
                    url = `/materi/${materi.id}/drag-and-drop/table`;
                    break;

                case "relation":
                    if (isEditing) {
                        // Mengirim relasi dengan ID jika dalam mode edit
                        payload = newRelations
                            .filter(
                                (relation) =>
                                    relation.from &&
                                    relation.to &&
                                    relation.type &&
                                    relation.from !== "" &&
                                    relation.to !== "" &&
                                    relation.type !== ""
                            )
                            .map((relation) => ({
                                id: relation.id, // Mengirim ID saat mode edit
                                from: relation.from, // Kirim ID table untuk 'from'
                                to: relation.to, // Kirim ID table untuk 'to'
                                type: relation.type, // Tipe relasi
                            }));
                    } else {
                        // Kirim data relasi baru
                        payload = newRelations
                            .filter(
                                (relation) =>
                                    relation.from &&
                                    relation.to &&
                                    relation.type &&
                                    relation.from !== "" &&
                                    relation.to !== "" &&
                                    relation.type !== ""
                            )
                            .map((relation) => ({
                                id: relation.id,
                                from: relation.from, // Kirim ID table untuk 'from'
                                to: relation.to, // Kirim ID table untuk 'to'
                                type: relation.type, // Tipe relasi
                            }));
                    }
                    url = `/materi/${materi.id}/drag-and-drop/relation`;
                    break;

                case "attribute":
                    if (isEditing) {
                        // Mengirim atribut dengan ID jika dalam mode edit
                        payload = newAttributes
                            .filter(
                                (attr) => attr.label && attr.label.trim() !== ""
                            )
                            .map((attr) => ({
                                id: attr.id, // Mengirim ID saat mode edit
                                label: attr.label.trim(),
                            }));
                    } else {
                        // Kirim data atribut baru
                        payload = newAttributes
                            .filter(
                                (attr) => attr.label && attr.label.trim() !== ""
                            )
                            .map((attr) => ({
                                id: attr.id,
                                label: attr.label.trim(),
                            }));
                    }
                    url = `/materi/${materi.id}/drag-and-drop/attribute`;
                    break;

                default:
                    console.error("Modal type tidak dikenali:", modalType);
                    return;
            }

            // Jika payload kosong, beri tahu pengguna
            if (payload.length === 0) {
                console.warn("Data kosong. Tidak ada yang dikirim ke server.");
                alert("Data kosong. Pastikan semua input sudah diisi.");
                return;
            }

            // Kirim data ke server
            const response = await axios.post(url, payload);

            // Show success alert
            await Swal.fire({
                icon: "success",
                title: "Data Submitted Successfully!",
                text: "Your data has been successfully submitted.",
                timer: 1000, // Dismiss after 3 seconds
                showConfirmButton: false,
            });

            // Reset the modal and form states
            setIsModalOpen(false);
            setIsEditing(false);
            setNewAttributes([{ label: "", id: "" }]);
            setNewTables([{ name: "", id: "" }]);
            setNewRelations([{ from: "", to: "", type: "", id: "" }]);

            // Reload the page after SweetAlert has been dismissed
            window.location.reload();
        } catch (error) {
            console.error("Terjadi kesalahan saat mengirim data:", error);
            if (error.response) {
                console.error("Respon server:", error.response.data);
                alert(`Error dari server: ${error.response.data.message}`);
            } else if (error.request) {
                console.error(
                    "Permintaan tidak mendapat respon:",
                    error.request
                );
                alert("Server tidak merespon. Silakan coba lagi nanti.");
            } else {
                console.error("Error saat mengatur permintaan:", error.message);
                alert(`Kesalahan: ${error.message}`);
            }
        }
    };

    const handleNextClick = async () => {
        if (isButtonDisabled) {
            return;
        }
        try {
            await axios.post(`/update-progress`, {
                progress: 4,
            });
            router.get(route("diagram"));
        } catch (error) { 
            console.error("Error updating progress:", error);
        }
    };

    const handleDragEnd = useCallback(
        (event) => {
            const { active, over } = event;

            if (over) {
                const attribute = availableAttributes.find(
                    (attr) => attr.id === active.id
                );

                if (attribute) {
                    setTableData((prevTables) =>
                        prevTables.map((table) => {
                            if (table.id === parseInt(over.id)) {
                                if (
                                    !table.attributes.some(
                                        (attr) => attr.label === attribute.label
                                    )
                                ) {
                                    return {
                                        ...table,
                                        attributes: [
                                            ...table.attributes,
                                            {
                                                id: attribute.id,
                                                label: attribute.label,
                                                isPrimaryKey: false,
                                                isForeignKey: false,
                                            },
                                        ],
                                    };
                                }
                            }
                            return table;
                        })
                    );
                }
            }
        },
        [availableAttributes]
    );

    const DragItem = ({ id, label }) => {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
            id,
        });
        const style = {
            transform: `translate3d(${transform?.x || 0}px, ${
                transform?.y || 0
            }px, 0)`,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="bg-green-300 px-4 py-2 rounded shadow cursor-pointer mb-2 hover:scale-105 active:scale-95"
                aria-label={`Drag ${label} to table`}
            >
                <span className="block w-3/4 break-words text-left">
                    {label}
                </span>
            </div>
        );
    };

    const DroppableTable = ({ table }) => {
        const { setNodeRef } = useDroppable({ id: table.id });

        const handleReset = () => {
            setTableData((prevTables) =>
                prevTables.map((t) =>
                    t.id === table.id ? { ...t, attributes: [] } : t
                )
            );
        };

        const togglePrimaryKey = useCallback(
            (attributeLabel) => {
                setTableData((prevTables) =>
                    prevTables.map((t) =>
                        t.id === table.id
                            ? {
                                  ...t,
                                  attributes: t.attributes.map((attr) => ({
                                      ...attr,
                                      isPrimaryKey:
                                          attr.label === attributeLabel, // Hanya satu PK
                                  })),
                              }
                            : t
                    )
                );
            },
            [table.id]
        );

        const toggleForeignKey = useCallback(
            (attributeLabel) => {
                setTableData((prevTables) =>
                    prevTables.map((t) =>
                        t.id === table.id
                            ? {
                                  ...t,
                                  attributes: t.attributes.map((attr) =>
                                      attr.label === attributeLabel
                                          ? {
                                                ...attr,
                                                isForeignKey:
                                                    !attr.isForeignKey,
                                            }
                                          : attr
                                  ),
                              }
                            : t
                    )
                );
            },
            [table.id]
        );

        useEffect(() => {
            if (table.ref?.current) {
                setNodeRef(table.ref.current);
            }
        }, [setNodeRef, table.ref]);

        return (
            <div
                ref={table.ref}
                className="relative z-20 border p-4 rounded-lg bg-gray-100 shadow-md min-h-[100px] transition-all transform hover:scale-105"
            >
                <div className="flex justify-between items-center">
                    <h3 className="font-bold mb-2">{table.name}</h3>
                    <button
                        onClick={handleReset}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Reset
                    </button>
                </div>
                <ul>
                    {table.attributes?.map((attr, index) => (
                        <li
                            key={index}
                            className="bg-blue-100 px-4 py-2 rounded my-1 flex justify-between items-center"
                        >
                            <span className="block w-3/4 break-words text-left">
                                {attr.label}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => togglePrimaryKey(attr.label)}
                                    className={`${
                                        attr.isPrimaryKey
                                            ? "bg-blue-500"
                                            : "bg-gray-300"
                                    } text-white px-2 py-1 rounded`}
                                    aria-label={`Toggle Primary Key for ${attr.label}`}
                                >
                                    PK
                                </button>
                                <button
                                    onClick={() => toggleForeignKey(attr.label)}
                                    className={`${
                                        attr.isForeignKey
                                            ? "bg-yellow-500"
                                            : "bg-gray-300"
                                    } text-white px-2 py-1 rounded`}
                                    aria-label={`Toggle Foreign Key for ${attr.label}`}
                                >
                                    FK
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const handleCloseModal = () => {
        return () => {
            setIsModalOpen(false);
            setIsEditing(false);
            setNewAttributes([{ label: "", id: "" }]);
            setNewTables([{ name: "", id: "" }]);
            setNewRelations([{ from: "", to: "", type: "", id: "" }]);
        };
    };

    const Connections = ({ relations, tables }) => {
        const [lines, setLines] = useState([]);

        useEffect(() => {
            const updatedLines = relations.map((relation) => {
                const fromTable = tables.find(
                    (table) => table.id === relation.from
                );
                const toTable = tables.find(
                    (table) => table.id === relation.to
                );

                if (fromTable?.ref?.current && toTable?.ref?.current) {
                    const fromRect =
                        fromTable.ref.current.getBoundingClientRect();
                    const toRect = toTable.ref.current.getBoundingClientRect();

                    let x1, y1, x2, y2;

                    // Hitung posisi grid dari tabel
                    const fromTablePosition = tables.indexOf(fromTable);
                    const toTablePosition = tables.indexOf(toTable);

                    // Tentukan apakah posisi dari tabel ada di tengah (2, 5, 8, dst)
                    const isFromTableCenter = fromTablePosition % 3 === 1; // Kolom tengah
                    const isToTableCenter = toTablePosition % 3 === 1; // Kolom tengah

                    // Tentukan dari mana garis akan keluar (kiri, kanan, atau tengah) pada fromTable
                    if (isFromTableCenter) {
                        if (toTablePosition > fromTablePosition) {
                            x1 = fromRect.right; // Jika toTable ada di kanan, keluar dari kanan
                        } else {
                            x1 = fromRect.left; // Jika toTable ada di kiri, keluar dari kiri
                        }
                    } else if (fromTablePosition % 3 === 0) {
                        // Jika fromTable ada di kolom kiri
                        x1 = fromRect.right; // Selalu keluar dari kanan
                    } else {
                        // Jika fromTable ada di kolom kanan
                        x1 = fromRect.left; // Selalu keluar dari kiri
                    }

                    // Tentukan dari mana garis akan masuk (kiri, kanan, atau tengah) pada toTable
                    if (isToTableCenter) {
                        if (toTablePosition > fromTablePosition) {
                            x2 = toRect.left; // Jika fromTable ada di kiri, masuk dari kiri
                        } else {
                            x2 = toRect.right; // Jika fromTable ada di kanan, masuk dari kanan
                        }
                    } else if (toTablePosition % 3 === 0) {
                        // Jika toTable ada di kolom kiri
                        x2 = toRect.right; // Selalu masuk dari kanan
                    } else {
                        // Jika toTable ada di kolom kanan
                        x2 = toRect.left; // Selalu masuk dari kiri
                    }

                    // Atur y1 dan y2 agar berada di tengah tinggi dari tabel
                    y1 = fromRect.top + fromRect.height / 2;
                    y2 = toRect.top + toRect.height / 2;

                    // Buat kurva dari x1, y1 ke x2, y2
                    const middleX = (x1 + x2) / 2;
                    const offset = 20 * relations.indexOf(relation);

                    return {
                        path: `M ${x1},${y1 + offset} H ${middleX} V ${
                            y2 + offset
                        } H ${x2}`,
                        labelX: middleX,
                        labelY: y2 + offset,
                        type: relation.type,
                    };
                }
                return null;
            });

            setLines(updatedLines.filter((line) => line !== null));
        }, [relations, tables]);

        return (
            <svg className="absolute inset-0 pointer-events-none z-30 w-full h-full">
                {lines.map((line, index) => (
                    <React.Fragment key={index}>
                        <path
                            d={line.path}
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                        />
                        <text
                            x={line.labelX}
                            y={line.labelY - 5}
                            fontSize="12"
                            fill="black"
                            textAnchor="middle"
                        >
                            {line.type}
                        </text>
                    </React.Fragment>
                ))}
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="10"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                    </marker>
                </defs>
            </svg>
        );
    };

    const addNewTableField = () => {
        setNewTables([...newTables, { name: "", id: "" }]);
    };

    const addNewRelationField = () => {
        setNewRelations([
            ...newRelations,
            { from: "", to: "", type: "", id: "" },
        ]);
    };

    const addAttributeField = () => {
        setNewAttributes([...newAttributes, { label: "", id: "" }]);
    };

    const handleTableNameChange = (index, value) => {
        const updatedTables = [...newTables];
        updatedTables[index].name = value;
        setNewTables(updatedTables);
    };

    const handleAttributeNameChange = (index, value) => {
        const updatedAttributes = [...newAttributes];
        updatedAttributes[index].label = value;
        setNewAttributes(updatedAttributes); // Update the specific attribute
    };

    const removeAttributeField = async (index, id) => {
        if (isEditing) {
            Swal.fire({
                title: "Apakah Anda yakin?",
                text: "Data ini akan dihapus secara permanen!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#f59e0b",
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(
                            `/materi/drag-and-drop/attribute/${id}`
                        );
                        setNewAttributes(
                            newAttributes.filter(
                                (_, attrIndex) => attrIndex !== index
                            )
                        );
                        Swal.fire(
                            "Berhasil!",
                            "Data berhasil dihapus.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Error saat menghapus item: ", error);
                        Swal.fire(
                            "Gagal!",
                            "Terjadi kesalahan saat menghapus data.",
                            "error"
                        );
                    }
                }
            });
        } else {
            setNewAttributes(
                newAttributes.filter((_, attrIndex) => attrIndex !== index)
            );
        }
    };

    const removeRelationField = async (index, id) => {
        if (isEditing) {
            Swal.fire({
                title: "Apakah Anda yakin?",
                text: "Data ini akan dihapus secara permanen!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#f59e0b",
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(
                            `/materi/drag-and-drop/relation/${id}`
                        );
                        setNewRelations(
                            newRelations.filter(
                                (_, relatIndesx) => relatIndesx !== index
                            )
                        );
                        Swal.fire(
                            "Berhasil!",
                            "Data berhasil dihapus.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Error saat menghapus item: ", error);
                        Swal.fire(
                            "Gagal!",
                            "Terjadi kesalahan saat menghapus data.",
                            "error"
                        );
                    }
                }
            });
        } else {
            setNewRelations(
                newRelations.filter((_, relatIndesx) => relatIndesx !== index)
            );
        }
    };

    const removeTableField = async (index, id) => {
        if (isEditing) {
            Swal.fire({
                title: "Apakah Anda yakin?",
                text: "Data ini akan dihapus secara permanen!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#f59e0b",
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(`/materi/drag-and-drop/table/${id}`);
                        setNewTables(
                            newTables.filter(
                                (_, tableIndex) => tableIndex !== index
                            )
                        );
                        Swal.fire(
                            "Berhasil!",
                            "Data berhasil dihapus.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Error saat menghapus item: ", error);
                        Swal.fire(
                            "Gagal!",
                            "Terjadi kesalahan saat menghapus data.",
                            "error"
                        );
                    }
                }
            });
        } else {
            setNewTables(
                newTables.filter((_, tableIndex) => tableIndex !== index)
            );
        }
    };

    const handleRelationChange = (index, field, value) => {
        const updatedRelations = [...newRelations];
        updatedRelations[index][field] = value;
        setNewRelations(updatedRelations);
    };

    const handleAddTable = () => {
        setModalType("table");
        setIsModalOpen(true);
    };

    const handleEditTable = () => {
        setModalType("table");
        setNewTables(tables);
        setIsModalOpen(true);
        setIsEditing(true);
    };

    const handleAddRelation = () => {
        setModalType("relation");
        setIsModalOpen(true);
    };

    const handleEditRelation = () => {
        setModalType("relation");
        setNewRelations(relations);
        setIsModalOpen(true);
        setIsEditing(true);
    };

    const handleAddAttribute = () => {
        setModalType("attribute");
        setIsModalOpen(true);
    };

    const handleEditAttribute = () => {
        setModalType("attribute");
        setNewAttributes(attributes);
        setIsModalOpen(true);
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            // Prepare payload with all tables data
            const payload = tableData.map((table) => ({
                materi_id: table.materi_id,
                table_id: table.id,
                user_id: auth.user.id,
                attributes: table.attributes, // Assuming attributes is an array
            }));

            // Capture screenshot of the entire div
            const element = document.getElementById("tables-container");
            if (element) {
                const canvas = await html2canvas(element);
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append("screenshot", blob, "screenshot.png");

                    // Upload the screenshot to the server
                    const uploadResponse = await axios.post(
                        "/upload-screenshot",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    // Check if the upload was successful
                    if (uploadResponse.status === 200) {
                        const screenshotFileName = uploadResponse.data.fileName;

                        // Include screenshot file name in the payload
                        payload.forEach((table) => {
                            table.screenshot = screenshotFileName;
                        });

                        // Save the table data along with the screenshot file name
                        const response = await axios.post(
                            "/materi/drag-and-drop/save",
                            payload
                        );

                        // Check if the response is successful
                        if (response.status === 200) {
                            // Show success alert
                            await axios.post("/update-progress", {
                                progress: 3,
                            });
                            await Swal.fire({
                                icon: "success",
                                title: "Berhasil!",
                                text: "ERDmu berhasil disimpan.",
                                timer: 2000, // Dismiss after 2 seconds
                                showConfirmButton: false,
                            });
                        }
                    }
                }, "image/png");
            }
        } catch (error) {
            // Handle errors
            console.error("Error saving data:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ada kesalahan saat menyimpan data. silakan coba lagi.",
                timer: 2000, // Dismiss after 2 seconds
                showConfirmButton: false,
            });
        }
    };

    return (
        <AuthenticatedLayout header={<>Drag and drop</>}>
            <Head title="Drag and Drop" />
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-semibold text-red-700 mb-4">
                    Step Open Inquiry : Designing Experiments
                </h2>
                <DndContext onDragEnd={handleDragEnd}>
                    {auth.user?.role_id === 1 && (
                        <div className="flex justify-between">
                            <div className="flex gap-4 mb-4">
                                <button
                                    onClick={() => handleAddTable()}
                                    className="bg-purple-500 text-white px-4 py-2 rounded"
                                >
                                    Tambah Tabel
                                </button>
                                <button
                                    onClick={() => handleAddRelation()}
                                    className="bg-purple-500 text-white px-4 py-2 rounded"
                                >
                                    Tambah Relasi
                                </button>
                                <button
                                    onClick={() => handleAddAttribute()}
                                    className="bg-purple-500 text-white px-4 py-2 rounded"
                                >
                                    Tambah attribute
                                </button>
                            </div>
                            <div className="flex gap-4 mb-4">
                                <button
                                    onClick={() => handleEditTable()}
                                    className="bg-purple-500 text-white px-4 py-2 rounded"
                                >
                                    Edit Tabel
                                </button>
                                <button
                                    onClick={() => handleEditRelation()}
                                    className="bg-purple-500 text-white px-4 py-2 rounded"
                                >
                                    Edit Relasi
                                </button>
                                <button
                                    onClick={() => handleEditAttribute()}
                                    className="bg-purple-500 text-white px-4 py-2 rounded"
                                >
                                    Edit attribute
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="w-full mb-4 justify-between flex">
                        <div className="mb-4"></div>
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => handleSave()}
                                className="bg-green-500 hover:bg-green-700 transition-all ease-in-out duration-200 text-white px-4 py-2 font-semibold rounded "
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div
                            id="tables-container"
                            className={`grid gap-24 grid-cols-3`}
                        >
                            {tableData.map((table) => (
                                <DroppableTable key={table.id} table={table} />
                            ))}
                            <Connections
                                relations={relationsData}
                                tables={tableData}
                            />
                        </div>

                        <div className="w-full flex justify-center">
                            <div className="w-full md:w-1/4 justify-center border p-4 bg-gray-50 rounded shadow z-40">
                                <h3 className="font-bold mb-2">
                                    Available Attributes
                                </h3>
                                {availableAttributes.map((attr) => (
                                    <DragItem
                                        key={attr.id}
                                        id={attr.id}
                                        label={attr.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Modal for adding/editing materi */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                            <div
                                ref={modalRef}
                                className="bg-white p-6 z-50 rounded-lg shadow-lg w-full max-w-lg"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    {isEditing ? "Edit " : "Tambah "}
                                    {modalType === "table"
                                        ? "Tabel"
                                        : modalType === "attribute"
                                        ? "Attribute"
                                        : "Relasi"}
                                </h3>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 "
                                >
                                    {modalType === "table" && (
                                        <div className="overflow-auto max-h-96">
                                            {newTables.map((table, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center "
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Nama Tabel"
                                                        className="w-full border rounded p-2 mb-2"
                                                        value={table.name}
                                                        onChange={(e) =>
                                                            handleTableNameChange(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {newTables.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeTableField(
                                                                    index,
                                                                    table.id
                                                                )
                                                            } // Pastikan fungsinya benar
                                                            className="ml-2 text-red-500 font-bold"
                                                        >
                                                            X
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addNewTableField}
                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Tambah Tabel Baru
                                            </button>
                                        </div>
                                    )}
                                    {modalType === "attribute" && (
                                        <div className="overflow-auto max-h-96">
                                            {newAttributes.map(
                                                (attr, attrIndex) => (
                                                    <div
                                                        key={attrIndex}
                                                        className="flex items-center mb-2"
                                                    >
                                                        <input
                                                            type="text"
                                                            placeholder="Nama Atribut"
                                                            className="w-full border rounded p-2"
                                                            value={attr.label} // Display attribute name
                                                            onChange={(e) =>
                                                                handleAttributeNameChange(
                                                                    attrIndex,
                                                                    e.target
                                                                        .value
                                                                )
                                                            } // Handle attribute name change
                                                        />
                                                        {/* Remove button with 'X' */}
                                                        {newAttributes.length >
                                                            1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeAttributeField(
                                                                        attrIndex,
                                                                        attr.id
                                                                    )
                                                                } // Remove the attribute
                                                                className="ml-2 text-red-500"
                                                            >
                                                                X
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            )}

                                            <button
                                                type="button"
                                                onClick={addAttributeField} // Add a new attribute field
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                            >
                                                Tambah Atribut
                                            </button>
                                        </div>
                                    )}

                                    {modalType === "relation" && (
                                        <div className="overflow-auto max-h-96">
                                            {newRelations.map(
                                                (relation, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center mb-2"
                                                    >
                                                        <div className="flex-1">
                                                            <select
                                                                value={
                                                                    relation.from
                                                                }
                                                                onChange={(e) =>
                                                                    handleRelationChange(
                                                                        index,
                                                                        "from",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full border rounded p-2 mb-2"
                                                            >
                                                                <option value="">
                                                                    Pilih From
                                                                    Table
                                                                </option>
                                                                {tableData.map(
                                                                    (table) => (
                                                                        <option
                                                                            key={
                                                                                table.id
                                                                            }
                                                                            value={
                                                                                table.id
                                                                            }
                                                                        >
                                                                            {
                                                                                table.name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            <select
                                                                value={
                                                                    relation.to
                                                                }
                                                                onChange={(e) =>
                                                                    handleRelationChange(
                                                                        index,
                                                                        "to",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full border rounded p-2 mb-2"
                                                            >
                                                                <option value="">
                                                                    Pilih To
                                                                    Table
                                                                </option>
                                                                {tableData.map(
                                                                    (table) => (
                                                                        <option
                                                                            key={
                                                                                table.id
                                                                            }
                                                                            value={
                                                                                table.id
                                                                            }
                                                                        >
                                                                            {
                                                                                table.name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            <select
                                                                value={
                                                                    relation.type
                                                                }
                                                                onChange={(e) =>
                                                                    handleRelationChange(
                                                                        index,
                                                                        "type",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full border rounded p-2 mb-2"
                                                            >
                                                                <option value="">
                                                                    Tipe
                                                                </option>
                                                                {[
                                                                    "one-to-one",
                                                                    "one-to-many",
                                                                    "many-to-one",
                                                                    "many-to-many",
                                                                ].map(
                                                                    (type) => (
                                                                        <option
                                                                            key={
                                                                                type
                                                                            }
                                                                            value={
                                                                                type
                                                                            }
                                                                        >
                                                                            {
                                                                                type
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>

                                                        {/* Tombol "X" untuk menghapus relasi */}
                                                        {newRelations.length >
                                                            1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeRelationField(
                                                                        index,
                                                                        relation.id
                                                                    )
                                                                } // Pastikan fungsinya benar
                                                                className="ml-2 text-red-500 font-bold"
                                                            >
                                                                X
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            )}

                                            <button
                                                type="button"
                                                onClick={addNewRelationField}
                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Tambah Relasi Baru
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-amber-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            {isEditing
                                                ? "Simpan Perubahan"
                                                : "Tambah"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal()}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg ml-4"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </DndContext>
                <div className="mt-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="comment"
                    >
                        Catatan:
                    </label>
                    {nilaiERD?.catatan ? (
                        <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            {nilaiERD?.catatan}
                        </p>
                    ) : (
                        <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            Belum ada catatan
                        </p>
                    )}
                </div>

                <div className="mt-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="evaluation"
                    >
                        Nilai ERD:
                    </label>
                    {nilaiERD?.nilai ? (
                        <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            {nilaiERD.nilai}
                        </p>
                    ) : (
                        <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            Belum dinilai
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-center relative">
                    {isButtonDisabled ? (
                        <button
                            className={`bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                isButtonDisabled ? "opacity-50" : ""
                            }`}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            Selanjutnya
                        </button>
                    ) : (
                        <button
                            onClick={handleNextClick}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            disabled={isButtonDisabled}
                            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Selanjutnya
                        </button>
                    )}
                    {showTooltip && isButtonDisabled && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-700 text-white text-sm rounded">
                            Sisa waktu: {remainingTime} detik
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default GameBoard;

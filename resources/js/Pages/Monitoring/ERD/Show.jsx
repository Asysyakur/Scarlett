import React, { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

const Show = ({ erdUser, erdRelation }) => {
    
    const Connections = ({ relations, tables }) => {
        const [lines, setLines] = useState([]);

        useEffect(() => {
            const updatedLines = relations.map((relation) => {
                const fromTable = tables.find(
                    (table) => table.table_id === relation.from
                );
                const toTable = tables.find(
                    (table) => table.table_id === relation.to
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

    const DroppableTable = ({ table }) => {
        const tableRef = useRef(null);
        const attributes = JSON.parse(table.attributes);

        useEffect(() => {
            table.ref = tableRef;
        }, [table]);

        return (
            <div
                ref={tableRef}
                className="relative z-20 border p-4 rounded-lg bg-gray-100 shadow-md min-h-[100px] transition-all transform hover:scale-105"
            >
                <div className="flex justify-between items-center">
                    <h3 className="font-bold mb-2">{table.table_name}</h3>
                </div>
                <ul>
                    {Array.isArray(attributes) &&
                        attributes.map((attr, index) => (
                            <li
                                key={index}
                                className="bg-blue-100 px-4 py-2 rounded my-1 flex justify-between items-center"
                            >
                                <span className="block w-3/4 break-words text-left">
                                    {attr.label}
                                </span>
                                <div className="flex gap-2">
                                    <span
                                        className={`${
                                            attr.isPrimaryKey
                                                ? "bg-blue-500"
                                                : "bg-gray-300"
                                        } text-white px-2 py-1 rounded`}
                                    >
                                        PK
                                    </span>
                                    <span
                                        className={`${
                                            attr.isForeignKey
                                                ? "bg-yellow-500"
                                                : "bg-gray-300"
                                        } text-white px-2 py-1 rounded`}
                                    >
                                        FK
                                    </span>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        );
    };

    // Buat array baru untuk menyimpan referensi DOM
    const tablesWithRefs = erdUser.map((table) => ({
        ...table,
        ref: useRef(null),
    }));

    return (
        <AuthenticatedLayout header={<>ERD Diagram</>}>
            <Head title="ERD Diagram" />
            <div className="max-w-7xl mx-auto px-6">
                <div>
                    <div className="w-full mb-4 justify-between flex">
                        <div className="mb-4">
                            <Link
                                href={"/monitoring/erd"} // Adjust this route as needed
                                className="text-amber-500 hover:text-amber-700 font-semibold"
                            >
                                Kembali ke List
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className={`grid gap-24 grid-cols-3`}>
                            {tablesWithRefs.map((table) => (
                                <DroppableTable key={table.id} table={table} />
                            ))}
                        </div>
                    </div>

                    <Connections
                        relations={erdRelation}
                        tables={tablesWithRefs}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;

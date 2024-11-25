import React, { useState, useEffect, useRef } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const GameBoard = ({ tables, attributes, relations }) => {
    const [tableData, setTableData] = useState(
        tables.map((table) => ({
            ...table,
            ref: useRef(null),
            attributes: table.attributes.map((attr) => ({
                ...attr,
                isPrimaryKey: false,
                isForeignKey: false,
            })),
        })) // Menambahkan ref dan status primary key/foreign key
    );
    const [relationsData, setRelationsData] = useState(relations);

    const attributesPool = attributes.map((attr) => ({
        id: attr.id,
        label: attr.label,
    }));

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over) {
            const attribute = attributesPool.find(
                (attr) => attr.id === active.id
            );

            if (attribute) {
                setTableData((prevTables) =>
                    prevTables.map((table) => {
                        if (table.id === parseInt(over.id)) {
                            if (!table.attributes.includes(attribute.label)) {
                                return {
                                    ...table,
                                    attributes: [
                                        ...table.attributes,
                                        { label: attribute.label, isPrimaryKey: false, isForeignKey: false },
                                    ],
                                };
                            }
                        }
                        return table;
                    })
                );
            }
        }
    };

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
                className="bg-green-300 px-4 py-2 rounded shadow cursor-pointer mb-2"
            >
                {label}
            </div>
        );
    };

    const DroppableTable = ({ table }) => {
        const { setNodeRef } = useDroppable({ id: table.id });

        const handleReset = () => {
            setTableData((prevTables) =>
                prevTables.map((t) => {
                    if (t.id === table.id) {
                        return { ...t, attributes: [] }; // Reset attributes tabel
                    }
                    return t;
                })
            );
        };

        const togglePrimaryKey = (attributeLabel) => {
            setTableData((prevTables) =>
                prevTables.map((t) => {
                    if (t.id === table.id) {
                        return {
                            ...t,
                            attributes: t.attributes.map((attr) =>
                                attr.label === attributeLabel
                                    ? { ...attr, isPrimaryKey: !attr.isPrimaryKey }
                                    : attr
                            ),
                        };
                    }
                    return t;
                })
            );
        };

        const toggleForeignKey = (attributeLabel) => {
            setTableData((prevTables) =>
                prevTables.map((t) => {
                    if (t.id === table.id) {
                        return {
                            ...t,
                            attributes: t.attributes.map((attr) =>
                                attr.label === attributeLabel
                                    ? { ...attr, isForeignKey: !attr.isForeignKey }
                                    : attr
                            ),
                        };
                    }
                    return t;
                })
            );
        };

        useEffect(() => {
            if (table.ref?.current) {
                setNodeRef(table.ref.current); // Menetapkan ref ke elemen tabel
            }
        }, [setNodeRef, table.ref]);

        return (
            <div
                ref={table.ref}
                className="border p-4 rounded-lg bg-gray-100 shadow-md min-h-[100px]"
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
                    {table.attributes.map((attr, index) => (
                        <li
                            key={index}
                            className="bg-blue-100 px-2 py-1 rounded my-1"
                        >
                            {attr.label}
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => togglePrimaryKey(attr.label)}
                                    className={`${
                                        attr.isPrimaryKey
                                            ? "bg-blue-500"
                                            : "bg-blue-300"
                                    } text-white px-2 py-1 rounded`}
                                >
                                    PK
                                </button>
                                <button
                                    onClick={() => toggleForeignKey(attr.label)}
                                    className={`${
                                        attr.isForeignKey
                                            ? "bg-yellow-500"
                                            : "bg-yellow-300"
                                    } text-white px-2 py-1 rounded`}
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

                    if (relation.to < relation.from) {
                        x1 = fromRect.left;
                        y1 = fromRect.top + fromRect.height / 2;
                        x2 = toRect.right;
                        y2 = toRect.top + toRect.height / 2;
                    } else {
                        x1 = fromRect.right;
                        y1 = fromRect.top + fromRect.height / 2;
                        x2 = toRect.left;
                        y2 = toRect.top + toRect.height / 2;
                    }

                    const middleX = (x1 + x2) / 2;
                    const offset = 20 * relations.indexOf(relation);

                    return {
                        path: `M ${x1},${y1 + offset} H ${middleX} V ${y2 + offset} H ${x2}`,
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
            <svg className="absolute inset-0 pointer-events-none z-50 w-full h-full">
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

    return (
        <AuthenticatedLayout header={<>Drag and drop</>}>
            <Head title="Drag and Drop" />
            <div className="max-w-7xl mx-auto p-6">
                <DndContext onDragEnd={handleDragEnd}>
                    <div className="flex flex-col gap-4">
                        <div
                            className={`grid gap-24 ${
                                tableData.length === 1
                                    ? "grid-cols-1"
                                    : tableData.length === 2
                                    ? "grid-cols-2"
                                    : tableData.length === 3
                                    ? "grid-cols-3"
                                    : tableData.length === 4
                                    ? "grid-cols-4"
                                    : "grid-cols-5"
                            }`}
                        >
                            {tableData.map((table) => (
                                <DroppableTable key={table.id} table={table} />
                            ))}
                        </div>

                        <div className="w-full flex justify-center">
                            <div className="w-4/12 justify-center border p-4 bg-gray-50 rounded shadow">
                                <h3 className="font-bold mb-2">
                                    Available Attributes
                                </h3>
                                {attributesPool.map((attr) => (
                                    <DragItem
                                        key={attr.id}
                                        id={attr.id}
                                        label={attr.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <Connections relations={relationsData} tables={tableData} />
                </DndContext>
            </div>
        </AuthenticatedLayout>
    );
};

export default GameBoard;

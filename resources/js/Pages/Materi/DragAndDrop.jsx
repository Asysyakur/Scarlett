import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Draggable from "./components/Draggable";
import Droppable from "./components/Droppable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

// Function to shuffle an array
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [
      shuffledArray[j],
      shuffledArray[i],
    ];
  }
  return shuffledArray;
};

const initialChallenges = [
  {
    id: 1,
    title: "Tantangan 1: Susun Kode Pengulangan",
    description:
      "Susun kode berikut untuk mencetak angka dari 1 hingga 5 menggunakan loop.",
    initialCodeBlocks: [
      {
        id: 1,
        text: "",
        correctCodePieceId: 4,
        placeholder: "Define function",
      },
      {
        id: 2,
        text: "",
        correctCodePieceId: 1,
        placeholder: "Start loop",
      },
      {
        id: 3,
        text: "",
        correctCodePieceId: 2,
        placeholder: "Print number",
      },
      {
        id: 4,
        text: "",
        correctCodePieceId: 3,
        placeholder: "Close loop and function",
      },
    ],
    initialCodePieces: [
      { id: 1, text: "for (let i = 1; i <= 5; i++) {" },
      { id: 2, text: "  console.log(i);" },
      { id: 3, text: "}" },
      { id: 4, text: "function printNumbers() {" },
    ],
  },
];

export default function DragAndDrop() {
  const [xp, setXp] = useState(parseInt(localStorage.getItem("xp"), 10) || 0);
  const [hp, setHp] = useState(parseInt(localStorage.getItem("hp"), 10) || 100);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showHint, setShowHint] = useState(false);

  const { initialCodeBlocks, initialCodePieces, title, description } =
    initialChallenges[currentChallenge];

  const [codeBlocks, setCodeBlocks] = useState([]);
  const [codePieces, setCodePieces] = useState([]);
  const [matched, setMatched] = useState({});
  const [droppedPositions, setDroppedPositions] = useState({});

  // Initialize code blocks and pieces
  useEffect(() => {
    setCodeBlocks(initialCodeBlocks);
    setCodePieces(shuffleArray(initialCodePieces));
    setMatched({});
    setDroppedPositions({});
  }, [currentChallenge]);

  // Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      const codeBlockId = over.id;
      const codePieceId = active.id;

      const selectedCodePiece = codePieces.find(
        (piece) => piece.id === codePieceId
      );

      setCodeBlocks((prevBlocks) =>
        prevBlocks.map((block) =>
          block.id === codeBlockId
            ? { ...block, text: selectedCodePiece.text }
            : block
        )
      );

      // Store the drop position for persistence
      setDroppedPositions((prev) => ({
        ...prev,
        [codeBlockId]: { x: over.rect.left, y: over.rect.top },
      }));

      setMatched((prev) => ({ ...prev, [codeBlockId]: codePieceId }));
    }
  };

  // Validate if the code is correct
  const validateCode = () => {
    return codeBlocks.every(
      (block) => matched[block.id] === block.correctCodePieceId
    );
  };

  // Handle code checking
  const handleCheckCode = () => {
    if (validateCode()) {
      const newXp = xp + 100;
      setXp(newXp);
      setModalMessage(`Selamat! Anda mendapatkan 100 XP. Total XP: ${newXp}`);
      localStorage.setItem("xp", newXp);
    } else {
      const newHp = hp - 20;
      setHp(newHp);
      setModalMessage(`Salah! HP Anda berkurang 20. Sisa HP: ${newHp}`);
      localStorage.setItem("hp", newHp);
      resetGame();
    }
    setShowModal(true);
  };

  // Reset game state
  const resetGame = () => {
    setCodeBlocks(initialCodeBlocks);
    setCodePieces(shuffleArray(initialCodePieces));
    setMatched({});
  };

  const closeModal = () => {
    setShowModal(false);
    if (validateCode()) {
      if (currentChallenge >= initialChallenges.length - 1) {
        console.log("All challenges completed!");
      } else {
        setCurrentChallenge((prev) => prev + 1); // Proceed to next challenge
      }
    }
  };

  const handleHint = () => setShowHint(true);

  return (
    <AuthenticatedLayout header={<>Materi</>}>
      <Head title="Materi" />
      <DndContext onDragEnd={handleDragEnd}>
        <div className="p-6 bg-gradient-to-b from-blue-300 to-blue-500 min-h-screen text-white">
          <h1 className="text-4xl font-bold text-center">Drag and Drop Kode</h1>

          <div className="mt-4 text-center">
            <p className="text-2xl font-semibold">
              <strong>XP:</strong> {xp} | <strong>HP:</strong> {hp}
            </p>
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-lg mb-4">{description}</p>
            <button
              onClick={handleHint}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Tampilkan Petunjuk
            </button>
            {showHint && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-lg">
                  Petunjuk: Pertimbangkan urutan kode dengan logika yang benar.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <div className="w-1/2 pr-4">
              <h2 className="text-xl mb-4">Susun Kode Berikut:</h2>
              <div className="space-y-4">
                {codeBlocks.map((block) => (
                  <Droppable key={block.id} id={block.id} position={droppedPositions[block.id]}>
                    <div className="bg-white p-4 text-blue-900 rounded-lg shadow-md text-lg font-mono transition-transform hover:scale-105 hover:shadow-lg">
                      {block.text || block.placeholder}
                    </div>
                  </Droppable>
                ))}
              </div>
            </div>

            <div className="w-1/2 pl-4">
              <h2 className="text-xl mb-4">Potongan Kode</h2>
              <div className="space-y-4">
                {codePieces.map(
                  (piece) =>
                    !Object.values(matched).includes(piece.id) && (
                      <Draggable key={piece.id} id={piece.id}>
                        <div className="bg-yellow-400 p-4 text-gray-800 rounded-lg shadow-md text-lg font-mono transition-transform hover:scale-105 hover:shadow-lg">
                          {piece.text}
                        </div>
                      </Draggable>
                    )
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleCheckCode}
              className="px-6 py-3 bg-green-500 text-white rounded-full shadow-lg text-lg hover:bg-green-600 transition-all"
            >
              Periksa Kode
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black p-8 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Hasil</h2>
              <p className="text-lg">{modalMessage}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </DndContext>
    </AuthenticatedLayout>
  );
}

"use client";

import Piece from "./Piece";
import { useRef } from "react";
import useGameContext from "@/app/context";
import arbiter from "@/arbiter/arbitre";

export default function Pieces() {
  const { positions, setPositions, turn, setTurn } = useGameContext();

  const boardRef = useRef();

  const calcCords = (e) => {
    const { top, left, width } = boardRef.current.getBoundingClientRect();
    const size = width / 8;
    const y = Math.floor((e.clientX - left) / size);
    const x = Math.floor((e.clientY - top) / size);

    return { x, y };
  };

  const onDrop = (e) => {
    e.preventDefault();
    const { x, y } = calcCords(e);
    const [piece, rank, file] = e.dataTransfer.getData("text").split(",");
    if (!piece || !rank || !file) return;

    const isWhite = piece[0] === "w";
    const validMoves = arbiter(
      piece,
      positions,
      parseInt(rank),
      parseInt(file),
      isWhite
    );

    // Check if the drop position is valid
    if (validMoves.some(([validX, validY]) => validX === x && validY === y)) {
      const newPositions = JSON.parse(JSON.stringify(positions));
      newPositions[rank][file] = "";
      newPositions[x][y] = piece;
      setPositions(newPositions);

      // Switch turn
      setTurn(turn === "w" ? "b" : "w");
    }
  };

  return (
    <div
      ref={boardRef}
      className=" absolute top-0 left-0 ml-[18px]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {positions.map((row, i) => (
        <div className="flex" key={i}>
          {row.map((piece, j) => (
            <Piece piece={piece} rank={i} file={j} key={j} />
          ))}
        </div>
      ))}
    </div>
  );
}

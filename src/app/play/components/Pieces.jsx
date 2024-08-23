"use client";

import { initialPostions } from "@/lib";
import Piece from "./Piece";
import { useState, useRef } from "react";

export default function Pieces() {
  const [positions, setPositions] = useState(initialPostions());

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
    if (!piece) return; // to prevent dropping empty tiles errors
    const newPositions = JSON.parse(JSON.stringify(positions));
    newPositions[rank][file] = "";
    newPositions[x][y] = piece;
    setPositions(newPositions);
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

"use client";

import Piece from "./Piece";
import { useRef } from "react";
import useGameContext from "@/app/context";
import { checkGameState } from "@/arbiter/arbitre";

export default function Pieces() {
  const {
    positions,
    setPositions,
    turn,
    setTurn,
    gameStatus,
    setGameStatus,
    setPrevPositions,
    validMovesS,
    setValidMovesS,
    castling,
  } = useGameContext();

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

    // Check if the drop position is valid
    if (validMovesS.some(([validX, validY]) => validX === x && validY === y)) {
      setPrevPositions(JSON.parse(JSON.stringify(positions)));

      const newPositions = JSON.parse(JSON.stringify(positions));

      // En Passant capture: Check if the move is en passant
      if (piece[1] === "p" && file !== y && !positions[x][y]) {
        // Capture the opponent's pawn
        const captureRank = isWhite ? x + 1 : x - 1;
        newPositions[captureRank][y] = "";
      }

      newPositions[rank][file] = "";
      newPositions[x][y] = piece;

      // Check for promotion
      if (piece[1] === "p" && (x === 0 || x === 7)) {
        let promotionPiece;
        do {
          promotionPiece = prompt("Promote to (q, r, b, n):", "q");
        } while (
          promotionPiece &&
          !["q", "r", "b", "n"].includes(promotionPiece)
        );

        if (promotionPiece) {
          newPositions[x][y] = isWhite
            ? `w${promotionPiece}`
            : `b${promotionPiece}`;
        }
      }

      // check for castling move
      if (piece[1] === "k" && Math.abs(y - file) === 2) {
        const rookFile = y === 6 ? 7 : 0;
        const rook = isWhite ? "wr" : "br";
        newPositions[x][y - 1] = newPositions[x][rookFile];
        newPositions[x][rookFile] = "";
      }

      // Update castling rights
      if (piece === "wk") {
        castling.w.king = false;
        castling.w.queen = false;
      } else if (piece === "bk") {
        castling.b.king = false;
        castling.b.queen = false;
      } else if (piece === "wr" && file === 0) {
        castling.w.queen = false;
      } else if (piece === "wr" && file === 7) {
        castling.w.king = false;
      } else if (piece === "br" && file === 0) {
        castling.b.queen = false;
      } else if (piece === "br" && file === 7) {
        castling.b.king = false;
      }

      setPositions(newPositions);

      setValidMovesS([]);

      //update game status
      const newStatus = checkGameState(newPositions, !isWhite);
      if (newStatus !== gameStatus) {
        setGameStatus(newStatus);
      }

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

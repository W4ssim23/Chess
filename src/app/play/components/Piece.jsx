import { bb, bk, bn, bp, bq, br, wb, wk, wn, wp, wq, wr } from "@/assets";
import Image from "next/image";
import useGameContext from "@/app/context";
import arbiter from "@/arbiter/arbitre";

const Piece = ({ piece, rank, file }) => {
  const { turn, setValidMovesS, positions, prevPositions, castling } =
    useGameContext();

  const onDragStart = (e) => {
    if (!piece) return;

    // Check if it's the right turn
    const isWhitePiece = piece.startsWith("w");
    const isCorrectTurn =
      (turn === "w" && isWhitePiece) || (turn === "b" && !isWhitePiece);

    if (!isCorrectTurn) return;

    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);

    const moves = arbiter(
      piece,
      positions,
      prevPositions,
      parseInt(rank),
      parseInt(file),
      isWhitePiece,
      castling
    );
    setValidMovesS(moves);
  };

  const onDragEnd = (e) => {
    e.target.style.display = "block";
    setValidMovesS([]);
  };

  return (
    <div
      className="flex items-center justify-center sm:w-[60px] w-[40px] sm:h-[60px] h-[40px]"
      draggable={!!piece}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {piece && (
        <Image
          src={piecePicture(piece)}
          alt={piece}
          priority
          className="w-full h-full"
        />
      )}
    </div>
  );
};

export default Piece;

const piecePicture = (piece) => {
  switch (piece) {
    case "wr":
      return wr;
    case "wn":
      return wn;
    case "wb":
      return wb;
    case "wq":
      return wq;
    case "wk":
      return wk;
    case "wp":
      return wp;
    case "br":
      return br;
    case "bn":
      return bn;
    case "bb":
      return bb;
    case "bq":
      return bq;
    case "bk":
      return bk;
    case "bp":
      return bp;
    default:
      return "";
  }
};

import { bb, bk, bn, bp, bq, br, wb, wk, wn, wp, wq, wr } from "@/assets";
import Image from "next/image";

const Piece = ({ piece, rank, file }) => {
  return (
    <div
      className="flex items-center justify-center sm:w-[60px] w-[40px] sm:h-[60px] h-[40px]"
      draggable={true}
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

import Piece from "./Piece";

export default function Pieces() {
  const positions = new Array(8).fill("").map(() => new Array(8).fill(""));
  positions[0][0] = "wr";
  positions[7][7] = "br";

  return (
    <div className=" absolute top-0 left-0 ml-[18px]">
      {positions.map((row, i) => (
        <div className="flex">
          {row.map((piece, j) => (
            <Piece piece={piece} rank={i} file={j} />
          ))}
        </div>
      ))}
    </div>
  );
}

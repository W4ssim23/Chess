"use client";

import { getCharacter } from "@/lib";
import Pieces from "./Pieces";
import MatchResult from "./MatchResult";

import useGameContext from "@/app/context";

const Board = () => {
  //initialize ranks and files
  const ranks = Array(8)
    .fill()
    .map((_, i) => 8 - i);
  const files = Array(8)
    .fill()
    .map((_, i) => i + 1);

  const { validMovesS } = useGameContext();

  //the function that gives the style for each tile
  const getClassName = (i, j) => {
    let class_name =
      "relative sm:w-[60px] w-[40px] sm:h-[60px] h-[40px] flex items-center justify-center";
    class_name += (i + j) % 2 === 0 ? " bg-[#B48764]" : " bg-[#F0D8B6]";

    if (validMovesS.some(([x, y]) => x === i && y === j)) {
      class_name += " bg-opacity-50 bg-[#F0D8B6] border-2 border-gray-500";
    }

    return class_name;
  };

  return (
    <div className="relative flex flex-col mr-2">
      {ranks.map((rank, i) => (
        <div className="flex items-center" key={rank}>
          {/* display the rank number */}
          <div className="w-[10px] text-center text-[#B48764] items-center justify-center mr-2">
            {rank}
          </div>
          {/* ------- */}
          <div className="relative flex">
            {" "}
            {files.map((file, j) => (
              <div
                key={getCharacter(file) + "" + rank}
                //    i={i}
                //    j={j}
                className={getClassName(i, j)}
              >
                {/* {rank}
                {getCharacter(j + 1)} */}
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* display files letters */}
      <div className="flex items-center justify-center ml-4">
        {files.map((file, i) => (
          <div
            className="w-[40px] text-[#B48764] sm:w-[60px] text-center"
            key={file}
          >
            {getCharacter(file)}
          </div>
        ))}
      </div>
      {/* ------- */}

      {/* display the pieces */}
      <Pieces />
      {/* ------- */}

      {/* display the match result */}
      <MatchResult />
      {/* ------- */}
    </div>
  );
};

export default Board;

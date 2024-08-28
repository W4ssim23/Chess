"use client";

import useGameContext from "@/app/context";

export default function MatchResult() {
  const { gameStatus, turn } = useGameContext();
  if (gameStatus === "ongoing") return null;
  return (
    <div className="absolute top-0 left-0 ml-[18px] w-full h-full flex items-center justify-center">
      <div className="w-[50%] h-[20%] mr-[18px] flex items-center justify-center bg-[#F0D8B6] border-8 border-gray-600 shadow-2xl rounded-md">
        <div className="text-center text-xl">
          {gameStatus === "checkmate"
            ? turn === "w"
              ? "Black Won !"
              : "White Won !"
            : "Stalemate"}
        </div>
      </div>
    </div>
  );
}

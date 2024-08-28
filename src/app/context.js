import React, { createContext, useState, useContext } from "react";
import { initialPostions } from "@/lib";

const gameContext = createContext();

export const GameProvider = ({ children }) => {
  const [positions, setPositions] = useState(initialPostions());
  const [prevPositions, setPrevPositions] = useState(initialPostions());
  const [turn, setTurn] = useState("w");
  const [gameStatus, setGameStatus] = useState("ongoing");
  const [validMovesS, setValidMovesS] = useState([]);
  const [castling, setCastling] = useState({
    w: { king: true, queen: true },
    b: { king: true, queen: true },
  });

  const contextValue = {
    positions,
    setPositions,
    turn,
    setTurn,
    validMovesS,
    setValidMovesS,
    gameStatus,
    setGameStatus,
    prevPositions,
    setPrevPositions,
    castling,
    setCastling,
  };

  return (
    <gameContext.Provider value={contextValue}>{children}</gameContext.Provider>
  );
};

const useGameContext = () => {
  const context = useContext(gameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

export default useGameContext;

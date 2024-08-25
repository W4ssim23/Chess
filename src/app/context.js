import React, { createContext, useState, useContext } from "react";
import { initialPostions } from "@/lib";

const gameContext = createContext();

export const GameProvider = ({ children }) => {
  const [positions, setPositions] = useState(initialPostions());
  const [turn, setTurn] = useState("w");

  const contextValue = {
    positions,
    setPositions,
    turn,
    setTurn,
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

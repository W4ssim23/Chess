"use client";

import { GameProvider } from "./context";

export const AppProvider = ({ children }) => {
  return <GameProvider>{children}</GameProvider>;
};

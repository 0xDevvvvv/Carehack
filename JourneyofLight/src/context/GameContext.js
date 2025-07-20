import React, { createContext, useContext, useState } from "react";
import useGameLogic from "../hooks/useGameLogic";

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const gameLogic = useGameLogic();

  return (
    <GameContext.Provider value={gameLogic}>{children}</GameContext.Provider>
  );
};

import React from "react";
import { useGame } from "../../context/GameContext";

export function Controls() {
  const { actions, isMuted } = useGame();

  return (
    <div className="controls-panel">
      <button onClick={actions.resetLevel}>Reset Level</button>
      {/* Undo button could be implemented here */}
      {/* Add the Mute/Unmute button */}
      <button onClick={actions.toggleMute} aria-label="Toggle Sound">
        {isMuted ? "Unmute 🔇" : "Mute 🔊"}
      </button>
    </div>
  );
}

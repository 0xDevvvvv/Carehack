import React, { useState } from "react";
import { useGame } from "../../context/GameContext";
import { Inventory } from "./Inventory";
import { Controls } from "./Controls";
import { SettingsPanel } from "./SettingsPanel";
import { Assistant } from "./Assistant"; // <-- Import the new component

export function HUD() {
  const [showSettings, setShowSettings] = useState(false);
  const { gameState, actions, assistantMessage, isAssistantLoading } =
    useGame(); // <-- Get new state

  return (
    <>
      <div className="hud-top-left">
        <h1>Journey of Light</h1>
        <p>Help Arjun reach the end of the path.</p>
      </div>

      <div className="hud-bottom-left">
        <Inventory />
        <Controls />
        <Assistant message={assistantMessage} isLoading={isAssistantLoading} />
      </div>

      <div className="hud-top-right">
        <button
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Game Settings"
        >
          ⚙️
        </button>
        {showSettings && <SettingsPanel />}
      </div>

      {gameState === "complete" && (
        <div className="level-complete-modal">
          <h2>Path Complete!</h2>
          <p>Arjun can continue his journey.</p>
          <button onClick={actions.nextLevel}>Next Level</button>
        </div>
      )}
    </>
  );
}

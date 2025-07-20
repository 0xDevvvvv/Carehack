import React from "react";
import { useGame } from "../../context/GameContext";

export function SettingsPanel() {
  const { isHighContrast, actions } = useGame();

  return (
    <div className="settings-panel">
      <h4>Settings</h4>
      <label>
        <input
          type="checkbox"
          checked={isHighContrast}
          onChange={actions.toggleHighContrast}
        />
        High Contrast Mode
      </label>
      {/* Add more settings like sound volume here */}
    </div>
  );
}

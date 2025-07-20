import React from "react";
import { useGame } from "../../context/GameContext";

export function Inventory() {
  const { inventory, selectedObject, actions } = useGame();

  const handleSelect = (item) => {
    if (item.count > 0) {
      actions.setSelectedObject(item);
    }
  };

  return (
    <div
      className="inventory-panel"
      role="toolbar"
      aria-label="Object Inventory"
    >
      <h3>Light Objects</h3>
      <ul>
        {inventory.map((item) => (
          <li
            key={item.type}
            className={
              selectedObject?.type === item.type
                ? "selected"
                : item.count === 0
                ? "disabled"
                : ""
            }
            onClick={() => handleSelect(item)}
            onKeyPress={(e) =>
              (e.key === "Enter" || e.key === " ") && handleSelect(item)
            }
            tabIndex={item.count > 0 ? 0 : -1}
            role="button"
            aria-label={`${item.type} (count: ${item.count})`}
            aria-pressed={selectedObject?.type === item.type}
          >
            <div className="item-icon">{item.type === "block" ? "■" : "▬"}</div>
            <div className="item-name">{item.type}</div>
            <div className="item-count">x {item.count}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

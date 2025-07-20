// src/components/game/LightObject.js

import React from "react";

// Define geometries for each object type
const geometries = {
  block: <boxGeometry args={[4, 0.5, 4]} />,
  corner: <boxGeometry args={[4, 0.5, 4]} />, // Visually the same, but could be L-shaped
  bridge: <boxGeometry args={[8, 0.5, 4]} />, // A longer block
};

export function LightObject({ type = "block", position, rotation }) {
  // A simple visual distinction for the corner piece
  const color = type === "corner" ? "#c8a2c8" : "#f0e68c";

  return (
    <mesh position={position} rotation={rotation} castShadow>
      {geometries[type] || geometries.block}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

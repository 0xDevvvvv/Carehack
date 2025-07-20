import React from "react";
import { useGame } from "../../context/GameContext";
import { LightObject } from "./LightObject";

// A generic component for a single path piece
function PathPiece({ position, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <boxGeometry args={[4, 0.5, 4]} />
      <meshStandardMaterial color="#a0a0a0" />
    </mesh>
  );
}

export default function PathManager() {
  const { levelData, placedObjects } = useGame();

  return (
    <group>
      {/* Render initial path pieces from level data */}
      {levelData.path.map((piece, index) => (
        <PathPiece
          key={`path-${index}`}
          position={piece.position}
          rotation={piece.rotation}
        />
      ))}

      {/* Render player-placed objects */}
      {placedObjects.map((obj) => (
        <LightObject key={obj.id} {...obj} />
      ))}

      {/* Render target areas (visual cues for the player) */}
      {levelData.solution.map((pos, index) => (
        <mesh key={`target-${index}`} position={[pos[0], pos[1] - 0.2, pos[2]]}>
          <boxGeometry args={[4.2, 0.1, 4.2]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

import React from "react";
import { useGame } from "../../context/GameContext";

export default function Ground() {
  const { selectedObject, actions } = useGame();

  const handlePlaceObject = (e) => {
    // Stop propagation to prevent OrbitControls from firing
    e.stopPropagation();
    if (selectedObject) {
      // The click event's `point` property gives the intersection point in 3D space
      const roundedPosition = {
        x: Math.round(e.point.x / 4) * 4,
        y: 0.25, // Assuming ground is at y=0 and object height is 0.5
        z: Math.round(e.point.z / 4) * 4,
      };
      actions.placeObject(roundedPosition, selectedObject.type);
    }
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
      onClick={handlePlaceObject}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#556b2f" />
    </mesh>
  );
}

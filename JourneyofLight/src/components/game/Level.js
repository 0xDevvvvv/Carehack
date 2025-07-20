import React from "react";
import { OrbitControls, Sky, Stars } from "@react-three/drei";
import Ground from "./Ground";
import PathManager from "./PathManager";
import Arjun from "./Arjun";
import { useGame } from "../../context/GameContext";

export default function Level() {
  const { levelData } = useGame();

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[10, 20, 5]}
        intensity={1.5}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Sky sunPosition={[10, 20, 5]} />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <Ground />
      <PathManager />
      <Arjun waypoints={levelData.waypoints} />

      <OrbitControls
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={15}
        maxDistance={40}
      />
    </>
  );
}

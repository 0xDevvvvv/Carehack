import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { GameProvider } from "./context/GameContext";
import Level from "./components/game/Level";
import { HUD } from "./components/ui/HUD";
import { Loader } from "@react-three/drei";

function App() {
  return (
    <GameProvider>
      <div id="game-container">
        <HUD />
        <Canvas shadows camera={{ position: [10, 15, 25], fov: 60 }}>
          <Suspense fallback={null}>
            <Level />
          </Suspense>
        </Canvas>
        <Loader />
      </div>
    </GameProvider>
  );
}

export default App;

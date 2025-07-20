import { useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import level1 from "../levels/level1.json";
import level2 from "../levels/level2.json";
import level3 from "../levels/level3.json";
import { getGeminiResponse } from "../api/gemini";
import { speak } from "../utils/speech";

const levels = [level1, level2, level3];
const placeSound = new Audio("/sounds/place_object.mp3");
const completeSound = new Audio("/sounds/level_complete.mp3");

export default function useGameLogic() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [levelData, setLevelData] = useState(levels[currentLevelIndex]);
  const [placedObjects, setPlacedObjects] = useState([]);
  const [inventory, setInventory] = useState(levelData.inventory);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isPathComplete, setIsPathComplete] = useState(false);
  const [gameState, setGameState] = useState("playing"); // playing, complete, menu
  const [isHighContrast, setIsHighContrast] = useState(false);

  const [assistantMessage, setAssistantMessage] = useState(
    "Select an object and click on the ground to place it!"
  );
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  // Add this new state for the mute toggle
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("high-contrast", isHighContrast);
  }, [isHighContrast]);

  const loadLevel = useCallback((levelIndex) => {
    const newLevelData = levels[levelIndex];
    setLevelData(newLevelData);
    setPlacedObjects([]);
    setInventory(newLevelData.inventory);
    setIsPathComplete(false);
    setGameState("playing");
    setSelectedObject(null);
  }, []);

  const nextLevel = () => {
    const nextIndex = (currentLevelIndex + 1) % levels.length;
    setCurrentLevelIndex(nextIndex);
    loadLevel(nextIndex);
  };

  const resetLevel = () => {
    loadLevel(currentLevelIndex);
  };

  const placeObject = useCallback(
    async (position, type) => {
      const inventoryItem = inventory.find((item) => item.type === type);
      if (inventoryItem && inventoryItem.count > 0) {
        const newObject = {
          id: Date.now(),
          type: type,
          position: [position.x, position.y, position.z],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        };

        const updatedPlacedObjects = [...placedObjects, newObject];
        setPlacedObjects(updatedPlacedObjects);

        setInventory((prev) =>
          prev.map((item) =>
            item.type === type ? { ...item, count: item.count - 1 } : item
          )
        );
        placeSound.play();
        setSelectedObject(null);

        // Call Gemini for a hint after placing an object
        setIsAssistantLoading(true);
        const response = await getGeminiResponse(
          levelData,
          updatedPlacedObjects,
          newObject
        );
        setAssistantMessage(response);
        setIsAssistantLoading(false);

        // Speak the response only if not muted
        if (!isMuted) {
          speak(response);
        }
      }
    },
    [inventory, placedObjects, levelData]
  );

  const checkPathCompletion = useCallback(() => {
    if (placedObjects.length !== levelData.solution.length) return false;

    const solutionPoints = levelData.solution.map(
      (p) => new THREE.Vector3(...p)
    );
    const placedPoints = placedObjects.map(
      (obj) => new THREE.Vector3(...obj.position)
    );

    const allPointsMatch = solutionPoints.every((solPoint) =>
      placedPoints.some((placedPoint) => placedPoint.distanceTo(solPoint) < 0.5)
    );

    if (allPointsMatch) {
      setIsPathComplete(true);
      setGameState("complete");
      completeSound.play();
    }
    return allPointsMatch;
  }, [placedObjects, levelData.solution]);

  useEffect(() => {
    if (placedObjects.length > 0) {
      checkPathCompletion();
    }
  }, [placedObjects, checkPathCompletion]);

  // Add a new action to toggle the mute state
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    // If unmuting, stop any previous speech just in case
    if (!isMuted) {
      window.speechSynthesis.cancel();
    }
  };

  return {
    levelData,
    placedObjects,
    inventory,
    selectedObject,
    isMuted,
    isPathComplete,
    gameState,
    isHighContrast,
    assistantMessage, // Add this
    isAssistantLoading,
    actions: {
      nextLevel,
      resetLevel,
      placeObject,
      setSelectedObject,
      toggleMute,
      setGameState,
      toggleHighContrast: () => setIsHighContrast((prev) => !prev),
    },
  };
}

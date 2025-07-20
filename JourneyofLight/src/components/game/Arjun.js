import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "../../context/GameContext";

export default function Arjun({ waypoints }) {
  const group = useRef();
  const { scene } = useGLTF("/models/arjun.glb"); // Assuming you have a simple character model
  const { isPathComplete } = useGame();

  const currentWaypoint = useRef(0);
  const speed = 2.5; // units per second

  useEffect(() => {
    // Reset position when level changes
    if (group.current && waypoints.length > 0) {
      group.current.position.set(...waypoints[0]);
      currentWaypoint.current = 0;
    }
  }, [waypoints]);

  useFrame((state, delta) => {
    if (
      !isPathComplete ||
      !group.current ||
      currentWaypoint.current >= waypoints.length - 1
    ) {
      return;
    }

    const targetPosition = new THREE.Vector3(
      ...waypoints[currentWaypoint.current + 1]
    );
    const currentPosition = group.current.position;

    if (currentPosition.distanceTo(targetPosition) > 0.1) {
      const direction = targetPosition.clone().sub(currentPosition).normalize();
      group.current.position.add(direction.multiplyScalar(speed * delta));

      // Make Arjun look in the direction he is moving
      group.current.lookAt(targetPosition);
    } else {
      // Reached waypoint, move to the next one
      currentWaypoint.current += 1;
    }
  });

  // Use a placeholder if model is not available
  return (
    <group ref={group} dispose={null}>
      {scene ? (
        <primitive object={scene} scale={0.8} />
      ) : (
        <mesh castShadow>
          <boxGeometry args={[0.8, 1.8, 0.8]} />
          <meshStandardMaterial color="dodgerblue" />
        </mesh>
      )}
    </group>
  );
}

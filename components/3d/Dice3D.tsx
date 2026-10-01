"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Dice3DProps {
  position?: [number, number, number];
  color?: string;
  onRoll?: (value: number) => void;
}

export function Dice3D({ position = [0, 1.2, 0], color = "#8b5cf6", onRoll }: Dice3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollSpeed, setRollSpeed] = useState(0);
  const [hovered, setHovered] = useState(false);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setRollSpeed(18); // Fast spin impulse

    const result = Math.floor(Math.random() * 6) + 1;
    onRoll?.(result);

    setTimeout(() => {
      setIsRolling(false);
    }, 1200);
  };

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (isRolling) {
      meshRef.current.rotation.x += rollSpeed * delta;
      meshRef.current.rotation.y += rollSpeed * 1.3 * delta;
      meshRef.current.rotation.z += rollSpeed * 0.7 * delta;
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.015) * 0.3;
      setRollSpeed((s) => Math.max(0.5, s * 0.96)); // Friction damping
    } else {
      // Idle gentle float and rotation
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.002) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={hovered ? 1.12 : 1}
      onClick={rollDice}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.2}
        emissive={hovered ? "#06b6d4" : "#4c1d95"}
        emissiveIntensity={hovered ? 0.6 : 0.2}
      />
    </mesh>
  );
}

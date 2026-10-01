"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function LudoBoard3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Slow cinematic rotation and floating bob
    groupRef.current.rotation.y += 0.2 * delta;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15 - 0.4;
  });

  return (
    <group ref={groupRef} rotation={[-0.45, 0, 0]}>
      {/* Main Board Base Plate */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 0.2, 4.2]} />
        <meshStandardMaterial
          color="#0b0f19"
          metalness={0.8}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Board Outer Neon Edge Border */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[4.3, 0.15, 4.3]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#4338ca"
          emissiveIntensity={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* 4 Quadrants (Ludo Bases) */}
      {/* 1. Electric Violet Base */}
      <mesh position={[-1.2, 0.15, -1.2]}>
        <boxGeometry args={[1.5, 0.12, 1.5]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#7c3aed"
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* 2. Electric Cyan Base */}
      <mesh position={[1.2, 0.15, -1.2]}>
        <boxGeometry args={[1.5, 0.12, 1.5]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* 3. Hot Pink Base */}
      <mesh position={[-1.2, 0.15, 1.2]}>
        <boxGeometry args={[1.5, 0.12, 1.5]} />
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#e11d48"
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* 4. Amber Gold Base */}
      <mesh position={[1.2, 0.15, 1.2]}>
        <boxGeometry args={[1.5, 0.12, 1.5]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Center Finishing Home (Pyramid/Cone) */}
      <mesh position={[0, 0.35, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.7, 0.6, 4]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#a855f7"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Floating Pawn Tokens */}
      <mesh position={[-1.2, 0.45, -1.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 16]} />
        <meshStandardMaterial color="#c084fc" emissive="#9333ea" emissiveIntensity={0.6} />
      </mesh>

      <mesh position={[1.2, 0.45, -1.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 16]} />
        <meshStandardMaterial color="#67e8f9" emissive="#06b6d4" emissiveIntensity={0.6} />
      </mesh>

      <mesh position={[-1.2, 0.45, 1.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 16]} />
        <meshStandardMaterial color="#fda4af" emissive="#f43f5e" emissiveIntensity={0.6} />
      </mesh>

      <mesh position={[1.2, 0.45, 1.2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 16]} />
        <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

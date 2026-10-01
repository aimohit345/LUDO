"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Sparkles, OrbitControls } from "@react-three/drei";
import { LudoBoard3D } from "./LudoBoard3D";
import { Dice3D } from "./Dice3D";
import { SceneFallback } from "./SceneFallback";
import { useAppStore } from "@/lib/store/useAppStore";
import { Dices } from "lucide-react";

class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("3D Canvas failed to initialize, falling back to 2D optimized scene:", error);
  }

  render() {
    if (this.state.hasError) {
      return <SceneFallback />;
    }
    return this.props.children;
  }
}

export function LudoScene() {
  const { lowPowerMode } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(6);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
  }, []);

  if (!mounted) {
    return <SceneFallback />;
  }

  if (lowPowerMode || reducedMotion) {
    return <SceneFallback />;
  }

  return (
    <div className="relative w-full h-[420px] lg:h-[540px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-surface-50/80 to-surface-100/90 shadow-2xl backdrop-blur-xl">
      {/* 3D Canvas */}
      <CanvasErrorBoundary>
        <Suspense fallback={<SceneFallback />}>
          <Canvas
          dpr={[1, 1.8]} // Clamped DPR for high mobile performance
          camera={{ position: [0, 4.5, 6], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <pointLight position={[-4, 3, -2]} color="#8b5cf6" intensity={3} distance={12} />
          <pointLight position={[4, 3, 2]} color="#06b6d4" intensity={3} distance={12} />
          <pointLight position={[0, -2, 0]} color="#f43f5e" intensity={1.5} distance={8} />

          {/* Floating Particle Star Field */}
          <Sparkles count={40} scale={8} size={2.5} speed={0.4} color="#a855f7" />
          <Sparkles count={30} scale={6} size={2} speed={0.5} color="#06b6d4" />

          {/* 3D Objects */}
          <LudoBoard3D />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
            <Dice3D position={[0, 1.6, 0.4]} color="#ec4899" onRoll={(v) => setLastRoll(v)} />
          </Float>

          {/* Soft user orbit controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 4}
            rotateSpeed={0.5}
          />
        </Canvas>
      </Suspense>
      </CanvasErrorBoundary>

      {/* Floating Interactive Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100/80 backdrop-blur-md border border-white/15 text-xs text-white">
        <Dices className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: "8s" }} />
        <span>Click the 3D Dice to Roll</span>
      </div>

      {lastRoll !== null && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-100/90 backdrop-blur-md border border-pink-500/40 shadow-neon-pink text-xs font-bold text-white animate-in zoom-in-75">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          Rolled: <span className="text-base font-black text-pink-400 font-mono">{lastRoll}</span>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { RefreshCw } from "lucide-react";

// Module-level R3F references (set on dynamic import)
let useFrameHook: any = null;
let FloatComponent: any = null;
let OrbitControlsComponent: any = null;

/**
 * IgG Molecule — Small Y-shaped monomer (~150 kDa)
 * Green emissive, crosses the placental barrier.
 */
function IgGMolecule({ startPos }: { startPos: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const initialX = useRef(startPos[0]);
  const speed = useRef(0.03 + Math.random() * 0.015);

  if (useFrameHook) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFrameHook(() => {
      if (!groupRef.current) return;
      groupRef.current.rotation.x += 0.012;
      groupRef.current.rotation.y += 0.008;
      groupRef.current.position.x += speed.current;
      if (groupRef.current.position.x > 7) {
        groupRef.current.position.x = -7;
        groupRef.current.position.y = (Math.random() - 0.5) * 6;
      }
    });
  }

  return (
    <group ref={groupRef} position={startPos} scale={0.65}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 12]} />
        <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={1.5} roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={[0.18, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
        <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={1.5} roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={[-0.18, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
        <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={1.5} roughness={0.2} metalness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * IgM Molecule — Bulky pentamer (~900 kDa)
 * Red emissive, BLOCKED at the placental barrier.
 */
function IgMMolecule({ startPos }: { startPos: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const speed = useRef(0.02 + Math.random() * 0.01);

  if (useFrameHook) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFrameHook((state: any) => {
      if (!groupRef.current) return;
      groupRef.current.rotation.x += 0.008;
      groupRef.current.rotation.y += 0.01;
      groupRef.current.position.x += speed.current;

      // Block at the membrane wall
      if (groupRef.current.position.x >= -0.8 && groupRef.current.position.x < 0.2) {
        groupRef.current.position.x = -0.8;
        groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 4) * 0.008;
      }

      if (groupRef.current.position.x > 7) {
        groupRef.current.position.x = -7;
        groupRef.current.position.y = (Math.random() - 0.5) * 6;
      }
    });
  }

  return (
    <group ref={groupRef} position={startPos} scale={1.1}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#991b1b" emissiveIntensity={1.5} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.8, 12]} />
              <meshStandardMaterial color="#ef4444" emissive="#991b1b" emissiveIntensity={1.5} roughness={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * The full transplacental scene contents (rendered inside Canvas).
 */
function TransplacentalScene() {
  const porePositions: [number, number, number][] = [];
  for (let y = -3; y <= 3; y += 1.5) {
    for (let z = -3; z <= 3; z += 1.5) {
      porePositions.push([0, y, z]);
    }
  }

  const Float = FloatComponent || "group";
  const floatProps = FloatComponent ? { speed: 0.8, rotationIntensity: 0.05, floatIntensity: 0.2 } : {};

  // Generate molecule starting positions
  const molecules = [];
  for (let i = 0; i < 10; i++) {
    const y = (Math.random() - 0.5) * 6;
    const z = (Math.random() - 0.5) * 5;
    const x = -6 - Math.random() * 4;
    molecules.push({ isIgG: i % 2 === 0, pos: [x, y, z] as [number, number, number], key: i });
  }

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.6} color="#e2e8f0" />
      <directionalLight position={[5, 10, 7]} intensity={1.2} color="#06b6d4" />
      <directionalLight position={[-5, -10, -5]} intensity={0.6} color="#a855f7" />

      {/* Placental Membrane Barrier */}
      <Float {...floatProps}>
        <group>
          {/* Main membrane wall — frosted glass */}
          <mesh>
            <boxGeometry args={[0.4, 8, 8]} />
            <meshPhysicalMaterial
              color="#3b82f6"
              transparent opacity={0.25}
              roughness={0.15}
              transmission={0.5}
              thickness={0.5}
              clearcoat={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Wireframe overlay for membrane */}
          <mesh>
            <boxGeometry args={[0.42, 8.02, 8.02]} />
            <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.12} />
          </mesh>

          {/* Pore receptors */}
          {porePositions.map((pos, i) => (
            <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.35, 0.35, 0.5, 16]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#0891b2"
                emissiveIntensity={1.5}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Molecules */}
      {molecules.map((mol) =>
        mol.isIgG ? (
          <IgGMolecule key={mol.key} startPos={mol.pos} />
        ) : (
          <IgMMolecule key={mol.key} startPos={mol.pos} />
        )
      )}

      {OrbitControlsComponent && (
        <OrbitControlsComponent enableZoom={false} enablePan={false} autoRotate={false} />
      )}
    </>
  );
}

export default function Transplacental3D() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [ready, setReady] = useState(false);
  const [DynamicCanvas, setDynamicCanvas] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      import("@react-three/fiber"),
      import("@react-three/drei"),
    ]).then(([fiberMod, dreiMod]) => {
      useFrameHook = fiberMod.useFrame;
      FloatComponent = dreiMod.Float;
      OrbitControlsComponent = dreiMod.OrbitControls;
      setDynamicCanvas(() => fiberMod.Canvas);
      setReady(true);
    }).catch(() => {
      setReady(false);
    });
  }, []);

  return (
    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shadow-sm transition-colors">
      {/* 3D Canvas */}
      {ready && DynamicCanvas ? (
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="text-xs font-bold text-zinc-400 animate-pulse">Loading Simulation...</div>
          </div>
        }>
          <DynamicCanvas
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 14], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
          >
            <TransplacentalScene />
          </DynamicCanvas>
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="text-xs font-bold text-zinc-400 animate-pulse">Loading Simulation...</div>
        </div>
      )}

      {/* Header Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl glass px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-zinc-900 dark:text-white">Transplacental Transfer Simulation</span>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="pointer-events-auto flex items-center gap-1.5 rounded-xl glass px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-white/30 dark:hover:bg-zinc-800/60 transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isPlaying ? "animate-spin" : ""}`} />
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
      </div>

      {/* Molecule Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl glass text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">IgG (~150 kDa)</span>
            <span className="text-[0.65rem] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              CROSSES (Transferred)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">IgM (~900 kDa)</span>
            <span className="text-[0.65rem] text-red-600 dark:text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
              BLOCKED (Bulky Pentamer)
            </span>
          </div>
        </div>
        <div className="text-[0.65rem] text-zinc-500 dark:text-zinc-400 hidden sm:block">
          Drag to rotate 3D view
        </div>
      </div>
    </div>
  );
}

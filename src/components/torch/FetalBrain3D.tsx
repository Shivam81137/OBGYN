"use client";

import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Brain } from "lucide-react";
import * as THREE from "three";

// Dynamically import R3F to avoid SSR issues
let useFrameHook: any = null;
let FloatComponent: any = null;
let OrbitControlsComponent: any = null;
let SparklesComponent: any = null;

interface ConstellationNode {
  position: THREE.Vector3;
  radius: number;
  type: "normal" | "ventricle" | "calcification";
  phase: number;
  speed: number;
}

function GlassNeuralStructure() {
  const clusterRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);

  // Generate an abstract neural cluster shape (two anatomical lobes connected by central synapses)
  const nodes = useMemo(() => {
    const list: ConstellationNode[] = [];

    // Left & Right cluster spheres (abstract lobes)
    for (let i = 0; i < 28; i++) {
      const isRight = i % 2 === 0;
      const offsetX = isRight ? 1.3 : -1.3;
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const r = 1.2 + Math.random() * 0.9;

      // 4 ventricle nodes (cyan glowing)
      const isVentricle = i < 4;
      // 6 calcification nodes (amber glowing)
      const isCalc = i >= 4 && i < 10;

      list.push({
        position: new THREE.Vector3(
          offsetX + r * Math.sin(theta) * Math.cos(phi),
          r * Math.sin(theta) * Math.sin(phi) * 0.75,
          r * Math.cos(theta) * 1.1
        ),
        radius: isVentricle ? 0.28 : isCalc ? 0.16 : 0.14 + Math.random() * 0.12,
        type: isVentricle ? "ventricle" : isCalc ? "calcification" : "normal",
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.8,
      });
    }

    return list;
  }, []);

  // Compute connections between close nodes
  const connections = useMemo(() => {
    const list: { from: number; to: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 2.0) {
          list.push({ from: i, to: j });
        }
      }
    }
    return list;
  }, [nodes]);

  // Pre-create THREE.Line objects for connections
  const lineObjects = useMemo(() => {
    return connections.map((conn) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const mat = new THREE.LineBasicMaterial({
        color: "#06b6d4",
        transparent: true,
        opacity: 0.25,
      });
      return { line: new THREE.Line(geo, mat), conn };
    });
  }, [connections]);

  if (useFrameHook) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFrameHook((state: any, delta: number) => {
      elapsedRef.current = state.clock.elapsedTime;
      const t = state.clock.elapsedTime;

      if (clusterRef.current) {
        clusterRef.current.rotation.y += delta * 0.12;
        clusterRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      }

      // Update line vertex positions in real-time
      lineObjects.forEach(({ line, conn }) => {
        const posAttr = line.geometry.getAttribute("position") as THREE.BufferAttribute;
        const a = nodes[conn.from];
        const b = nodes[conn.to];

        const ay = a.position.y + Math.sin(t * a.speed + a.phase) * 0.1;
        const by = b.position.y + Math.sin(t * b.speed + b.phase) * 0.1;

        posAttr.setXYZ(0, a.position.x, ay, a.position.z);
        posAttr.setXYZ(1, b.position.x, by, b.position.z);
        posAttr.needsUpdate = true;
      });
    });
  }

  const Float = FloatComponent || "group";
  const floatProps = FloatComponent ? { speed: 1.0, rotationIntensity: 0.1, floatIntensity: 0.3 } : {};

  return (
    <>
      {/* Premium Glass Refraction Lighting */}
      <ambientLight intensity={0.4} color="#c4b5fd" />
      <pointLight position={[6, 6, 5]} intensity={3} color="#06b6d4" distance={20} decay={2} />
      <pointLight position={[-5, -4, -4]} intensity={2.2} color="#a855f7" distance={18} decay={2} />
      <pointLight position={[0, 3, -7]} intensity={1} color="#f97316" distance={15} decay={2} />

      {SparklesComponent && (
        <SparklesComponent count={45} scale={9} size={1.4} speed={0.2} opacity={0.3} color="#06b6d4" />
      )}

      <Float {...floatProps}>
        <group ref={clusterRef}>
          {/* Glass & Emissive Nodes */}
          {nodes.map((node, i) => {
            if (node.type === "ventricle") {
              return (
                <mesh key={i} position={[node.position.x, node.position.y, node.position.z]}>
                  <sphereGeometry args={[node.radius, 24, 24]} />
                  <meshStandardMaterial
                    color="#06b6d4"
                    emissive="#0891b2"
                    emissiveIntensity={2.5}
                    transparent
                    opacity={0.9}
                    roughness={0.1}
                  />
                </mesh>
              );
            }

            if (node.type === "calcification") {
              return (
                <mesh key={i} position={[node.position.x, node.position.y, node.position.z]}>
                  <sphereGeometry args={[node.radius, 20, 20]} />
                  <meshStandardMaterial
                    color="#f59e0b"
                    emissive="#d97706"
                    emissiveIntensity={3.0}
                    roughness={0.1}
                  />
                </mesh>
              );
            }

            // Normal frosted glass node
            return (
              <mesh key={i} position={[node.position.x, node.position.y, node.position.z]}>
                <sphereGeometry args={[node.radius, 32, 32]} />
                <meshPhysicalMaterial
                  color="#94a3b8"
                  transmission={1}
                  roughness={0.1}
                  thickness={1.5}
                  clearcoat={1.0}
                  clearcoatRoughness={0.05}
                  ior={1.5}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            );
          })}

          {/* Synaptic Connection Lines */}
          {lineObjects.map(({ line }, i) => (
            <primitive key={i} object={line} />
          ))}
        </group>
      </Float>

      {OrbitControlsComponent && (
        <OrbitControlsComponent
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI * 0.75}
          minPolarAngle={Math.PI * 0.25}
        />
      )}
    </>
  );
}

export default function FetalBrain3D() {
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
      SparklesComponent = dreiMod.Sparkles;
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
            <div className="text-xs font-bold text-zinc-400 animate-pulse">Loading 3D Visualizer...</div>
          </div>
        }>
          <DynamicCanvas
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
            camera={{ position: [0, 1.5, 9], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
          >
            <GlassNeuralStructure />
          </DynamicCanvas>
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="text-xs font-bold text-zinc-400 animate-pulse">Loading 3D Visualizer...</div>
        </div>
      )}

      {/* Header Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl glass px-3 py-1.5">
          <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold text-zinc-900 dark:text-white">3D Neural Constellation & Visualizer</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl glass text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Ventriculomegaly</span>
            <span className="text-[0.65rem] text-cyan-700 dark:text-cyan-300 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              Dilated Ventricles
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Calcifications</span>
            <span className="text-[0.65rem] text-amber-700 dark:text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Intracranial Specs
            </span>
          </div>
        </div>
        <div className="text-[0.65rem] text-zinc-500 dark:text-zinc-400">
          Drag 3D model to inspect structure
        </div>
      </div>
    </div>
  );
}

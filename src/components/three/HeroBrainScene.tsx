"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════════════════
   NEURAL CONSTELLATION
   ───────────────────────────────────────────────────────────────────────────
   A dynamic network of glowing glass spheres connected by thin luminous
   synaptic lines. Each node gently floats with sinusoidal motion while
   the entire constellation slowly rotates in 3D space.
   
   Materials use MeshPhysicalMaterial with full transmission (glass) so
   the cyan/violet lighting refracts beautifully through each node.
   ═══════════════════════════════════════════════════════════════════════════ */

interface NodeData {
  position: THREE.Vector3;
  radius: number;
  phase: number;       // Offset for sinusoidal float
  speed: number;       // Float animation speed
  amplitude: number;   // Float height range
}

interface ConnectionData {
  from: number;
  to: number;
}

/**
 * Pre-calculate node positions in a spherical cluster distribution.
 * Uses Fibonacci sphere sampling for even, organic spacing.
 */
function generateNodes(count: number, spread: number): NodeData[] {
  const nodes: NodeData[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const r = spread * (0.6 + Math.random() * 0.4);

    nodes.push({
      position: new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ),
      radius: 0.12 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
      amplitude: 0.08 + Math.random() * 0.15,
    });
  }

  return nodes;
}

/**
 * Build connections between nearby nodes (Delaunay-like proximity).
 * Only connects nodes within a max distance threshold.
 */
function generateConnections(nodes: NodeData[], maxDist: number): ConnectionData[] {
  const connections: ConnectionData[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = nodes[i].position.distanceTo(nodes[j].position);
      if (dist < maxDist) {
        connections.push({ from: i, to: j });
      }
    }
  }

  return connections;
}

/**
 * Individual glass node sphere with sinusoidal floating animation.
 */
function GlassNode({ data, elapsedRef }: { data: NodeData; elapsedRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const t = elapsedRef.current;

    // Gentle sinusoidal float on Y axis
    meshRef.current.position.y =
      data.position.y + Math.sin(t * data.speed + data.phase) * data.amplitude;

    // Subtle X/Z micro-drift
    meshRef.current.position.x =
      data.position.x + Math.sin(t * data.speed * 0.7 + data.phase + 1.5) * data.amplitude * 0.4;
    meshRef.current.position.z =
      data.position.z + Math.cos(t * data.speed * 0.5 + data.phase + 3.0) * data.amplitude * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[data.position.x, data.position.y, data.position.z]}>
      <sphereGeometry args={[data.radius, 32, 32]} />
      <meshPhysicalMaterial
        color="#b8e0f0"
        transmission={1}
        roughness={0.1}
        thickness={1.5}
        metalness={0}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
        ior={1.5}
        envMapIntensity={1.0}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

/**
 * Synaptic connection line between two nodes.
 * Uses a THREE.Line with primitive to avoid SVG <line> type conflict.
 */
function SynapticLine({
  nodes,
  connection,
  elapsedRef,
}: {
  nodes: NodeData[];
  connection: ConnectionData;
  elapsedRef: React.MutableRefObject<number>;
}) {
  // Pre-create the THREE.Line object with geometry and material
  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6); // 2 vertices × 3 components
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({ color: "#06b6d4", transparent: true, opacity: 0.2 });
    return new THREE.Line(geo, mat);
  }, []);

  useFrame(() => {
    const posAttr = lineObj.geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = elapsedRef.current;
    const a = nodes[connection.from];
    const b = nodes[connection.to];

    // Sync with animated node positions
    posAttr.setXYZ(
      0,
      a.position.x + Math.sin(t * a.speed * 0.7 + a.phase + 1.5) * a.amplitude * 0.4,
      a.position.y + Math.sin(t * a.speed + a.phase) * a.amplitude,
      a.position.z + Math.cos(t * a.speed * 0.5 + a.phase + 3.0) * a.amplitude * 0.3
    );
    posAttr.setXYZ(
      1,
      b.position.x + Math.sin(t * b.speed * 0.7 + b.phase + 1.5) * b.amplitude * 0.4,
      b.position.y + Math.sin(t * b.speed + b.phase) * b.amplitude,
      b.position.z + Math.cos(t * b.speed * 0.5 + b.phase + 3.0) * b.amplitude * 0.3
    );
    posAttr.needsUpdate = true;
  });

  return <primitive object={lineObj} />;
}

/**
 * Signal Pulse — a small glowing sphere that travels along a random connection.
 */
function SignalPulse({
  nodes,
  connection,
  delay,
  elapsedRef,
}: {
  nodes: NodeData[];
  connection: ConnectionData;
  delay: number;
  elapsedRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const t = elapsedRef.current;
    const a = nodes[connection.from];
    const b = nodes[connection.to];

    // Progress along the line (0 → 1, repeating)
    const progress = ((t * 0.3 + delay) % 1.0);

    // Animated positions of start/end nodes
    const ax = a.position.x + Math.sin(t * a.speed * 0.7 + a.phase + 1.5) * a.amplitude * 0.4;
    const ay = a.position.y + Math.sin(t * a.speed + a.phase) * a.amplitude;
    const az = a.position.z + Math.cos(t * a.speed * 0.5 + a.phase + 3.0) * a.amplitude * 0.3;

    const bx = b.position.x + Math.sin(t * b.speed * 0.7 + b.phase + 1.5) * b.amplitude * 0.4;
    const by = b.position.y + Math.sin(t * b.speed + b.phase) * b.amplitude;
    const bz = b.position.z + Math.cos(t * b.speed * 0.5 + b.phase + 3.0) * b.amplitude * 0.3;

    // Interpolate position along connection
    meshRef.current.position.set(
      ax + (bx - ax) * progress,
      ay + (by - ay) * progress,
      az + (bz - az) * progress
    );

    // Fade at edges of travel
    const fade = Math.sin(progress * Math.PI);
    meshRef.current.scale.setScalar(fade * 1.2);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial
        color="#06b6d4"
        emissive="#06b6d4"
        emissiveIntensity={4}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

/**
 * The complete Neural Constellation scene.
 * Rendered inside an R3F <Canvas> — see HeroCanvas.tsx for the wrapper.
 */
export default function HeroBrainScene() {
  const constellationRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);

  // Generate constellation data (memoized — calculated once)
  const NODE_COUNT = 35;
  const SPREAD = 3.2;
  const MAX_CONNECTION_DIST = 2.2;

  const nodes = useMemo(() => generateNodes(NODE_COUNT, SPREAD), []);
  const connections = useMemo(() => generateConnections(nodes, MAX_CONNECTION_DIST), [nodes]);

  // Pick a subset of connections for signal pulses (performance)
  const pulseConnections = useMemo(() => {
    const shuffled = [...connections].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(12, shuffled.length));
  }, [connections]);

  // Global rotation of the entire constellation
  useFrame((state, delta) => {
    elapsedRef.current = state.clock.elapsedTime;

    if (constellationRef.current) {
      constellationRef.current.rotation.y += delta * 0.08;
      constellationRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
    }
  });

  return (
    <>
      {/* ── Premium Lighting Rig ── */}

      {/* Soft violet ambient fill */}
      <ambientLight intensity={0.3} color="#c4b5fd" />

      {/* Deep cyan key light — upper right */}
      <pointLight
        position={[6, 5, 4]}
        intensity={3}
        color="#06b6d4"
        distance={20}
        decay={2}
      />

      {/* Violet accent light — lower left */}
      <pointLight
        position={[-5, -3, -3]}
        intensity={2}
        color="#8b5cf6"
        distance={18}
        decay={2}
      />

      {/* Warm rim light from behind for depth */}
      <pointLight
        position={[0, 2, -8]}
        intensity={1}
        color="#f97316"
        distance={15}
        decay={2}
      />

      {/* ── Ambient Particle Dust ── */}
      <Sparkles
        count={60}
        scale={14}
        size={1.8}
        speed={0.25}
        opacity={0.35}
        color="#06b6d4"
      />
      <Sparkles
        count={30}
        scale={12}
        size={1.2}
        speed={0.15}
        opacity={0.2}
        color="#a78bfa"
      />

      {/* ── The Neural Constellation ── */}
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.3}>
        <group ref={constellationRef}>
          {/* Glass Nodes */}
          {nodes.map((node, i) => (
            <GlassNode key={`node-${i}`} data={node} elapsedRef={elapsedRef} />
          ))}

          {/* Synaptic Connection Lines */}
          {connections.map((conn, i) => (
            <SynapticLine
              key={`line-${i}`}
              nodes={nodes}
              connection={conn}
              elapsedRef={elapsedRef}
            />
          ))}

          {/* Signal Pulses traveling along connections */}
          {pulseConnections.map((conn, i) => (
            <SignalPulse
              key={`pulse-${i}`}
              nodes={nodes}
              connection={conn}
              delay={i * 0.08}
              elapsedRef={elapsedRef}
            />
          ))}
        </group>
      </Float>
    </>
  );
}

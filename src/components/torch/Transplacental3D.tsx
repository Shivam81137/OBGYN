"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShieldAlert, CheckCircle, Info, RefreshCw } from "lucide-react";

export default function Transplacental3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredMolecule, setHoveredMolecule] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-5, -10, -5);
    scene.add(dirLight2);

    // 3. Placental Membrane Barrier (Middle Wall)
    const barrierGroup = new THREE.Group();
    scene.add(barrierGroup);

    // Membrane mesh grid
    const membraneGeo = new THREE.BoxGeometry(0.4, 8, 8);
    const membraneMat = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
    barrierGroup.add(membraneMesh);

    // Pores/receptors on membrane
    for (let y = -3; y <= 3; y += 1.5) {
      for (let z = -3; z <= 3; z += 1.5) {
        const poreGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 16);
        const poreMat = new THREE.MeshStandardMaterial({
          color: 0x00f0ff,
          emissive: 0x005577,
          roughness: 0.3,
        });
        const pore = new THREE.Mesh(poreGeo, poreMat);
        pore.rotation.z = Math.PI / 2;
        pore.position.set(0, y, z);
        barrierGroup.add(pore);
      }
    }

    // 4. Molecules Groups: IgG (Small, pass through) vs IgM (Bulky Pentamer, blocked)
    const moleculesGroup = new THREE.Group();
    scene.add(moleculesGroup);

    interface MolData {
      mesh: THREE.Group;
      type: "IgG" | "IgM";
      startX: number;
      speed: number;
      y: number;
      z: number;
      rotSpeed: number;
    }

    const molecules: MolData[] = [];

    // Helper to build Y-shaped IgG Molecule (~150 kDa)
    const createIgGMolecule = () => {
      const group = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x047857,
        roughness: 0.2,
        metalness: 0.3,
      });

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 12), mat);
      group.add(stem);

      const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12), mat);
      arm1.position.set(0.18, 0.4, 0);
      arm1.rotation.z = -Math.PI / 4;
      group.add(arm1);

      const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12), mat);
      arm2.position.set(-0.18, 0.4, 0);
      arm2.rotation.z = Math.PI / 4;
      group.add(arm2);

      group.scale.set(0.65, 0.65, 0.65);
      return group;
    };

    // Helper to build Bulky Pentamer IgM Molecule (~900 kDa)
    const createIgMMolecule = () => {
      const group = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0x991b1b,
        roughness: 0.3,
      });

      // Center J-chain sphere
      const center = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), mat);
      group.add(center);

      // 5 Y-shaped arms radiating outwards
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const armGroup = new THREE.Group();
        
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 12), mat);
        arm.position.y = 0.5;
        armGroup.add(arm);

        armGroup.rotation.z = angle;
        group.add(armGroup);
      }

      group.scale.set(1.1, 1.1, 1.1);
      return group;
    };

    // Spawn initial molecules
    for (let i = 0; i < 10; i++) {
      const isIgG = i % 2 === 0;
      const mesh = isIgG ? createIgGMolecule() : createIgMMolecule();
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 5;
      const x = -6 - Math.random() * 4;

      mesh.position.set(x, y, z);
      moleculesGroup.add(mesh);

      molecules.push({
        mesh,
        type: isIgG ? "IgG" : "IgM",
        startX: x,
        speed: isIgG ? 0.035 : 0.025,
        y,
        z,
        rotSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    // 5. Interaction Mouse Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      scene.rotation.y += deltaX * 0.008;
      scene.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 6. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isPlaying) {
        molecules.forEach((mol) => {
          mol.mesh.rotation.x += mol.rotSpeed;
          mol.mesh.rotation.y += mol.rotSpeed;

          // Move towards fetal side (left to right)
          mol.mesh.position.x += mol.speed;

          if (mol.type === "IgM") {
            // IgM is blocked at the membrane wall (x = 0)
            if (mol.mesh.position.x >= -0.7 && mol.mesh.position.x < 0.2) {
              mol.mesh.position.x = -0.7; // Bounce back / block
              mol.mesh.position.y += Math.sin(Date.now() * 0.005) * 0.01;
            }
          }

          // Reset position when off-screen right (IgG transferred)
          if (mol.mesh.position.x > 6) {
            mol.mesh.position.x = -7;
            mol.mesh.position.y = (Math.random() - 0.5) * 6;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-slate-800 bg-obsidian-950">
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Overlay Legends & Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl bg-obsidian-900/80 px-3 py-1.5 border border-slate-800 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white">Transplacental Transfer Simulation</span>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="pointer-events-auto flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 backdrop-blur-md transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isPlaying ? "animate-spin" : ""}`} />
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
      </div>

      {/* Molecule Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-obsidian-900/90 border border-slate-800/80 backdrop-blur-md text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="font-semibold text-slate-200">IgG (~150 kDa)</span>
            <span className="text-[0.65rem] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              CROSSES (Transferred)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span className="font-semibold text-slate-200">IgM (~900 kDa)</span>
            <span className="text-[0.65rem] text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
              BLOCKED (Bulky Pentamer)
            </span>
          </div>
        </div>

        <div className="text-[0.65rem] text-slate-400 hidden sm:block">
          Drag to rotate 3D view
        </div>
      </div>
    </div>
  );
}

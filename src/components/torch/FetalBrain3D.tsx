"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Brain, Eye, Sparkles, RefreshCw } from "lucide-react";

export default function FetalBrain3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<"all" | "ventricles" | "calcifications">("all");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 2, 20);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 2, 20);
    purpleLight.position.set(-5, -5, -5);
    scene.add(purpleLight);

    // 3. Fetal Brain Model (Anatomical Hemispheres)
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // Left & Right Cortex Hemispheres
    const cortexMat = new THREE.MeshPhongMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
    });

    const leftHemisphere = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 32), cortexMat);
    leftHemisphere.position.x = -1.2;
    leftHemisphere.scale.set(1, 0.85, 1.3);
    brainGroup.add(leftHemisphere);

    const rightHemisphere = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 32), cortexMat);
    rightHemisphere.position.x = 1.2;
    rightHemisphere.scale.set(1, 0.85, 1.3);
    brainGroup.add(rightHemisphere);

    // 4. Ventriculomegaly (Dilated Lateral Ventricles)
    const ventricleGroup = new THREE.Group();
    brainGroup.add(ventricleGroup);

    const ventricleMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0088aa,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
    });

    const leftVentricle = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.35, 16, 32, Math.PI * 1.2), ventricleMat);
    leftVentricle.position.set(-1.0, 0.2, 0);
    leftVentricle.rotation.x = Math.PI / 3;
    ventricleGroup.add(leftVentricle);

    const rightVentricle = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.35, 16, 32, Math.PI * 1.2), ventricleMat);
    rightVentricle.position.set(1.0, 0.2, 0);
    rightVentricle.rotation.x = Math.PI / 3;
    rightVentricle.rotation.y = Math.PI;
    ventricleGroup.add(rightVentricle);

    // 5. Intracranial Calcifications (Toxoplasmosis / CMV specs)
    const calcificationGroup = new THREE.Group();
    brainGroup.add(calcificationGroup);

    const calcMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      roughness: 0.1,
    });

    // Random focal calcification specs
    for (let i = 0; i < 28; i++) {
      const radius = 0.12 + Math.random() * 0.1;
      const spec = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 12), calcMat);
      
      // Distribute in brain parenchyma & periventricular space
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const r = 1.4 + Math.random() * 1.2;

      spec.position.x = r * Math.sin(theta) * Math.cos(phi);
      spec.position.y = r * Math.sin(theta) * Math.sin(phi) * 0.7;
      spec.position.z = r * Math.cos(theta) * 1.1;

      calcificationGroup.add(spec);
    }

    // 6. Orbit Mouse Dragging
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

      brainGroup.rotation.y += deltaX * 0.01;
      brainGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto gentle spin
      brainGroup.rotation.y += 0.003;

      // Pulsing ventricles for ventriculomegaly simulation
      const scalePulse = 1 + Math.sin(Date.now() * 0.003) * 0.08;
      ventricleGroup.scale.set(scalePulse, scalePulse, scalePulse);

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
  }, []);

  return (
    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-slate-800 bg-obsidian-950">
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Header Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl bg-obsidian-900/80 px-3 py-1.5 border border-slate-800 backdrop-blur-md">
          <Brain className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-bold text-white">3D Fetal Brain MRI & USG Visualizer</span>
        </div>
      </div>

      {/* Interactive Highlights Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-obsidian-900/90 border border-slate-800/80 backdrop-blur-md text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            <span className="font-semibold text-slate-200">Ventriculomegaly</span>
            <span className="text-[0.65rem] text-cyan-300 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              Dilated Ventricles
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
            <span className="font-semibold text-slate-200">Calcifications</span>
            <span className="text-[0.65rem] text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Intracranial Specs
            </span>
          </div>
        </div>

        <div className="text-[0.65rem] text-slate-400">
          Drag 3D model to inspect anatomy
        </div>
      </div>
    </div>
  );
}

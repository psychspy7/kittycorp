"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three128";
import { ArrowUpRight, Play } from "lucide-react";
import type { SitePageContent } from "@/lib/site-page-content";

// Smoothstep easing for staggered mechanical assembly
function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

// Subsystem definition interface
interface RoboticPart {
  group: THREE.Group;
  pAssembled: THREE.Vector3;
  pExploded: THREE.Vector3;
  rAssembled: THREE.Euler;
  rExploded: THREE.Euler;
  easeRange: [number, number];
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function RoboticsHero({ copy }: { copy?: SitePageContent }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isReducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
  const [webGLFailed, setWebGLFailed] = useState(false);

  const heroSubtitle = copy?.heroDescription || "We are exploring the future of AI robotics — building intelligent systems for the physical world.";

  // WebGL 3D Scene Controller
  useEffect(() => {
    if (isReducedMotion || webGLFailed) return;
    const mount = canvasMountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;
    if (width === 0 || height === 0) {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    // Initialize WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => setWebGLFailed(true));
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 7.2);

    // Lighting - Warm Metallic & Obsidian Luxury Specular
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe8e5df, 1.4);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x0a0c10, 0.65);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xc5a880, 1.8, 4.5);
    coreLight.position.set(0, 0.68, 0.2);
    scene.add(coreLight);

    // Shared Materials
    const outerArmorMat = new THREE.MeshStandardMaterial({
      color: 0xeef2f6,
      roughness: 0.24,
      metalness: 0.2,
    });
    const innerChassisMat = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      roughness: 0.45,
      metalness: 0.88,
    });
    const carbonFiberMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d12,
      roughness: 0.65,
      metalness: 0.45,
    });
    const chromePistonMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.08,
      metalness: 0.98,
    });
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.04,
      metalness: 0.92,
    });
    const coreGlowMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      emissive: 0xc5a880,
      emissiveIntensity: 1.5,
      roughness: 0.25,
      metalness: 0.85,
    });
    const axisLineMat = new THREE.LineDashedMaterial({
      color: 0xa1a1aa,
      dashSize: 0.12,
      gapSize: 0.06,
      transparent: true,
      opacity: 0.25,
    });

    // Root Group for Entire Robot
    const robotRoot = new THREE.Group();
    const isMobile = window.innerWidth < 768;
    robotRoot.position.set(isMobile ? 0 : 1.15, isMobile ? -0.2 : 0.05, 0);
    robotRoot.scale.setScalar(isMobile ? 0.76 : 1.0);
    scene.add(robotRoot);

    const parts: RoboticPart[] = [];
    const axisLines: THREE.Line[] = [];

    // Helper to register a mechanical part
    const addPart = (
      group: THREE.Group,
      pAss: THREE.Vector3,
      pExp: THREE.Vector3,
      rAss: THREE.Euler,
      rExp: THREE.Euler,
      range: [number, number]
    ) => {
      robotRoot.add(group);
      parts.push({
        group,
        pAssembled: pAss,
        pExploded: pExp,
        rAssembled: rAss,
        rExploded: rExp,
        easeRange: range,
      });

      // Alignment axis line
      const lineGeom = new THREE.BufferGeometry().setFromPoints([pAss, pExp]);
      const line = new THREE.Line(lineGeom, axisLineMat.clone());
      line.computeLineDistances();
      robotRoot.add(line);
      axisLines.push(line);
    };

    // 1. Head & Visor
    const headGroup = new THREE.Group();
    const visorMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.5, 24, 1, false, -1.2, 2.4), visorMat);
    const craniumMesh = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), outerArmorMat);
    const visorLed = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.018, 8, 24, 2.2), coreGlowMat);
    visorLed.rotation.x = Math.PI / 2;
    visorLed.position.set(0, 0.05, 0.32);
    const jawFrame = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.32), innerChassisMat);
    jawFrame.position.set(0, -0.24, 0.05);
    headGroup.add(visorMesh, craniumMesh, visorLed, jawFrame);
    addPart(headGroup, new THREE.Vector3(0, 1.8, 0.05), new THREE.Vector3(0, 3.25, 0.5), new THREE.Euler(-0.06, 0.1, -0.02), new THREE.Euler(-0.3, 0.4, 0.12), [0.45, 1.0]);

    // 2. Cervical Collar Ring
    const collarGroup = new THREE.Group();
    collarGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.045, 12, 32), chromePistonMat));
    collarGroup.add(new THREE.Mesh(new THREE.RingGeometry(0.22, 0.32, 24), innerChassisMat));
    addPart(collarGroup, new THREE.Vector3(0, 1.38, 0), new THREE.Vector3(0, 2.4, 0.22), new THREE.Euler(Math.PI / 2, 0, 0), new THREE.Euler(Math.PI / 2 + 0.35, 0.25, 0.15), [0.35, 0.85]);

    // 3. Spinal Column & Core Chassis
    const spineGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const v = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.18, 12), carbonFiberMat);
      v.position.y = -0.3 + i * 0.26;
      spineGroup.add(v);
    }
    const strutL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.1, 8), chromePistonMat);
    strutL.position.set(-0.16, 0.2, -0.12);
    const strutR = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.1, 8), chromePistonMat);
    strutR.position.set(0.16, 0.2, -0.12);
    spineGroup.add(strutL, strutR);
    addPart(spineGroup, new THREE.Vector3(0, 0.5, -0.1), new THREE.Vector3(0, 0.5, -0.65), new THREE.Euler(0, 0, 0), new THREE.Euler(0.08, -0.05, 0), [0.0, 0.55]);

    // 4. Quantum Arc Reactor
    const reactorGroup = new THREE.Group();
    reactorGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 32), coreGlowMat));
    reactorGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.016, 8, 32), chromePistonMat));
    reactorGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.014, 8, 32), innerChassisMat));
    addPart(reactorGroup, new THREE.Vector3(0, 0.68, 0.18), new THREE.Vector3(0, 0.72, 1.45), new THREE.Euler(Math.PI / 2, 0, 0), new THREE.Euler(Math.PI / 2, 0, 1.8), [0.1, 0.65]);

    // 5. Sculpted Ceramic Breastplate
    const chestGroup = new THREE.Group();
    const pecL = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.72, 0.16), outerArmorMat);
    pecL.position.set(-0.28, 0, 0);
    pecL.rotation.y = 0.18;
    const pecR = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.72, 0.16), outerArmorMat);
    pecR.position.set(0.28, 0, 0);
    pecR.rotation.y = -0.18;
    chestGroup.add(pecL, pecR);
    addPart(chestGroup, new THREE.Vector3(0, 0.72, 0.35), new THREE.Vector3(0, 1.05, 2.45), new THREE.Euler(0.06, 0, 0), new THREE.Euler(0.38, 0.12, -0.06), [0.45, 1.0]);

    // 6. Shoulders (Left & Right)
    const createShoulder = (isRight: boolean) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), innerChassisMat));
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16, 0, Math.PI, 0, Math.PI * 0.65), outerArmorMat);
      p.rotation.z = isRight ? -0.4 : 0.4;
      g.add(p);
      return g;
    };
    addPart(createShoulder(false), new THREE.Vector3(-1.18, 1.05, 0), new THREE.Vector3(-2.45, 1.75, -0.45), new THREE.Euler(0, 0, 0.28), new THREE.Euler(-0.32, 0.42, 0.78), [0.2, 0.8]);
    addPart(createShoulder(true), new THREE.Vector3(1.18, 1.05, 0), new THREE.Vector3(2.45, 1.75, -0.45), new THREE.Euler(0, 0, -0.28), new THREE.Euler(-0.32, -0.42, -0.78), [0.2, 0.8]);

    // 7. Arms & Actuators (Left & Right)
    const createArm = () => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.78, 16), carbonFiberMat));
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 12), chromePistonMat);
      p1.position.set(0.12, 0, 0.08);
      g.add(p1);
      const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.7, 0.26), outerArmorMat);
      forearm.position.set(0, -0.7, 0.1);
      g.add(forearm);
      return g;
    };
    addPart(createArm(), new THREE.Vector3(-1.58, 0.22, 0.16), new THREE.Vector3(-3.25, 0.5, 1.05), new THREE.Euler(0.18, -0.12, 0.38), new THREE.Euler(0.6, -0.4, 0.9), [0.25, 0.85]);
    addPart(createArm(), new THREE.Vector3(1.58, 0.22, 0.16), new THREE.Vector3(3.25, 0.5, 1.05), new THREE.Euler(0.18, 0.12, -0.38), new THREE.Euler(0.6, 0.4, -0.9), [0.25, 0.85]);

    // 8. Hands & Grippers (Left & Right)
    const createHand = () => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.032, 8, 20), chromePistonMat));
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.12), innerChassisMat));
      for (let f = 0; f < 4; f++) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.22, 8), chromePistonMat);
        finger.position.set(-0.08 + f * 0.05, -0.18, 0);
        g.add(finger);
      }
      return g;
    };
    addPart(createHand(), new THREE.Vector3(-1.78, -0.68, 0.38), new THREE.Vector3(-3.95, -1.3, 1.85), new THREE.Euler(0.32, 0.22, 0.12), new THREE.Euler(0.8, 0.7, 0.45), [0.3, 0.9]);
    addPart(createHand(), new THREE.Vector3(1.78, -0.68, 0.38), new THREE.Vector3(3.95, -1.3, 1.85), new THREE.Euler(0.32, -0.22, -0.12), new THREE.Euler(0.8, -0.7, -0.45), [0.3, 0.9]);

    // 9. Floating Bearings & Outer Shards
    const bearingGroup = new THREE.Group();
    bearingGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.028, 12, 32), chromePistonMat));
    addPart(bearingGroup, new THREE.Vector3(0.3, 1.05, 0.1), new THREE.Vector3(1.65, 2.1, 1.25), new THREE.Euler(0.8, -0.2, 0.3), new THREE.Euler(1.4, 0.7, -0.5), [0.25, 0.9]);

    // Starfield Points
    const starGeom = new THREE.BufferGeometry();
    const starCount = 650;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 50;
      starPos[i + 1] = (Math.random() - 0.5) * 40;
      starPos[i + 2] = -15 - Math.random() * 30;
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.045, transparent: true, opacity: 0.75 });
    const stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);

    // Scroll & Mouse Tracking Variables
    let rawProgress = 0;
    let smoothT = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      rawProgress = progress;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // IntersectionObserver to pause rendering when hero is scrolled offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.02 });
    if (containerRef.current) observer.observe(containerRef.current);

    // Animation Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return; // pause render loop when offscreen
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Damped scroll interpolation (frame-rate independent)
      const damp = 1.0 - Math.exp(-9.5 * delta);
      smoothT += (rawProgress - smoothT) * damp;

      smoothMouseX += (targetMouseX - smoothMouseX) * damp;
      smoothMouseY += (targetMouseY - smoothMouseY) * damp;

      // Update Subsystem Positions & Rotations
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const u = smoothstep(p.easeRange[0], p.easeRange[1], smoothT);

        // Vector3 lerp: exploded -> assembled
        p.group.position.lerpVectors(p.pExploded, p.pAssembled, u);

        // Euler rotation interpolation
        p.group.rotation.x = THREE.MathUtils.lerp(p.rExploded.x, p.rAssembled.x, u);
        p.group.rotation.y = THREE.MathUtils.lerp(p.rExploded.y, p.rAssembled.y, u);
        p.group.rotation.z = THREE.MathUtils.lerp(p.rExploded.z, p.rAssembled.z, u);
      }

      // Update guide axis line opacities (fade out as machine assembles)
      const lineOpacity = Math.max(0, (1.0 - smoothT) * 0.45);
      axisLineMat.opacity = lineOpacity;

      // Subtle breathing & mouse parallax
      const idleFloat = Math.sin(elapsedTime * 1.4) * 0.04 * (1.0 - 0.6 * smoothT);
      robotRoot.position.y = (isMobile ? -0.2 : 0.05) + idleFloat;
      robotRoot.rotation.y = smoothMouseX * 0.18;
      robotRoot.rotation.x = -smoothMouseY * 0.12;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.Line).isLine || (obj as THREE.Points).isPoints) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material?.dispose();
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [isReducedMotion, webGLFailed]);

  return (
    <section ref={containerRef} id="hero" aria-label="KITTY CORP AI Robotics Showcase" className="relative w-full min-h-[175vh] md:min-h-[220vh] bg-[#050506] text-[#f8f8f9] selection:bg-[#c5a880] selection:text-[#050506]">
      {/* Sticky Fullscreen Viewport Layer */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-between">
        
        {/* WebGL Canvas Mount or Fallback */}
        {!webGLFailed && !isReducedMotion ? (
          <div ref={canvasMountRef} className="absolute inset-0 z-0 pointer-events-none" />
        ) : (
          <RoboticsFallback />
        )}

        {/* HUD Blueprint Schematics Overlay */}
        <RoboticsHUD progress={scrollProgress} isReducedMotion={isReducedMotion} />

        {/* Editorial Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between px-6 sm:px-10 lg:px-14 pt-[100px] pb-[32px] pointer-events-none">
          {/* Hero Headline & Intro */}
          <div className="max-w-[680px] pointer-events-auto mt-6 md:mt-12">
            <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.25em] text-[#a1a1aa] uppercase mb-4">
              <span>INTELLIGENCE &amp; ROBOTICS</span>
              <span className="text-[#c5a880]">•</span>
              <span>RESEARCH</span>
              <span className="text-[#c5a880]">•</span>
              <span>INNOVATION</span>
              <div className="h-[1px] w-16 sm:w-24 bg-white/[0.08] hidden sm:block ml-2" />
            </div>

            <h1 className="text-[clamp(44px,6.5vw,96px)] font-[family-name:var(--font-display)] font-normal leading-[0.98] tracking-[-0.03em] mb-6 text-[#f8f8f9]">
              <span className="sr-only">INTELLIGENCE BEYOND BOUNDARIES</span>
              <span className="block font-normal">INTELLIGENCE</span>
              <span className="block italic font-light text-zinc-300">BEYOND</span>
              <span className="block font-normal">BOUNDARIES.</span>
            </h1>

            <p className="text-[15px] sm:text-[17px] md:text-[18px] leading-[1.65] text-[#a1a1aa] max-w-[520px] mb-8 font-light font-[family-name:var(--font-sans)]">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="#projects"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/[0.12] hover:border-[#c5a880]/50 text-[14px] text-white transition-all backdrop-blur-md group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#c5a880]/20 transition-colors">
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                </div>
                <span className="font-medium tracking-wide">Explore Our Vision ──→</span>
              </a>

              <a
                href="https://demo.thekittycorp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/[0.1] text-[13px] text-[#a1a1aa] hover:text-white hover:border-[#c5a880]/40 transition-all bg-white/[0.02]"
              >
                <span>Digital Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#c5a880]" />
              </a>
            </div>
          </div>

          {/* Bottom Telemetry & Scroll Cue */}
          <div className="w-full flex items-center justify-between border-t border-white/[0.08] pt-4 text-[11px] font-mono tracking-wider text-zinc-500 pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-pulse" />
              <span className="hidden sm:inline">ROBOTICS DIVISION — PROTOTYPE SEQUENCE 01</span>
              <span className="sm:hidden">UNIT-01 ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 text-[#a1a1aa]">
              <span>SCROLL TO ASSEMBLE</span>
              <span className="text-[#c5a880]">[{Math.round(scrollProgress * 100)}%]</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Technical Obsidian Telemetry Overlay
function RoboticsHUD({ progress, isReducedMotion }: { progress: number; isReducedMotion: boolean }) {
  const percent = isReducedMotion ? 100 : Math.round(progress * 100);
  const status = isReducedMotion
    ? "CALIBRATED [REDUCED MOTION]"
    : progress >= 0.95
    ? "SYSTEM CONVERGED · 100% SPEC"
    : progress <= 0.05
    ? "EXPANDED CHASSIS · STANDBY"
    : `CONVERGENCE IN PROGRESS [${percent}%]`;

  return (
    <div className="absolute inset-0 z-5 pointer-events-none p-6 md:p-10 flex flex-col justify-between">
      {/* Top Right Obsidian Telemetry Box */}
      <div className="self-end max-w-[280px] bg-[#0c0d10]/80 backdrop-blur-md border border-white/[0.08] rounded-xl p-4 text-[#a1a1aa] font-mono text-[10px] space-y-2 hidden md:block shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="sr-only">KITTY CORP ROBOTICS DIVISION R&amp;D — 2027</div>
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
          <span className="text-[#f8f8f9] font-medium tracking-wider">KITTY CORP</span>
          <span className="text-zinc-500">R&amp;D — 2027</span>
        </div>
        <p className="text-[11px] text-white font-medium tracking-wider">PHYSICAL INTELLIGENCE</p>

        <div className="space-y-1.5 pt-1 text-[9px] text-[#a1a1aa]">
          <div className="flex justify-between">
            <span>SEQUENCE:</span>
            <span className="text-[#c5a880]">{status}</span>
          </div>
          <div className="flex justify-between">
            <span>ACTUATORS:</span>
            <span>10 VECTORS CALIBRATED</span>
          </div>
          <div className="flex justify-between">
            <span>POWER SYSTEM:</span>
            <span className="text-[#c5a880]">TITANIUM CORE NOMINAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Zero-Layout-Shift Fallback for Mobile / Unsupported WebGL
function RoboticsFallback() {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center md:justify-end md:pr-24 overflow-hidden pointer-events-none">
      <div className="relative w-[340px] md:w-[500px] aspect-square flex items-center justify-center">
        {/* Subtle warm champagne ambient aura */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c5a880]/10 via-transparent to-transparent blur-3xl" />
        <div className="relative w-72 h-72 rounded-2xl border border-white/[0.08] bg-[#0c0d10]/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
            <span>UNIT-01</span>
            <span className="text-[#c5a880]">STANDBY</span>
          </div>
          <div className="text-center py-8">
            <span className="font-[family-name:var(--font-display)] text-2xl text-white tracking-widest block">KITTY CORP</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1 block">PHYSICAL INTELLIGENCE ARCHITECTURE</span>
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 border-t border-white/[0.08] pt-2">
            <span>CHASSIS HARDWARE</span>
            <span>VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

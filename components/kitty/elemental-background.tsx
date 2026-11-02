"use client";

import { useEffect, useRef, useState } from "react";
import { ElementsBackground, type ElementSceneVariant } from "@/src/shaders/elements/ElementsBackground";

const MODE_EVENT = "kitty:elemental-mode";
const SCENES: readonly ElementSceneVariant[] = ["water", "fire", "lightning", "all"];
const FADE_MS = 1150;

type SceneLayer = {
  id: number;
  scene: ElementSceneVariant;
  active: boolean;
};

function sendMode(mode: ElementSceneVariant, source: "control" | "scroll") {
  window.dispatchEvent(new CustomEvent(MODE_EVENT, { detail: { mode, source } }));
}

function sceneAtProgress(progress: number): ElementSceneVariant {
  if (progress < 0.3) return "water";
  if (progress < 0.56) return "fire";
  if (progress < 0.81) return "lightning";
  return "all";
}

function sceneLabel(scene: ElementSceneVariant) {
  return scene === "all" ? "All three" : scene[0].toUpperCase() + scene.slice(1);
}

export function ElementalControls() {
  const [scene, setScene] = useState<ElementSceneVariant>("water");

  useEffect(() => {
    const update = (event: Event) => {
      const detail = (event as CustomEvent<{ mode: ElementSceneVariant }>).detail;
      if (detail?.mode && SCENES.includes(detail.mode)) setScene(detail.mode);
    };
    window.addEventListener(MODE_EVENT, update);
    return () => window.removeEventListener(MODE_EVENT, update);
  }, []);

  return (
    <div className="elemental-controls">
      <span className="elemental-controls-label">SCENE PREVIEW</span>
      <div className="elemental-controls-options" role="group" aria-label="Choose an animated background scene">
        {SCENES.map((item) => (
          <button key={item} type="button" aria-pressed={scene === item} onClick={() => sendMode(item, "control")}>
            <span className={`elemental-dot elemental-dot-${item}`} aria-hidden="true" />
            {sceneLabel(item)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ElementalBackground() {
  const [layers, setLayers] = useState<SceneLayer[]>([{ id: 0, scene: "water", active: true }]);
  const nextLayerId = useRef(1);
  const pendingLayerIds = useRef(new Set<number>());
  const onLayerReady = useRef<(id: number) => void>(() => {});

  useEffect(() => {
    let manualMode = false;
    let manualScrollY = 0;
    let scrollFrame = 0;
    let activeScene: ElementSceneVariant = "water";
    let transitionTimer: number | undefined;
    const root = document.querySelector<HTMLElement>(".gemini-template");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scrollProgress = document.querySelector<HTMLElement>(".gemini-scroll-progress > div");

    const transitionTo = (next: ElementSceneVariant) => {
      if (!SCENES.includes(next) || next === activeScene) return;
      activeScene = next;
      if (transitionTimer) window.clearTimeout(transitionTimer);
      const id = nextLayerId.current++;
      pendingLayerIds.current.clear();
      pendingLayerIds.current.add(id);
      setLayers((current) => {
        return [
          ...current.filter((layer) => layer.active),
          { id, scene: next, active: false },
        ];
      });
    };

    const revealLayer = (id: number) => {
      if (!pendingLayerIds.current.delete(id)) return;
      setLayers((current) => {
        if (!current.some((layer) => layer.id === id)) return current;
        return current.map((layer) => ({ ...layer, active: layer.id === id }));
      });
      if (transitionTimer) window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(
        () => setLayers((current) => current.filter((layer) => layer.active)),
        reducedMotion.matches ? 0 : FADE_MS,
      );
    };
    onLayerReady.current = revealLayer;

    const handleMode = (event: Event) => {
      const detail = (event as CustomEvent<{
        mode: ElementSceneVariant;
        source: "control" | "scroll";
      }>).detail;
      if (!detail?.mode || !SCENES.includes(detail.mode)) return;
      if (detail.source === "control") {
        manualMode = true;
        manualScrollY = window.scrollY;
      } else {
        manualMode = false;
      }
      transitionTo(detail.mode);
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        if (manualMode && Math.abs(window.scrollY - manualScrollY) > 96) manualMode = false;
        if (!manualMode) {
          const next = sceneAtProgress(progress);
          if (next !== activeScene) sendMode(next, "scroll");
        }
      });
    };

    const motionObserver = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) (entry.target as HTMLElement).dataset.revealed = "true";
          }
        }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" })
      : null;
    const revealTargets = [...(root?.querySelectorAll<HTMLElement>("[data-element]") ?? [])];
    if (reducedMotion.matches || !motionObserver) {
      revealTargets.forEach((target) => { target.dataset.revealed = "true"; });
    } else {
      revealTargets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.08 && rect.bottom > 0) target.dataset.revealed = "true";
        motionObserver.observe(target);
      });
      root?.setAttribute("data-motion-ready", "true");
    }

    const handleReducedMotion = () => {
      if (reducedMotion.matches) revealTargets.forEach((target) => { target.dataset.revealed = "true"; });
    };

    window.addEventListener(MODE_EVENT, handleMode);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    reducedMotion.addEventListener("change", handleReducedMotion);
    handleScroll();

    return () => {
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (transitionTimer) window.clearTimeout(transitionTimer);
      onLayerReady.current = () => {};
      motionObserver?.disconnect();
      window.removeEventListener(MODE_EVENT, handleMode);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      reducedMotion.removeEventListener("change", handleReducedMotion);
      root?.removeAttribute("data-motion-ready");
    };
  }, []);

  return (
    <>
      {layers.map((layer) => (
        <div
          key={layer.id}
          className="elemental-scene-layer"
          data-scene={layer.scene}
          data-scene-active={layer.active ? "true" : "false"}
          aria-hidden="true"
        >
          <ElementsBackground
            variant={layer.scene}
            className="elemental-scene-canvas"
            size={1}
            particleAmount={layer.scene === "all" ? 0.48 : 0.72}
            onReady={() => onLayerReady.current(layer.id)}
          />
        </div>
      ))}
      <div className="gemini-scroll-progress" aria-hidden="true"><div /></div>
    </>
  );
}

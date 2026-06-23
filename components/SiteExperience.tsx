"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const tiltTargets = [
  ".strength-card", ".package-card", ".project-card", ".service-card",
  ".leader-card", ".tracker-card", ".testimonial-grid", ".value-grid > div",
  ".executive-grid article", ".portfolio-grid article"
].join(",");

const magneticTargets = ".button,.nav-cta,.nav-whatsapp,.floating-actions a";

export function SiteExperience() {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer:fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (!finePointer || reduced) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let frame = 0;

    const animateCursor = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      cursor.style.transform = `translate3d(${currentX}px,${currentY}px,0)`;
      frame = requestAnimationFrame(animateCursor);
    };

    const onPointerMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      const interactive = (event.target as HTMLElement).closest("a,button,input,select,textarea");
      cursor.classList.toggle("is-active", Boolean(interactive));
      dot.classList.toggle("is-active", Boolean(interactive));

      const tilt = (event.target as HTMLElement).closest<HTMLElement>(tiltTargets);
      if (tilt) {
        const rect = tilt.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        tilt.style.setProperty("--rx", `${(-y * 3.5).toFixed(2)}deg`);
        tilt.style.setProperty("--ry", `${(x * 4.5).toFixed(2)}deg`);
        tilt.style.setProperty("--glow-x", `${((x + 0.5) * 100).toFixed(1)}%`);
        tilt.style.setProperty("--glow-y", `${((y + 0.5) * 100).toFixed(1)}%`);
      }

      const magnetic = (event.target as HTMLElement).closest<HTMLElement>(magneticTargets);
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        magnetic.style.setProperty("--mx", `${(event.clientX - rect.left - rect.width / 2) * 0.12}px`);
        magnetic.style.setProperty("--my", `${(event.clientY - rect.top - rect.height / 2) * 0.12}px`);
      }
    };

    const onPointerOver = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest("a,button,input,select,textarea")) {
        cursor.classList.add("is-active");
        dot.classList.add("is-active");
      }
    };
    const onPointerOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tilt = target.closest<HTMLElement>(tiltTargets);
      const magnetic = target.closest<HTMLElement>(magneticTargets);
      if (tilt) {
        tilt.style.removeProperty("--rx");
        tilt.style.removeProperty("--ry");
      }
      if (magnetic) {
        magnetic.style.removeProperty("--mx");
        magnetic.style.removeProperty("--my");
      }
      if (target.closest("a,button,input,select,textarea")) {
        cursor.classList.remove("is-active");
        dot.classList.remove("is-active");
      }
    };

    document.documentElement.classList.add("has-custom-cursor");
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("mouseover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("mouseout", onPointerOut);
    frame = requestAnimationFrame(animateCursor);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("mouseover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("mouseout", onPointerOut);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduced) return;
    const layers = Array.from(document.querySelectorAll<HTMLElement>(".blueprint,.hero-draft-lines,.page-hero-lines"));
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      layers.forEach((layer, index) => layer.style.setProperty("--parallax-y", `${y * (0.018 + index * 0.004)}px`));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <>
      <div className="cursor-ring" ref={cursorRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}

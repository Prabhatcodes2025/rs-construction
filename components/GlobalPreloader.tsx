"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const MINIMUM_VISIBLE_MS = 600;
const MAXIMUM_VISIBLE_MS = 1800;
const EXIT_ANIMATION_MS = 380;
export const PRELOADER_START_EVENT = "rs:preloader-start";

export function startRoutePreloader() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(PRELOADER_START_EVENT));
}

type Phase = "visible" | "leaving" | "hidden";

export function PreloaderFallback() {
  return <PreloaderView phase="visible" cycle={0} />;
}

export function GlobalPreloader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const [phase, setPhase] = useState<Phase>("visible");
  const [cycle, setCycle] = useState(0);
  const phaseRef = useRef<Phase>("visible");
  const shownAt = useRef(0);
  const minimumTimer = useRef<number | null>(null);
  const fallbackTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const firstRouteCommit = useRef(true);

  const clearTimers = useCallback(() => {
    if (minimumTimer.current) window.clearTimeout(minimumTimer.current);
    if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    minimumTimer.current = null;
    fallbackTimer.current = null;
    hideTimer.current = null;
  }, []);

  const finish = useCallback(() => {
    if (phaseRef.current === "hidden" || phaseRef.current === "leaving") return;
    const elapsed = performance.now() - shownAt.current;
    const remaining = Math.max(0, MINIMUM_VISIBLE_MS - elapsed);
    if (minimumTimer.current) window.clearTimeout(minimumTimer.current);
    minimumTimer.current = window.setTimeout(() => {
      phaseRef.current = "leaving";
      setPhase("leaving");
      hideTimer.current = window.setTimeout(() => {
        phaseRef.current = "hidden";
        setPhase("hidden");
      }, EXIT_ANIMATION_MS);
    }, remaining);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    shownAt.current = performance.now();
    phaseRef.current = "visible";
    setCycle(value => value + 1);
    setPhase("visible");
    fallbackTimer.current = window.setTimeout(finish, MAXIMUM_VISIBLE_MS);
  }, [clearTimers, finish]);

  useEffect(() => {
    shownAt.current = performance.now();
    fallbackTimer.current = window.setTimeout(finish, MAXIMUM_VISIBLE_MS);
    const completionDelay = firstRouteCommit.current ? 80 : 40;
    firstRouteCommit.current = false;
    const commitTimer = window.setTimeout(finish, completionDelay);
    return () => window.clearTimeout(commitTimer);
  }, [routeKey, finish]);

  useEffect(() => {
    const onStart = () => start();
    const onPopState = () => start();
    const onDocumentClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      const current = new URL(window.location.href);
      if (destination.pathname === current.pathname && destination.search === current.search) return;
      const linkText = anchor.textContent?.toLowerCase() || "";
      const opensEnquiryPopup = destination.pathname === "/contact"
        && /estimate|consultation|enquire|quote|get in touch/.test(linkText);
      if (opensEnquiryPopup) return;
      start();
    };

    window.addEventListener(PRELOADER_START_EVENT, onStart);
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onDocumentClick, true);
    return () => {
      window.removeEventListener(PRELOADER_START_EVENT, onStart);
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onDocumentClick, true);
      clearTimers();
    };
  }, [clearTimers, start]);

  return <PreloaderView phase={phase} cycle={cycle} />;
}

function PreloaderView({ phase, cycle }: { phase: Phase; cycle: number }) {
  return <div className={`global-preloader ${phase}`} aria-hidden={phase !== "visible"} data-preloader-state={phase}>
    <div className="preloader-blueprint" />
    <div className="preloader-content" key={cycle}>
      <div className="preloader-building"><i /><i /><i /><i /><i /></div>
      <div className="preloader-brand">
        <span><Image src="/images/rs-logo.png" alt="RS Construction" width={180} height={100} priority /></span>
        <strong>RS CONSTRUCTION</strong>
        <small>BUILDING EXCELLENCE...</small>
        <small>DELIVERING TRUST...</small>
      </div>
      <div className="preloader-track"><b /></div>
      <div className="preloader-status"><span>Preparing your experience</span><span>100%</span></div>
    </div>
  </div>;
}

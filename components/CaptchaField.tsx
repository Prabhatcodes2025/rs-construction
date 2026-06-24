"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

declare global { interface Window { grecaptcha?: { render: (id: string, options: Record<string, unknown>) => number; reset: (id?: number) => void } } }

type CaptchaValue = { answer?: string; provider: "google" | "text"; token: string };

export function CaptchaField({ fallbackAllowed = false, onVerify, provider = "google", resetSignal = 0 }: { fallbackAllowed?: boolean; onVerify: (value: CaptchaValue) => void; provider?: "google" | "text"; resetSignal?: number }) {
  const id = `captcha-${useId().replaceAll(":", "")}`;
  const clientEnabled = process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "true";
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
  const googleRequested = provider === "google" && clientEnabled;
  const isDevelopment = process.env.NODE_ENV !== "production";
  const widgetId = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [failed, setFailed] = useState(false);
  const useText = provider === "text" || (fallbackAllowed && (!googleRequested || !siteKey || failed));
  const [textChallenge, setTextChallenge] = useState({ question: "", token: "" });
  const [textAnswer, setTextAnswer] = useState("");
  const handleVerify = useCallback((token: string) => {
    if (isDevelopment) console.log("captcha token received", Boolean(token));
    onVerify({ provider: "google", token });
  }, [isDevelopment, onVerify]);
  const renderCaptcha = useCallback(() => {
    if (!googleRequested || useText || !siteKey || rendered || failed || !window.grecaptcha) return;
    try {
      widgetId.current = window.grecaptcha.render(id, {
        sitekey: siteKey,
        callback: handleVerify,
        "expired-callback": () => handleVerify(""),
        "error-callback": () => handleVerify(""),
      });
      setRendered(true);
    } catch {
      setFailed(true);
      handleVerify("");
    }
  }, [failed, googleRequested, handleVerify, id, rendered, siteKey, useText]);

  useEffect(() => {
    if (!googleRequested && !useText) {
      onVerify({ provider: "google", token: "" });
      return;
    }
    if (googleRequested && !siteKey && !useText) onVerify({ provider: "google", token: "" });
  }, [googleRequested, onVerify, siteKey, useText]);

  useEffect(() => {
    if (!isDevelopment) return;
    console.log("reCAPTCHA diagnostics", {
      componentMounted: true,
      fallbackAllowed,
      nextPublicEnableRecaptcha: process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA,
      provider,
      siteKeyPresent: Boolean(siteKey),
    });
    if (clientEnabled && provider === "google" && !siteKey) console.error("reCAPTCHA site key missing");
  }, [clientEnabled, fallbackAllowed, isDevelopment, provider, siteKey]);

  useEffect(() => {
    if (!googleRequested || useText || !siteKey) return;
    if (window.grecaptcha) {
      setReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src^="https://www.google.com/recaptcha/api.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => setReady(true), { once: true });
      existingScript.addEventListener("error", () => setFailed(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    script.onerror = () => setFailed(true);
    document.head.appendChild(script);
  }, [googleRequested, siteKey, useText]);

  const loadTextChallenge = useCallback(async () => {
    if (!useText) return;
    setTextAnswer("");
    onVerify({ answer: "", provider: "text", token: "" });
    try {
      const response = await fetch("/api/captcha", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.question || !result.token) throw new Error("Captcha unavailable");
      setTextChallenge({ question: result.question, token: result.token });
      onVerify({ answer: "", provider: "text", token: result.token });
    } catch {
      setTextChallenge({ question: "Security check unavailable", token: "" });
    }
  }, [onVerify, useText]);

  useEffect(() => {
    loadTextChallenge();
  }, [loadTextChallenge]);

  useEffect(() => {
    renderCaptcha();
  }, [ready, renderCaptcha]);

  useEffect(() => {
    if (!resetSignal) return;
    if (useText) {
      loadTextChallenge();
      return;
    }
    if (widgetId.current !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetId.current);
      } catch {
        setFailed(true);
      }
    }
    handleVerify("");
  }, [handleVerify, loadTextChallenge, resetSignal, useText]);

  if (useText) return <div className="text-captcha"><label><span>Security Check</span><input inputMode="numeric" onChange={event => { setTextAnswer(event.target.value); onVerify({ answer: event.target.value, provider: "text", token: textChallenge.token }); }} placeholder={textChallenge.question || "Loading..."} value={textAnswer} /></label></div>;
  if (!googleRequested) return null;
  if (!siteKey) return isDevelopment ? <p className="captcha-notice">reCAPTCHA site key missing</p> : null;
  return <div id={id} className="recaptcha-box" />;
}

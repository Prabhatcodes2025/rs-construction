"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";

declare global { interface Window { grecaptcha?: { render: (id: string, options: Record<string, unknown>) => number; reset: (id?: number) => void } } }

export function CaptchaField({ onVerify, enabled = false, resetSignal = 0 }: { onVerify: (token: string) => void; enabled?: boolean; resetSignal?: number }) {
  const id = `captcha-${useId().replaceAll(":", "")}`;
  const clientEnabled = process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "true";
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
  const shouldMount = enabled && clientEnabled;
  const isDevelopment = process.env.NODE_ENV !== "production";
  const widgetId = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [failed, setFailed] = useState(false);
  const handleVerify = useCallback((token: string) => {
    if (isDevelopment) console.log("captcha token received", Boolean(token));
    onVerify(token);
  }, [isDevelopment, onVerify]);
  const renderCaptcha = useCallback(() => {
    if (!shouldMount || !siteKey || rendered || failed || !window.grecaptcha) return;
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
  }, [failed, handleVerify, id, rendered, shouldMount, siteKey]);

  useEffect(() => {
    if (!shouldMount) {
      onVerify("");
      return;
    }
    if (!siteKey) onVerify("");
  }, [onVerify, shouldMount, siteKey]);

  useEffect(() => {
    if (!isDevelopment) return;
    console.log("reCAPTCHA diagnostics", {
      componentMounted: true,
      enabled,
      nextPublicEnableRecaptcha: process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA,
      siteKeyPresent: Boolean(siteKey),
    });
    if (clientEnabled && !siteKey) console.error("reCAPTCHA site key missing");
  }, [clientEnabled, enabled, isDevelopment, siteKey]);

  useEffect(() => {
    renderCaptcha();
  }, [ready, renderCaptcha]);

  useEffect(() => {
    if (!resetSignal || widgetId.current === null || !window.grecaptcha) return;
    try {
      window.grecaptcha.reset(widgetId.current);
    } catch {
      setFailed(true);
    }
    handleVerify("");
  }, [handleVerify, resetSignal]);

  if (!shouldMount) return null;
  if (!siteKey) return isDevelopment ? <p className="captcha-notice">reCAPTCHA site key missing</p> : null;
  return <><Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setReady(true)} onReady={() => setReady(true)} onError={() => setFailed(true)} /><div id={id} className="recaptcha-box" /></>;
}

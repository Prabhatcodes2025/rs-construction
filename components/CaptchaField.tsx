"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";

declare global { interface Window { grecaptcha?: { render: (id: string, options: Record<string, unknown>) => number; reset: (id?: number) => void } } }

export function CaptchaField({ onVerify, enabled = false, resetSignal = 0 }: { onVerify: (token: string) => void; enabled?: boolean; resetSignal?: number }) {
  const id = `captcha-${useId().replaceAll(":", "")}`;
  const clientEnabled = process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "true";
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
  const widgetId = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [failed, setFailed] = useState(false);
  const renderCaptcha = useCallback(() => {
    if (!enabled || !clientEnabled || !siteKey || rendered || failed || !window.grecaptcha) return;
    try {
      widgetId.current = window.grecaptcha.render(id, {
        sitekey: siteKey,
        callback: onVerify,
        "expired-callback": () => onVerify(""),
        "error-callback": () => onVerify(""),
      });
      setRendered(true);
    } catch {
      setFailed(true);
      onVerify("");
    }
  }, [clientEnabled, enabled, failed, id, onVerify, rendered, siteKey]);

  useEffect(() => {
    if (!enabled || !clientEnabled) {
      onVerify("");
      return;
    }
    if (!siteKey) onVerify("");
  }, [clientEnabled, enabled, onVerify, siteKey]);

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
    onVerify("");
  }, [onVerify, resetSignal]);

  if (!enabled || !clientEnabled || !siteKey) return null;
  return <><Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setReady(true)} onError={() => setFailed(true)} /><div id={id} className="recaptcha-box" /></>;
}

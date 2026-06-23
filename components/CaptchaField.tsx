"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";

declare global { interface Window { grecaptcha?: { render: (id: string, options: Record<string, unknown>) => number; reset: (id?: number) => void } } }

export function CaptchaField({ onVerify, enabled = false }: { onVerify: (token: string) => void; enabled?: boolean }) {
  const id = `captcha-${useId().replaceAll(":", "")}`;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const widgetId = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [rendered, setRendered] = useState(false);
  const renderCaptcha = useCallback(() => {
    if (!enabled || !siteKey || rendered || !window.grecaptcha) return;
    widgetId.current = window.grecaptcha.render(id, {
      sitekey: siteKey,
      callback: onVerify,
      "expired-callback": () => onVerify(""),
      "error-callback": () => onVerify(""),
    });
    setRendered(true);
  }, [enabled, id, onVerify, rendered, siteKey]);

  useEffect(() => {
    if (!enabled) {
      onVerify("");
      return;
    }
    if (!siteKey) onVerify("");
  }, [enabled, onVerify, siteKey]);

  useEffect(() => {
    renderCaptcha();
  }, [ready, renderCaptcha]);

  if (!enabled) return null;
  if (!siteKey) {
    return <p className="captcha-notice">reCAPTCHA site key is not configured.</p>;
  }
  return <><Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setReady(true)} /><div id={id} className="recaptcha-box" /></>;
}

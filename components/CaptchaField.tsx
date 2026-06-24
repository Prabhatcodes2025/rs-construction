"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";

declare global { interface Window { grecaptcha?: { render: (id: string, options: Record<string, unknown>) => number; reset: (id?: number) => void } } }

export function CaptchaField({ onVerify, enabled = false }: { onVerify: (token: string) => void; enabled?: boolean }) {
  const id = `captcha-${useId().replaceAll(":", "")}`;
  const clientEnabled = process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "true";
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const widgetId = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [rendered, setRendered] = useState(false);
  const renderCaptcha = useCallback(() => {
    if (!enabled || !clientEnabled || !siteKey || rendered || !window.grecaptcha) return;
    widgetId.current = window.grecaptcha.render(id, {
      sitekey: siteKey,
      callback: onVerify,
      "expired-callback": () => onVerify(""),
      "error-callback": () => onVerify(""),
    });
    setRendered(true);
  }, [clientEnabled, enabled, id, onVerify, rendered, siteKey]);

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

  if (!enabled || !clientEnabled || !siteKey) return null;
  return <><Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setReady(true)} /><div id={id} className="recaptcha-box" /></>;
}

"use client";

import Script from "next/script";
import { useEffect, useId, useState } from "react";

declare global { interface Window { grecaptcha?: { render: (id: string, options: Record<string, unknown>) => number; reset: (id?: number) => void } } }

export function CaptchaField({ onVerify }: { onVerify: (token: string) => void }) {
  const id = `captcha-${useId().replaceAll(":", "")}`;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!siteKey || rendered || !window.grecaptcha) return;
    window.grecaptcha.render(id, { sitekey: siteKey, callback: onVerify, "expired-callback": () => onVerify("") });
    setRendered(true);
  }, [id, onVerify, rendered, siteKey]);

  if (!siteKey) return <label className="dev-captcha"><input type="checkbox" onChange={e => onVerify(e.target.checked ? "dev-verified" : "")} /> <span>Development verification</span></label>;
  return <><Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onLoad={() => { if (!rendered && window.grecaptcha) { window.grecaptcha.render(id, { sitekey: siteKey, callback: onVerify }); setRendered(true); } }} /><div id={id} className="recaptcha-box" /></>;
}

"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { CaptchaField } from "./CaptchaField";

type CaptchaValue = { answer?: string; provider: "google" | "text"; token: string };

export function LeadForm({ captchaFallback = false, captchaProvider = "google", recaptcha = false }: { captchaFallback?: boolean; captchaProvider?: "google" | "text"; recaptcha?: boolean }) {
  const [sent, setSent] = useState(false);
  const [captcha, setCaptcha] = useState<CaptchaValue>({ provider: captchaProvider, token: "" });
  const [captchaReset, setCaptchaReset] = useState(0);
  const [error, setError] = useState("");
  const captchaEnabled = captchaProvider === "text" || (recaptcha && process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "true");
  const captchaRequired = captchaEnabled && Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (captchaProvider === "text" && (!captcha.token || !captcha.answer?.trim())) {
      setError("Please answer the security question correctly.");
      return;
    }
    if (captchaProvider === "google" && captchaRequired && !captcha.token) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ source: "Contact Form", name: form.get("name"), mobile: form.get("mobile"), email: form.get("email"), location: form.get("location"), plotSize: form.get("plotSize"), message: form.get("message"), captchaAnswer: captcha.answer, captchaProvider: captcha.provider, captchaToken: captcha.token }) });
    const result = await response.json();
    if (!response.ok) {
      setCaptchaReset(value => value + 1);
      return setError(result.error || "Please check the form.");
    }
    setSent(true);
  }
  function showCaptchaRequired() {
    if (captchaProvider === "text" && (!captcha.token || !captcha.answer?.trim())) setError("Please answer the security question correctly.");
    if (captchaProvider === "google" && captchaRequired && !captcha.token) setError("Please complete the reCAPTCHA verification.");
  }

  if (sent) {
    return (
      <div className="lead-form form-success" role="status">
        <CheckCircle2 />
        <span className="eyebrow">Request received</span>
        <h2>Thank you. Let’s build the next step.</h2>
        <p>Our team will review your project details and contact you shortly.</p>
        <button className="button dark" type="button" onClick={() => setSent(false)}>Send another enquiry</button>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div><label>Name<input required name="name" autoComplete="name" placeholder="Your full name" /></label><label>Mobile<input required name="mobile" autoComplete="tel" type="tel" placeholder="+91" /></label></div>
      <div><label>Email<input name="email" autoComplete="email" type="email" placeholder="you@example.com" /></label><label>Plot location<input name="location" placeholder="Area, Bengaluru" /></label></div>
      <label>Plot size<input name="plotSize" placeholder="e.g. 30 × 40 or 1,200 sq.ft" /></label>
      <label>Tell us about your project<textarea name="message" rows={5} placeholder="Home, commercial space, interiors, preferred timeline..." /></label>
      <CaptchaField fallbackAllowed={captchaFallback} onVerify={setCaptcha} provider={captchaProvider} resetSignal={captchaReset} />
      {error && <p className="form-error">{error}</p>}
      <button className="button primary form-submit" type="submit" onClick={showCaptchaRequired}>Request a consultation <ArrowRight size={18} /></button>
      <small>By submitting, you agree to be contacted by RS Construction about your inquiry.</small>
    </form>
  );
}

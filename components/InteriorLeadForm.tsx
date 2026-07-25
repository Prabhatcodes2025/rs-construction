"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { CaptchaField } from "./CaptchaField";

type CaptchaValue = { answer?: string; provider: "google" | "text"; token: string };

export function InteriorLeadForm({ captchaFallback = false, captchaProvider = "google", recaptcha = false }: { captchaFallback?: boolean; captchaProvider?: "google" | "text"; recaptcha?: boolean }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState<CaptchaValue>({ provider: captchaProvider, token: "" });
  const [captchaReset, setCaptchaReset] = useState(0);
  const captchaRequired = (captchaProvider === "text") || (recaptcha && process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "true" && Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim()));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (captchaRequired && (!captcha.token || (captcha.provider === "text" && !captcha.answer?.trim()))) {
      setError("Please complete the security check.");
      return;
    }
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const detail = [
      `Property type: ${form.get("propertyType")}`,
      `Required service: ${form.get("service")}`,
      `Expected timeline: ${form.get("timeline")}`,
      `Message: ${form.get("message") || "Not provided"}`,
    ].join("\n");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "RS Interiors Consultation",
          name: form.get("name"),
          mobile: form.get("mobile"),
          email: form.get("email"),
          location: form.get("location"),
          service: form.get("service"),
          plotSize: form.get("propertyType"),
          message: detail,
          captchaAnswer: captcha.answer,
          captchaProvider: captcha.provider,
          captchaToken: captcha.token,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Please check the form and try again.");
      setSent(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not send your enquiry.");
      setCaptchaReset(value => value + 1);
    } finally {
      setBusy(false);
    }
  }

  if (sent) return <div className="interior-form interior-form-success" role="status"><CheckCircle2 /><span className="eyebrow">Request received</span><h2>Thank you. Let’s shape your space.</h2><p>Our team will review your details and contact you about the next step.</p><button className="button dark" onClick={() => setSent(false)} type="button">Send another enquiry</button></div>;

  return (
    <form className="interior-form" id="interior-consultation" onSubmit={submit}>
      <div className="interior-form-heading"><span>Free design consultation</span><strong>Tell us about your space</strong></div>
      <div className="interior-form-grid">
        <label>Full Name<input required name="name" autoComplete="name" /></label>
        <label>Mobile Number<input required name="mobile" autoComplete="tel" type="tel" pattern="[0-9+\-\s]{8,16}" /></label>
        <label>Email Address<input required name="email" autoComplete="email" type="email" /></label>
        <label>Property Location<input required name="location" placeholder="Area, Bengaluru" /></label>
        <label>Property Type<select required name="propertyType" defaultValue=""><option value="" disabled>Select property</option>{["1 BHK", "2 BHK", "3 BHK", "4+ BHK", "Villa", "Commercial"].map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Required Service<select required name="service" defaultValue=""><option value="" disabled>Select service</option>{["Complete Home Interiors", "Modular Kitchen", "Living Room", "Bedroom", "Wardrobes & Storage", "Commercial Interiors", "Renovation"].map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Expected Project Timeline<select required name="timeline" defaultValue=""><option value="" disabled>Select timeline</option>{["As soon as planning is complete", "Within 1–3 months", "Within 3–6 months", "More than 6 months", "Exploring options"].map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="form-wide">Message<textarea name="message" rows={3} placeholder="Share priorities, rooms or design preferences..." /></label>
      </div>
      <label className="consent-check"><input required type="checkbox" name="consent" /><span>I agree to be contacted by RS Construction by phone, email or WhatsApp about this enquiry.</span></label>
      <CaptchaField fallbackAllowed={captchaFallback} onVerify={setCaptcha} provider={captchaProvider} resetSignal={captchaReset} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button primary form-submit" disabled={busy} type="submit">{busy ? "Sending…" : "Get Free Consultation"} <ArrowRight size={18} /></button>
    </form>
  );
}

"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { CaptchaField } from "./CaptchaField";

export function LeadForm({ recaptcha = false }: { recaptcha?: boolean }) {
  const [sent, setSent] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ source: "Contact Form", name: form.get("name"), mobile: form.get("mobile"), email: form.get("email"), location: form.get("location"), plotSize: form.get("plotSize"), message: form.get("message"), captchaToken: captcha }) });
    const result = await response.json();
    if (!response.ok) return setError(result.error || "Please check the form.");
    setSent(true);
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
      <CaptchaField enabled={recaptcha} onVerify={setCaptcha} />
      {error && <p className="form-error">{error}</p>}
      <button className="button primary form-submit" type="submit">Request a consultation <ArrowRight size={18} /></button>
      <small>By submitting, you agree to be contacted by RS Construction about your inquiry.</small>
    </form>
  );
}

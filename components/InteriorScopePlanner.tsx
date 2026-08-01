"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { CaptchaField } from "./CaptchaField";

type CaptchaValue = { answer?: string; provider: "google" | "text"; token: string };

type PlannerProps = {
  captchaFallback?: boolean;
  captchaProvider?: "google" | "text";
  recaptcha?: boolean;
};

const selectFields = [
  ["propertyType", "Property Type", ["1 BHK", "2 BHK", "3 BHK", "4+ BHK", "Villa", "Commercial"]],
  ["bedrooms", "Number of Bedrooms", ["1", "2", "3", "4+"]],
  ["kitchenType", "Kitchen Type", ["L-Shaped", "U-Shaped", "Parallel", "Straight", "Island", "Not required"]],
  ["interiorPackage", "Interior Package", ["Essential", "Signature", "Luxury"]],
  ["requiredSpaces", "Required Spaces", ["Complete home", "Kitchen + wardrobes", "Selected rooms", "Commercial space"]],
] as const;

export function InteriorScopePlanner({ captchaFallback = false, captchaProvider = "google", recaptcha = false }: PlannerProps) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState<CaptchaValue>({ provider: captchaProvider, token: "" });
  const [captchaReset, setCaptchaReset] = useState(0);
  const captchaRequired = captchaProvider === "text" || (recaptcha && process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "true" && Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim()));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError("");
    if (captchaRequired && (!captcha.token || (captcha.provider === "text" && !captcha.answer?.trim()))) {
      setError("Please complete the security check.");
      return;
    }

    setBusy(true);
    const form = new FormData(formElement);
    const details = {
      propertyType: String(form.get("propertyType") || ""),
      bedrooms: String(form.get("bedrooms") || ""),
      kitchenType: String(form.get("kitchenType") || ""),
      interiorPackage: String(form.get("interiorPackage") || ""),
      requiredSpaces: String(form.get("requiredSpaces") || ""),
      propertyLocation: String(form.get("propertyLocation") || ""),
      carpetArea: String(form.get("carpetArea") || ""),
      additionalMessage: String(form.get("additionalMessage") || ""),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "RS Interiors Scope Planner",
          name: form.get("name"),
          mobile: form.get("mobile"),
          email: form.get("email"),
          location: details.propertyLocation,
          plotSize: `${details.carpetArea} sq.ft carpet area`,
          service: "Interior Design & Execution",
          consent: form.get("consent") === "on",
          details,
          captchaAnswer: captcha.answer,
          captchaProvider: captcha.provider,
          captchaToken: captcha.token,
        }),
      });
      const result = await response.json().catch(() => ({ error: "The enquiry server returned an invalid response." }));
      if (!response.ok) throw new Error(result.error || "Please check the form and try again.");
      formElement.reset();
      setSent(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not send your enquiry.");
      setCaptchaReset(value => value + 1);
    } finally {
      setBusy(false);
    }
  }

  if (sent) return <div className="interior-estimator interior-planner-success" role="status"><CheckCircle2 /><div><span className="eyebrow">Estimate request received</span><h3>Thank you. Your interior brief is now with our team.</h3><p>It has been added to the Admin Panel and the team will contact you about the next step.</p><button className="button dark" type="button" onClick={() => setSent(false)}><span className="button-content">Plan another project</span></button></div></div>;

  return (
    <form className="interior-estimator interior-planner" onSubmit={submit}>
      <div className="interior-estimator-fields">
        <label>Full Name<input required name="name" autoComplete="name" maxLength={100} /></label>
        <label>Mobile Number<input required name="mobile" autoComplete="tel" inputMode="tel" type="tel" pattern="[0-9+\-\s]{8,16}" /></label>
        <label>Email Address<input required name="email" autoComplete="email" type="email" maxLength={160} /></label>
        {selectFields.map(([name, label, options]) => <label key={name}>{label}<select required name={name} defaultValue=""><option value="" disabled>Select</option>{options.map(option => <option key={option}>{option}</option>)}</select></label>)}
        <label>Property Location<input required name="propertyLocation" autoComplete="address-level2" maxLength={160} placeholder="Area, city" /></label>
        <label>Carpet Area<input required min="100" max="1000000" inputMode="numeric" name="carpetArea" type="number" placeholder="Area in sq.ft" /></label>
        <label className="planner-wide">Additional Message<textarea name="additionalMessage" rows={4} maxLength={2000} placeholder="Share priorities, finishes, timelines or other requirements..." /></label>
        <label className="consent-check planner-wide"><input required type="checkbox" name="consent" /><span>I agree to be contacted by RS Construction by phone, email or WhatsApp about this enquiry.</span></label>
        <div className="planner-wide"><CaptchaField fallbackAllowed={captchaFallback} onVerify={setCaptcha} provider={captchaProvider} resetSignal={captchaReset} /></div>
        {error && <p className="form-error planner-wide" role="alert">{error}</p>}
      </div>
      <div className="interior-estimator-result">
        <span>Personalised estimate</span>
        <strong>Plan scope before pricing</strong>
        <p>Final pricing depends on measured area, selected scope, materials, finishes and site conditions.</p>
        <button className="button primary" disabled={busy} type="submit"><span className="button-content">{busy ? "Sending…" : "Get My Detailed Estimate"}<ArrowRight /></span></button>
      </div>
    </form>
  );
}

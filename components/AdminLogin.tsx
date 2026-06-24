"use client";

import { CaptchaField } from "./CaptchaField";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { startRoutePreloader } from "./GlobalPreloader";
import Image from "next/image";

export function AdminLogin({ recaptcha = false, temporaryMode = false }: { recaptcha?: boolean; temporaryMode?: boolean }) {
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const captchaRequired = recaptcha && process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "true" && Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (captchaRequired && !captcha) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password"), captchaToken: captcha }),
    });
    const result = await response.json();
    if (!response.ok) return setError(result.error || "Invalid username or password.");
    startRoutePreloader();
    router.push("/admin");
    router.refresh();
  }

  function showCaptchaRequired() {
    if (captchaRequired && !captcha) setError("Please complete the reCAPTCHA verification.");
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-brand">
        <Image src="/images/rs-logo.png" alt="RS Construction" width={216} height={120} priority />
        <strong>RS CONSTRUCTION</strong>
        <p>Secure content and lead management</p>
      </div>
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-lock"><LockKeyhole /></div>
        <span className="eyebrow">Protected administration</span>
        <h1>Welcome back</h1>
        <p>Sign in to manage projects, enquiries and website content.</p>
        {temporaryMode && <p className="temporary-login-note"><strong>Temporary recovery login</strong><span>Username: admin / Password: admin123</span></p>}
        <label>Username<input name="email" type="text" required autoComplete="username" /></label>
        <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
        <CaptchaField enabled={captchaRequired} onVerify={setCaptcha} />
        {error && <p className="form-error">{error}</p>}
        <button className="button primary" type="submit" onClick={showCaptchaRequired}>Secure login</button>
        <small><ShieldCheck /> {temporaryMode ? "Temporary credentials are active until environment variables are configured." : "Credentials and session secrets are environment-configured."}</small>
      </form>
    </main>
  );
}

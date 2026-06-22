"use client";
import { CaptchaField } from "./CaptchaField";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const [captcha,setCaptcha]=useState(""); const [error,setError]=useState(""); const router=useRouter();
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError("");const f=new FormData(e.currentTarget);const r=await fetch("/api/admin/login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:f.get("email"),password:f.get("password"),captchaToken:captcha})});const j=await r.json();if(!r.ok)return setError(j.error);router.push("/admin");router.refresh();}
  return <main className="admin-login-page"><div className="admin-login-brand"><span>RS</span><strong>RS CONSTRUCTION</strong><p>Secure content and lead management</p></div><form className="admin-login-card" onSubmit={submit}><div className="admin-lock"><LockKeyhole/></div><span className="eyebrow">Protected administration</span><h1>Welcome back</h1><p>Sign in to manage projects, enquiries and website content.</p><label>Email<input name="email" type="email" required autoComplete="username"/></label><label>Password<input name="password" type="password" required autoComplete="current-password"/></label><CaptchaField onVerify={setCaptcha}/>{error&&<p className="form-error">{error}</p>}<button className="button primary" type="submit">Secure login</button><small><ShieldCheck/> Credentials and session secrets are environment-configured.</small></form></main>
}

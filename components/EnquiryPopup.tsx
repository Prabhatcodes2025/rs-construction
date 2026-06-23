"use client";

import { CaptchaField } from "./CaptchaField";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock3, IndianRupee, ShieldCheck, X } from "lucide-react";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function EnquiryPopup({ address = "14, 1st Main Rd, RT Nagar, Bengaluru 560032", recaptcha = false }: { address?: string; recaptcha?: boolean }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();
  const verify = useCallback((token: string) => setCaptcha(token), []);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const click = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a");
      const text = link?.textContent?.toLowerCase() || "";
      if (link && link.getAttribute("href")?.startsWith("/contact") && /estimate|consultation|enquire|quote|get in touch/.test(text)) { event.preventDefault(); setOpen(true); }
    };
    document.addEventListener("click", click, true);
    const closed = typeof window !== "undefined" ? sessionStorage.getItem("rs-popup-closed") : "1";
    const timer = !closed ? window.setTimeout(() => setOpen(true), 9000) : 0;
    return () => { document.removeEventListener("click", click, true); if (timer) clearTimeout(timer); };
  }, [pathname]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    document.body.classList.add("enquiry-open");
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("enquiry-open");
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function close() {
    setOpen(false);
    if (typeof window !== "undefined") sessionStorage.setItem("rs-popup-closed", "1");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ source: "Enquiry Popup", name: form.get("name"), mobile: form.get("mobile"), location: form.get("location"), plotSize: form.get("plotSize"), service: form.get("service"), message: form.get("message"), captchaToken: captcha }) });
    const result = await response.json();
    if (!response.ok) return setError(result.error || "Please check the form.");
    setSent(true);
    if (typeof window !== "undefined") sessionStorage.setItem("rs-popup-closed", "1");
  }

  return <AnimatePresence>{open && <motion.div className="enquiry-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={e => e.target === e.currentTarget && close()}>
    <motion.div className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" initial={{ opacity: 0, y: 35, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .97 }} transition={{ type: "spring", damping: 24, stiffness: 260 }}>
      <button className="enquiry-close" aria-label="Close enquiry form" onClick={close}><X /></button>
      <div className="enquiry-visual"><Image src="/images/hero-villa.png" alt="Contemporary villa by RS Construction" fill sizes="360px" /><div><span>4+ years of construction expertise</span><h3>Your vision.<br />One accountable team.</h3><p>{address}</p></div></div>
      <div className="enquiry-content">{sent ? <div className="enquiry-success"><CheckCircle2 /><h2>Thank you.</h2><p>Our construction expert will contact you shortly.</p><button className="button dark" onClick={close}>Continue browsing</button></div> : <>
        <Image className="popup-logo" src="/images/rs-logo.png" alt="RS Construction" width={108} height={60} /><span className="eyebrow">Free expert consultation</span><h2 id="enquiry-title">Build your dream home with RS Construction</h2><p>Get transparent pricing and end-to-end construction support in Bengaluru.</p>
        <form onSubmit={submit}><div className="popup-fields"><input required name="name" aria-label="Full name" autoComplete="name" placeholder="Full Name*" /><input required name="mobile" aria-label="Mobile number" autoComplete="tel" type="tel" placeholder="Mobile Number*" /><input required name="location" aria-label="Plot location" placeholder="Plot Location*" /><input name="plotSize" aria-label="Plot size" placeholder="Plot Size" /><select name="service" aria-label="Service required" defaultValue=""><option value="" disabled>Service Required</option><option>Residential Construction</option><option>Commercial Construction</option><option>Architectural Planning</option><option>Interior Design</option><option>Renovation &amp; Remodelling</option><option>Project Management</option><option>Turnkey Construction Solutions</option></select><textarea name="message" aria-label="Message" rows={2} placeholder="Message (optional)" /></div><CaptchaField enabled={recaptcha} onVerify={verify} />{error && <p className="form-error">{error}</p>}<button className="button primary popup-submit" type="submit">Start your construction journey</button></form>
        <div className="popup-trust"><span><ShieldCheck />Quality construction</span><span><IndianRupee />Transparent pricing</span><span><Clock3 />On-time delivery</span></div>
      </>}</div>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

"use client";

import { CheckCircle2, Play, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function VideoTestimonial() {
  const [open, setOpen] = useState(false);
  return (
    <div className="video-placeholder">
      <Image src="/images/project-residence.png" alt="Customer testimonial placeholder" fill sizes="(max-width: 800px) 100vw, 50vw" />
      <button aria-label="Play testimonial" aria-expanded={open} onClick={() => setOpen(true)}><Play fill="currentColor" /></button>
      <div><span>Customer story</span><strong>A home built without the usual uncertainty.</strong></div>
      {open && <div className="video-notice" role="dialog" aria-label="Video testimonial status"><button aria-label="Close testimonial message" onClick={() => setOpen(false)}><X /></button><CheckCircle2 /><strong>Customer video placeholder</strong><p>The final customer testimonial can be added here without changing this layout.</p></div>}
    </div>
  );
}

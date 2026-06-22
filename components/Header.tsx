"use client";

import Link from "next/link";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  ["About", "/about"], ["Services", "/services"], ["Packages", "/packages"],
  ["Projects", "/projects"], ["Management", "/management"], ["Contact", "/contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-accent" />
      <div className="nav-shell">
        <Logo />
        <nav className={open ? "nav-links open" : "nav-links"}>
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <a className="nav-whatsapp" href="https://wa.me/919901567272"><MessageCircle size={16} /> WhatsApp</a>
          <Link className="nav-cta" href="/contact"><Phone size={15} /> Get free estimate</Link>
        </nav>
        <button className="menu-btn" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { ChevronDown, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const links = [
  ["Home", "/"], ["About Us", "/about"], ["Management Team", "/management"],
  ["Services", "/services"], ["Packages", "/packages"], ["Projects", "/projects"], ["Contact Us", "/contact"],
];
const interiorLinks = [
  ["Complete Home Interiors", "/interiors#interior-services"],
  ["Modular Kitchens", "/interiors#interior-services"],
  ["Living Room Interiors", "/interiors#interior-portfolio"],
  ["Bedroom Interiors", "/interiors#interior-portfolio"],
  ["Wardrobes & Storage", "/interiors#interior-services"],
  ["Commercial Interiors", "/interiors#interior-portfolio"],
];

export function Header({ whatsapp = "https://wa.me/919901567272" }: { whatsapp?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setOpen(false);
    document.body.classList.remove("menu-open");
  }, [pathname]);
  function toggleMenu() {
    setOpen(value => {
      document.body.classList.toggle("menu-open", !value);
      return !value;
    });
  }
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header-accent" />
      <div className="scroll-progress" />
      <div className="nav-shell">
        <Logo />
        <Link className="mobile-touch-cta" href="/contact">Get in touch</Link>
        <nav className={open ? "nav-links open" : "nav-links"}>
          {links.slice(0, 4).map(([label, href]) => <Link className={pathname === href ? "active" : ""} key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <div className={`nav-dropdown ${pathname === "/interiors" ? "active" : ""}`}>
            <Link href="/interiors" onClick={() => setOpen(false)}>Interiors <ChevronDown size={14} /></Link>
            <div className="nav-dropdown-menu">{interiorLinks.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</div>
          </div>
          {links.slice(4).map(([label, href]) => <Link className={pathname === href ? "active" : ""} key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <a className="nav-whatsapp" href={whatsapp}><MessageCircle size={16} /> WhatsApp</a>
          <Link className="nav-cta" href="/contact"><Phone size={15} /> Get free estimate</Link>
        </nav>
        <button className="menu-btn" aria-label="Toggle menu" aria-expanded={open} onClick={toggleMenu}>{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}

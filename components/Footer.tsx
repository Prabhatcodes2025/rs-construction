import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { getSiteData } from "@/lib/store";

export async function Footer() {
  const data=await getSiteData(); const settings=(data.settings||{}) as Record<string,string>;
  return (
    <footer className="footer">
      <div className="footer-grid shell">
        <div><Logo light /><p>Precision-built homes, commercial spaces and interiors—delivered with clarity at every stage.</p></div>
        <div><h4>Explore</h4><Link href="/services">Services</Link><Link href="/packages">Packages</Link><Link href="/projects">Projects</Link><Link href="/about">Our story</Link></div>
        <div><h4>Contact</h4><a href={`tel:${String(settings.phone||"+919901567272").replace(/\s/g,"")}`}><Phone size={16} /> {settings.phone||"+91 99015 67272"}</a><a href={`mailto:${settings.email||"rsconstruction2027@gmail.com"}`}><Mail size={16} /> Email our team</a><a href={settings.map||"https://share.google/YoghYTG0lBF0TiA2O"}><MapPin size={16} /> {settings.address||"14, 1st Main Rd, Rahmath Nagar, RT Nagar, Bengaluru 560032"}</a></div>
        <div><h4>Start a project</h4><p>Tell us about your plot and vision. We’ll help you plan the next move.</p><Link className="text-link" href="/contact">Book consultation <ArrowUpRight size={17} /></Link></div>
      </div>
      <div className="footer-bottom shell"><span>© 2026 RS Construction</span><span>Building Excellence. Delivering Trust.</span></div>
    </footer>
  );
}

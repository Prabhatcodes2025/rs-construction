import Link from "next/link";
import { ArrowRight } from "lucide-react";
export function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="page-hero blueprint"><div className="page-hero-lines" /><div className="shell page-hero-grid"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div><div className="page-hero-aside"><span className="page-hero-number">RS / 2026</span><p>{copy}</p><Link className="button primary" href="/contact">Discuss your project <ArrowRight size={18} /></Link></div></div></section>;
}

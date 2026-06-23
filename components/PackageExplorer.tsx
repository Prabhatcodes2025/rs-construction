"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, MessageSquareText, Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const cities = ["Bengaluru", "Mysuru", "Chennai", "Hyderabad", "Pune"];
const categories = ["Structure", "Kitchen", "Bathroom", "Doors & Windows", "Painting", "Flooring", "Electrical", "Miscellaneous"];
const placeholder = "Details can be updated from admin panel.";

type PackageItem = {
  id?: string; name: string; price: string; gstText?: string; cities?: string[];
  details?: Record<string, string>; categoryTitles?: Record<string, string>; features?: Record<string, string>; bestFor?: string;
  description?: string; highlighted?: boolean; displayOrder?: number; active?: boolean; ctaText?: string;
};
type WhyRow = {
  id?: string; parameter: string; rsValue?: "Check" | "Cross"; othersValue?: "Check" | "Cross";
  displayOrder?: number; active?: boolean;
};

const fallbackPackages: PackageItem[] = [
  packageData("basic", "Basic", "₹1,940", "Kamdhenu", "Aluminium", "₹50/sft", "Tractor", "Standard", 1),
  packageData("classic", "Classic", "₹2,070", "Indus", "UPVC", "₹100/sft", "Tractor Shyne", "Premium", 2),
  { ...packageData("premium", "Premium", "₹2,400", "Indus", "Premium UPVC", "₹140/sft", "Apcolite", "Premium+", 3), highlighted: true },
  packageData("royale", "Royale", "₹2,640", "Indus", "Luxury UPVC", "₹160/sft", "Royale Luxury", "Luxury", 4),
];

const fallbackWhyUs: WhyRow[] = [
  "Transparent Project Tracking", "Money Safety & Stage-Wise Payment", "Multiple Design Options",
  "Quality Checks at Every Stage", "Cost Overrun Protection", "Experienced Project Team",
  "On-Time Delivery Commitment", "End-to-End Construction Support",
].map((parameter, index) => ({ id: `why-${index + 1}`, parameter, rsValue: "Check", othersValue: "Cross", displayOrder: index + 1, active: true }));

function packageData(id: string, name: string, price: string, steel: string, windows: string, flooring: string, paint: string, electrical: string, displayOrder: number): PackageItem {
  return {
    id, name, price, gstText: "Incl. GST", cities, displayOrder, active: true, ctaText: "Talk To Our Expert",
    details: {
      Structure: `Steel: ${steel}`,
      Kitchen: placeholder,
      Bathroom: placeholder,
      "Doors & Windows": `Windows: ${windows}`,
      Painting: `Paint: ${paint}`,
      Flooring: `Flooring allowance: ${flooring}`,
      Electrical: `Electrical specification: ${electrical}`,
      Miscellaneous: placeholder,
    },
  };
}

function normalizedDetails(item: PackageItem) {
  const feature = item.features || {};
  return {
    Structure: item.details?.Structure || (feature.Steel ? `Steel: ${feature.Steel}` : placeholder),
    Kitchen: item.details?.Kitchen || placeholder,
    Bathroom: item.details?.Bathroom || placeholder,
    "Doors & Windows": item.details?.["Doors & Windows"] || (feature.Windows ? `Windows: ${feature.Windows}` : placeholder),
    Painting: item.details?.Painting || (feature.Paint ? `Paint: ${feature.Paint}` : placeholder),
    Flooring: item.details?.Flooring || (feature.Flooring ? `Flooring allowance: ${feature.Flooring}` : placeholder),
    Electrical: item.details?.Electrical || (feature.Electrical ? `Electrical specification: ${feature.Electrical}` : placeholder),
    Miscellaneous: item.details?.Miscellaneous || placeholder,
  };
}

export function PackageExplorer() {
  const [city, setCity] = useState("Bengaluru");
  const [selected, setSelected] = useState(0);
  const [packages, setPackages] = useState<PackageItem[]>(fallbackPackages);
  const [whyUs, setWhyUs] = useState<WhyRow[]>(fallbackWhyUs);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/content").then(response => response.json()).then(data => {
      if (Array.isArray(data.packages) && data.packages.length) setPackages(data.packages);
      if (Array.isArray(data.whyUs) && data.whyUs.length) setWhyUs(data.whyUs);
    }).catch(() => {});
  }, []);

  const visiblePackages = useMemo(() => packages
    .filter(item => item.active !== false && (!Array.isArray(item.cities) || item.cities.length === 0 || item.cities.includes(city)))
    .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0)), [packages, city]);
  const visibleWhyUs = useMemo(() => whyUs
    .filter(item => item.active !== false)
    .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0)), [whyUs]);
  const selectedPackage = visiblePackages[selected] || visiblePackages[0];

  useEffect(() => {
    if (selected >= visiblePackages.length) setSelected(0);
  }, [selected, visiblePackages.length]);

  function scroll(direction: number) {
    rail.current?.scrollBy({ left: direction * Math.max(300, rail.current.clientWidth * .82), behavior: "smooth" });
  }

  return <div className="packages-experience">
    <div className="packages-intro">
      <span className="eyebrow">Transparent specifications</span>
      <h2>Our Packages</h2>
      <p>Find the best home construction package for your dream project.</p>
      <label>Currently showing for <select value={city} onChange={event => setCity(event.target.value)}>{cities.map(item => <option key={item}>{item}</option>)}</select></label>
    </div>

    <div className="mobile-package-navigation" role="tablist" aria-label="Choose a construction package">
      <div className="mobile-package-tabs">
        {visiblePackages.map((item, index) => <button role="tab" aria-selected={selected === index} className={selected === index ? "active" : ""} onClick={() => setSelected(index)} key={item.id || item.name}>{item.name}</button>)}
      </div>
      <div className="package-stepper" style={{ "--package-progress": `${visiblePackages.length > 1 ? selected / (visiblePackages.length - 1) * 100 : 0}%` } as CSSProperties}>
        <i className="package-step-line" />
        <i className="package-step-progress" />
        {visiblePackages.map((item, index) => <span style={{ left: `${visiblePackages.length > 1 ? index / (visiblePackages.length - 1) * 100 : 0}%` }} className={selected === index ? "active" : selected > index ? "complete" : ""} key={item.id || item.name} />)}
      </div>
    </div>

    <div className="mobile-selected-package">
      <AnimatePresence mode="wait">
        {selectedPackage && <motion.div key={`${city}-${selectedPackage.id || selectedPackage.name}`} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }} transition={{ duration: .25 }}>
          <PackageCard item={selectedPackage} />
        </motion.div>}
      </AnimatePresence>
    </div>

    <div className="package-rail-wrap">
      <button className="package-rail-arrow previous" aria-label="Previous packages" onClick={() => scroll(-1)}><ChevronLeft /></button>
      <div className="package-card-rail" ref={rail}>
        {visiblePackages.map(item => <PackageCard item={item} key={item.id || item.name} />)}
      </div>
      <button className="package-rail-arrow next" aria-label="Next packages" onClick={() => scroll(1)}><ChevronRight /></button>
    </div>
    <small className="package-terms">*T&amp;C Apply</small>

    <section className="why-us-comparison">
      <div className="why-us-heading"><span className="eyebrow">The RS advantage</span><h2>Why Choose RS Construction?</h2><p>A transparent, reliable, and quality-first construction experience.</p></div>
      <div className="why-us-table" role="table" aria-label="RS Construction comparison">
        <div className="why-us-row why-us-header" role="row"><strong>Parameter</strong><strong>RS Construction</strong><strong>Others</strong></div>
        {visibleWhyUs.map(row => <div className="why-us-row" role="row" key={row.id || row.parameter}>
          <span>{row.parameter}</span><ComparisonIcon value={row.rsValue || "Check"} /><ComparisonIcon value={row.othersValue || "Cross"} />
        </div>)}
      </div>
      <Link className="button primary why-us-cta" href="/contact">Talk To Our Expert</Link>
    </section>

    {selectedPackage && <Link className="mobile-package-sticky-cta" href={`/contact?package=${encodeURIComponent(selectedPackage.name)}`}><MessageSquareText />Book Free Consultation</Link>}
  </div>;
}

function PackageCard({ item }: { item: PackageItem }) {
  const [open, setOpen] = useState<string | null>(null);
  const details = normalizedDetails(item);
  return <article className={`new-package-card ${item.highlighted ? "highlighted" : ""}`}>
    {item.highlighted && <span className="package-best-value">Best value</span>}
    <header><span>{item.name}</span><strong>{item.price}<small>/sq.ft</small></strong><em>{item.gstText || "Incl. GST"}</em></header>
    <div className="package-accordion">
      {categories.map(category => {
        const expanded = open === category;
        return <div className={`package-accordion-item ${expanded ? "open" : ""}`} key={category}>
          <button aria-expanded={expanded} onClick={() => setOpen(expanded ? null : category)}><span>{item.categoryTitles?.[category] || category}</span>{expanded ? <Minus /> : <Plus />}</button>
          <AnimatePresence initial={false}>{expanded && <motion.div className="package-accordion-copy" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .24 }}><p>{details[category as keyof typeof details]}</p></motion.div>}</AnimatePresence>
        </div>;
      })}
    </div>
    <footer><span>Get in touch with us!</span><Link className="button primary" href={`/contact?package=${encodeURIComponent(item.name)}`}>{item.ctaText || "Talk To Our Expert"}</Link></footer>
  </article>;
}

function ComparisonIcon({ value }: { value: "Check" | "Cross" }) {
  const checked = value === "Check";
  return <span className={`comparison-result ${checked ? "positive" : "negative"}`} aria-label={checked ? "Yes" : "No"}>{checked ? <Check /> : <X />}</span>;
}

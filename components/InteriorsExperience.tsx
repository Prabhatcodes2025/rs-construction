"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { interiorData, type EditableInteriorCard, type InteriorCard } from "@/data/interiors";
import { InteriorScopePlanner } from "./InteriorScopePlanner";

function DesignRail({ cards, className = "" }: { cards: InteriorCard[]; className?: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * Math.min(rail.current.clientWidth * .86, 820), behavior: "smooth" });
  return <div className={`interior-rail-wrap ${className}`}><div className="interior-rail-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous designs"><ArrowLeft /></button><button type="button" onClick={() => move(1)} aria-label="Next designs"><ArrowRight /></button></div><div className="interior-rail" ref={rail} tabIndex={0}>{cards.map(card => <article className="design-card" key={card.title}><div><Image src={card.image} alt={card.alt} fill sizes="(max-width: 700px) 86vw, 420px" /></div>{card.label && <span>{card.label}</span>}<h3>{card.title}</h3>{card.meta && <small>{card.meta}</small>}<p>{card.description}</p></article>)}</div></div>;
}

function Portfolio() {
  const filters = ["All", "Kitchen", "Living Room", "Bedroom", "Wardrobe", "Complete Home", "Commercial"];
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const projects = interiorData.portfolio.filter(item => active === "All" || item[2] === active);
  useEffect(() => {
    if (open === null) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <>
    <div className="interior-tabs" role="tablist" aria-label="Filter interior portfolio">{filters.map(filter => <button role="tab" aria-selected={active === filter} className={active === filter ? "active" : ""} key={filter} onClick={() => setActive(filter)}>{filter}</button>)}</div>
    <div className="interior-portfolio">{projects.map((project, index) => <button className="interior-project" key={project[0]} onClick={() => setOpen(index)} aria-label={`Open ${project[0]} gallery image`}><span className="interior-project-image"><Image src={project[5]} alt={project[6]} fill sizes="(max-width: 700px) 100vw, 50vw" /></span><span className="interior-project-copy"><small>{project[2]} · {project[4]}</small><strong>{project[0]}</strong><em>{project[1]} · {project[3]}</em></span></button>)}</div>
    {open !== null && <div className="interior-lightbox" role="dialog" aria-modal="true" aria-label={projects[open][0]} onClick={() => setOpen(null)}><button autoFocus aria-label="Close gallery" onClick={() => setOpen(null)}><X /></button><div onClick={event => event.stopPropagation()}><Image src={projects[open][5]} alt={projects[open][6]} fill sizes="95vw" /><span><strong>{projects[open][0]}</strong><small>{projects[open][1]} · {projects[open][2]} · {projects[open][3]}</small></span></div></div>}
  </>;
}

export function InteriorsExperience({ phone, whatsapp, interiorCards = [], captchaFallback = false, captchaProvider = "google", recaptcha = false }: { phone: string; whatsapp: string; interiorCards?: EditableInteriorCard[]; captchaFallback?: boolean; captchaProvider?: "google" | "text"; recaptcha?: boolean }) {
  const sectionCards = (section: EditableInteriorCard["section"], fallback: InteriorCard[]) => {
    const saved = interiorCards.filter(card => card.section === section && card.active !== false).sort((a, b) => a.displayOrder - b.displayOrder);
    return saved.length ? saved : fallback;
  };
  const services = sectionCards("Main Services", interiorData.services);
  const spaces = sectionCards("Space-Saving", interiorData.spaceSaving.map(([title, description, image, alt]) => ({ title, description, image, alt })));
  const kitchens = sectionCards("Kitchen", interiorData.kitchens);
  const livingRooms = sectionCards("Living Room", interiorData.livingRooms);
  const bedrooms = sectionCards("Bedroom", interiorData.bedrooms);
  return (
    <>
      <section className="section interior-trust"><div className="shell">{interiorData.trust.map((item, index) => <div key={item}><span>0{index + 1}</span><Check /><strong>{item}</strong></div>)}</div></section>

      <section className="section blueprint" id="interior-services"><div className="shell"><div className="section-heading split"><div><span className="eyebrow">Complete interior services</span><h2>Everything your space needs. Under one roof.</h2></div><p>Design, modular solutions and coordinated site work brought together in one clear scope.</p></div><div className="interior-service-grid">{services.map(card => <article key={card.title}><div><Image src={card.image} alt={card.alt} fill sizes="(max-width: 700px) 100vw, 33vw" /></div><span>{card.label}</span><h3>{card.title}</h3><p>{card.description}</p><a href="#interior-portfolio">Explore Designs <ArrowRight /></a></article>)}</div></div></section>

      <section className="section dark-section"><div className="shell"><div className="section-heading split"><div><span className="eyebrow light">Space-smart design</span><h2>Smart ideas that make every square foot work harder.</h2></div><p>Thoughtful furniture and storage strategies help rooms adapt without feeling crowded.</p></div><DesignRail cards={spaces} /></div></section>

      <section className="section interior-category"><div className="shell"><div className="section-heading split"><div><span className="eyebrow">Kitchen planning</span><h2>Modular kitchens designed for Indian homes.</h2></div><p>Our modular kitchens balance workflow, storage, durability and style while being customised around your available space and daily requirements.</p></div><DesignRail cards={kitchens} /><a className="button dark category-cta" href="#interior-consultation"><span className="button-content">Plan My Kitchen <ArrowRight /></span></a></div></section>

      <section className="section interior-category interior-category-dark"><div className="shell"><div className="section-heading split"><div><span className="eyebrow light">Living rooms</span><h2>Living spaces that make the right first impression.</h2></div><p>Seating, media, storage and lighting composed to feel welcoming from every angle.</p></div><DesignRail cards={livingRooms} /><a className="button primary category-cta" href="#interior-consultation"><span className="button-content">Discuss Your Living Room <ArrowRight /></span></a></div></section>

      <section className="section interior-category"><div className="shell"><div className="section-heading split"><div><span className="eyebrow">Bedrooms</span><h2>Comfort, storage and style—thoughtfully combined.</h2></div><p>Personal spaces planned for easier routines, quieter rest and storage that belongs.</p></div><DesignRail cards={bedrooms} /><a className="button dark category-cta" href="#interior-consultation"><span className="button-content">Meet an Interior Expert <ArrowRight /></span></a></div></section>

      <section className="section blueprint"><div className="shell"><div className="section-heading centered"><span className="eyebrow">Scope at a glance</span><h2>What you get with RS Interiors</h2></div><div className="interior-inclusions">{interiorData.inclusions.map(([title, items], index) => <article key={title as string}><span>RS / 0{index + 1}</span><h3>{title as string}</h3><ul>{(items as string[]).map(item => <li key={item}><Check />{item}</li>)}</ul></article>)}</div></div></section>

      <section className="section interior-process"><div className="shell"><div className="section-heading centered"><span className="eyebrow light">Interior design process</span><h2>From first conversation to final styling.</h2></div><div className="interior-process-grid">{interiorData.process.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>

      <section className="section interior-portfolio-section" id="interior-portfolio"><div className="shell"><div className="section-heading split"><div><span className="eyebrow light">Interior portfolio</span><h2>Spaces designed with purpose.</h2></div><p>Editable concept placeholders are shown until RS Construction supplies verified project photography and details.</p></div><Portfolio /></div></section>

      <section className="section blueprint"><div className="shell"><div className="section-heading centered"><span className="eyebrow">Why RS Interiors</span><h2>One team. Complete accountability.</h2></div><div className="strength-grid">{interiorData.benefits.map((benefit, index) => <article className="strength-card" key={benefit}><span className="icon-box"><Check /></span><h3>{benefit}</h3><p>Clear coordination from design decisions through execution and handover.</p><span className="card-index">RS / {String(index + 1).padStart(2, "0")}</span></article>)}</div></div></section>

      <section className="section dark-section"><div className="shell"><div className="section-heading split"><div><span className="eyebrow light">Interior packages</span><h2>A clear starting point for every ambition.</h2></div><p>Choose a direction, then tailor the scope around the property and your priorities.</p></div><div className="interior-package-grid">{interiorData.packages.map(([name, copy, ideal, design, modular, material, custom], index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{copy}</p><dl><div><dt>Ideal property</dt><dd>{ideal}</dd></div><div><dt>Design services</dt><dd>{design}</dd></div><div><dt>Modular solutions</dt><dd>{modular}</dd></div><div><dt>Material category</dt><dd>{material}</dd></div><div><dt>Customisation</dt><dd>{custom}</dd></div></dl><a className="button outline" href="#interior-consultation"><span className="button-content">Request Detailed Estimate</span></a></article>)}</div><p className="package-note">Final pricing depends on property size, scope, materials, finishes and custom requirements.</p></div></section>

      <section className="section interior-estimator-section"><div className="shell"><div className="section-heading split"><div><span className="eyebrow">Interior scope planner</span><h2>Plan the right brief before the estimate.</h2></div><p>Capture the main project variables, then speak with the team for a measured, specification-led estimate.</p></div><InteriorScopePlanner captchaFallback={captchaFallback} captchaProvider={captchaProvider} recaptcha={recaptcha} /></div></section>

      <section className="section interior-testimonials"><div className="shell"><div className="section-heading centered"><span className="eyebrow">Client stories</span><h2>Homes our clients love living in.</h2></div><article><span>EDITABLE PLACEHOLDER · GENUINE TESTIMONIAL REQUIRED</span><blockquote>Interior-specific client feedback will appear here after RS Construction supplies a verified review and permission to publish.</blockquote><small>Client name and project details pending</small></article></div></section>

      <section className="section blueprint"><div className="shell faq-shell"><div className="section-heading"><span className="eyebrow">Frequently asked questions</span><h2>Useful answers before you begin.</h2></div><div className="interior-faq">{interiorData.faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown /></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="interior-final-cta"><div className="shell"><span className="eyebrow light">Start your interior journey</span><h2>Ready to create a home that feels truly yours?</h2><p>Tell us about your property, lifestyle and design preferences. Our team will help you plan a personalised interior solution.</p><div><a className="button ghost" href="#interior-consultation"><span className="button-content">Book Free Consultation</span></a><a className="button dark" href={whatsapp}><span className="button-content"><MessageCircle /> WhatsApp Our Team</span></a><a className="button outline" href={`tel:${phone.replace(/[^\d+]/g, "")}`}><span className="button-content"><Phone /> Call Now</span></a></div></div></section>

      <nav className="interior-mobile-actions" aria-label="Interior consultation actions"><a href={`tel:${phone.replace(/[^\d+]/g, "")}`}><Phone />Call</a><a href={whatsapp}><MessageCircle />WhatsApp</a><a href="#interior-consultation">Book Consultation</a></nav>
    </>
  );
}

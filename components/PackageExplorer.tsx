"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const fallbackPackages = [
  { name: "Basic", price: "₹1,940", label: "Essential", bestFor:"Budget-conscious first homes", features: { Steel: "Kamdhenu", Windows: "Aluminium", Flooring: "₹50/sft", Paint: "Tractor", Electrical: "Standard" } },
  { name: "Classic", price: "₹2,070", label: "Enhanced", bestFor:"Balanced modern family homes", features: { Steel: "Indus", Windows: "UPVC", Flooring: "₹100/sft", Paint: "Tractor Shyne", Electrical: "Premium" } },
  { name: "Premium", price: "₹2,400", label: "Best value", bestFor:"Premium homes with refined finishes", features: { Steel: "Indus", Windows: "Premium UPVC", Flooring: "₹140/sft", Paint: "Apcolite", Electrical: "Premium+" } },
  { name: "Royale", price: "₹2,640", label: "Luxury", bestFor:"Bespoke luxury residences", features: { Steel: "Indus", Windows: "Luxury UPVC", Flooring: "₹160/sft", Paint: "Royale Luxury", Electrical: "Luxury" } },
];

export function PackageExplorer() {
  const [selected, setSelected] = useState(2);
  const [compare, setCompare] = useState(false);
  const [packages, setPackages] = useState(fallbackPackages);
  useEffect(()=>{fetch("/api/content").then(r=>r.json()).then(data=>Array.isArray(data.packages)&&setPackages(data.packages)).catch(()=>{});},[]);
  const pack = packages[selected];

  return (
    <div className="package-explorer">
      <div className="package-selector" role="tablist" aria-label="Construction packages">
        {packages.map((item, index) => (
          <button role="tab" aria-selected={selected === index && !compare} className={`${selected === index && !compare ? "active" : ""} ${index === 2 ? "recommended" : ""}`} key={item.name} onClick={() => { setSelected(index); setCompare(false); }}>
            <small>{item.label}</small><strong>{item.name}</strong><span>{item.price}<em>/sq.ft</em></span>
          </button>
        ))}
        <button className={`compare-toggle ${compare ? "active" : ""}`} onClick={() => setCompare(value => !value)}>Compare all packages</button>
      </div>

      <AnimatePresence mode="wait">
        {!compare ? (
          <motion.div key={pack.name} className="package-detail" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .35 }}>
            <div className="package-detail-head"><div><span>Selected package</span><h2>{pack.name}</h2><p>A transparent starting specification that can be tailored to your site and architectural requirements.</p></div><div><small>Construction rate</small><strong>{pack.price}</strong><span>per sq.ft</span></div></div>
            <div className="feature-breakdown">{Object.entries(pack.features).map(([name, value]) => <div key={name}><span><Check />{name}</span><strong>{String(value)}</strong></div>)}<div><span><Check />Best for</span><strong>{pack.bestFor || "Custom construction"}</strong></div></div>
            <div className="package-detail-actions"><a className="button primary" href={`/contact?package=${pack.name}`}>Get quote for {pack.name}</a><a className="button outline" href="/rs-construction-packages.txt" download><Download size={17} /> Download specifications</a><a className="button whatsapp-button" href={`https://wa.me/919901567272?text=I%20am%20interested%20in%20the%20${pack.name}%20construction%20package`}><MessageCircle size={17} /> WhatsApp enquiry</a></div>
          </motion.div>
        ) : (
          <motion.div key="compare" className="package-compare-cards" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {packages.map((item, index) => <article className={index === 2 ? "best-value" : ""} key={item.name}><small>{item.label}</small><h3>{item.name}</h3><div className="compare-price">{item.price}<span>/sq.ft</span></div>{Object.entries(item.features).map(([name, value]) => <div className="compare-feature" key={name}><span>{name}</span><strong>{String(value)}</strong></div>)}<div className="compare-feature"><span>Best for</span><strong>{item.bestFor || "Custom construction"}</strong></div><a href={`/contact?package=${item.name}`}>Get quote →</a></article>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

export function Estimator() {
  const [size, setSize] = useState(1200);
  const [floors, setFloors] = useState(2);
  const [rate, setRate] = useState(2070);
  const estimate = useMemo(() => size * floors * rate, [size, floors, rate]);
  return (
    <div className="estimator-card">
      <div className="estimator-fields">
        <label>Plot / floor area (sq.ft)<input type="number" value={size} min={300} onChange={e => setSize(Number(e.target.value))} /></label>
        <label>Number of floors<select value={floors} onChange={e => setFloors(Number(e.target.value))}><option value="1">Ground only</option><option value="2">G + 1</option><option value="3">G + 2</option><option value="4">G + 3</option></select></label>
        <label>Construction package<select value={rate} onChange={e => setRate(Number(e.target.value))}><option value="1940">Basic — ₹1,940/sq.ft</option><option value="2070">Classic — ₹2,070/sq.ft</option><option value="2400">Premium — ₹2,400/sq.ft</option><option value="2640">Royale — ₹2,640/sq.ft</option></select></label>
      </div>
      <div className="estimate-result"><span>Indicative build estimate</span><strong>₹{(estimate / 100000).toFixed(1)} lakh*</strong><small>*Preliminary estimate excluding land, approvals and taxes.</small><a href="/contact">Get a detailed quote <ArrowRight size={16} /></a></div>
    </div>
  );
}

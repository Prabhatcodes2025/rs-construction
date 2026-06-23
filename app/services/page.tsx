import { Building2, DraftingCompass, House, Layers3, Paintbrush, RefreshCw, Workflow } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { getSiteData } from "@/lib/store";

const icons = [House, Building2, DraftingCompass, Paintbrush, RefreshCw, Workflow, Layers3];
const fallback: Array<Record<string, unknown>> = [
  { id: "s1", name: "Residential Construction", description: "Custom homes designed around your family, site and future." },
  { id: "s2", name: "Commercial Construction", description: "Efficient, durable workplaces and commercial environments." },
  { id: "s3", name: "Architectural Planning", description: "Site-responsive planning, elevations and coordinated drawings." },
  { id: "s4", name: "Interior Design", description: "Considered interiors from spatial planning to final styling." },
  { id: "s5", name: "Renovation & Remodelling", description: "Careful structural, functional and finish upgrades that unlock more value from existing spaces." },
  { id: "s6", name: "Project Management", description: "Professional control over schedule, quality, budget and coordinated site teams." },
  { id: "s7", name: "Turnkey Construction Solutions", description: "One accountable partner from first concept and approvals to final handover." },
];

export const metadata = { title: "Construction Services" };

export default async function Services() {
  const data = await getSiteData();
  const services = Array.isArray(data.services) && data.services.length ? data.services as Array<Record<string, unknown>> : fallback;
  return <>
    <PageHero eyebrow="What we do" title="One team. Every detail." copy="Integrated design, construction and interior services give you clearer decisions, fewer handoffs and a better finished result." />
    <section className="section blueprint"><div className="shell service-grid">{services.map((service, index) => {
      const Icon = icons[index % icons.length];
      return <Reveal delay={(index % 2) * .08} className="service-card" key={String(service.id || service.name)}>
        <span>0{index + 1}</span><Icon /><h2>{String(service.name)}</h2>
        <p>{String(service.description || "Professional planning, transparent milestones and quality-controlled delivery.")}</p>
        <ul><li>Dedicated project lead</li><li>Transparent milestones</li><li>Quality-controlled delivery</li></ul>
        <a href="/contact">Discuss this service →</a>
      </Reveal>;
    })}</div></section>
  </>;
}

import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { getSiteData } from "@/lib/store";

const fallback = [
  { id: "m1", name: "M. Shankar", role: "Founder & Managing Director", image: "/images/founder-message.png", bio: "Leads company vision, quality culture and client commitment." },
  { id: "m2", name: "Rakesh R", role: "General Manager — Operations & Business Development", image: "/images/rakesh-profile.png", bio: "Leads operations, project coordination and business development." },
];

export const metadata = { title: "Management Team" };

export default async function Management() {
  const data = await getSiteData();
  const team = Array.isArray(data.team) && data.team.length ? data.team as Array<Record<string, unknown>> : fallback;
  return <>
    <PageHero eyebrow="The people behind the work" title="Leadership with a site-level view." copy="Our leadership and technical teams combine business discipline, construction knowledge and a shared commitment to client trust." />
    <section className="section"><div className="shell">
      <div className="executive-grid">{team.map(member => <article key={String(member.id || member.name)}>
        <div><Image src={String(member.image || "/images/rakesh-profile.png")} alt={String(member.name)} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
        <span>{String(member.role || "RS Construction team")}</span><h2>{String(member.name)}</h2>
        <p>{String(member.bio || "Construction leadership, client coordination and quality-focused delivery.")}</p>
      </article>)}</div>
    </div></section>
  </>;
}

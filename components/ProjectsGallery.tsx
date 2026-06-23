"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, Hammer, MapPin, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Project = {
  id: string; image: string; category: "Ongoing" | "Completed"; title: string; location: string;
  type: string; area: string; status: string; completion?: number; stage?: string;
  highlights?: string; materials?: string; expectedCompletion?: string;
};

const fallback: Project[] = [
  { id: "p1", image: "/images/project-commercial.png", category: "Ongoing", title: "Urban Work Studios", location: "Whitefield, Bengaluru", type: "Commercial", area: "12,600 sq.ft", status: "72% complete", completion: 72, stage: "MEP and interior works", highlights: "Flexible office floors, landscaped frontage and a premium arrival lobby.", materials: "High-performance glazing, branded electricals and commercial-grade finishes.", expectedCompletion: "December 2026" },
  { id: "p2", image: "/images/project-residence.png", category: "Completed", title: "The Courtyard House", location: "JP Nagar, Bengaluru", type: "Residential", area: "4,800 sq.ft", status: "Completed", completion: 100, stage: "Handed over", highlights: "Central courtyard, daylight-led planning and custom woodwork.", materials: "Premium concrete, UPVC systems and durable natural finishes.", expectedCompletion: "Completed" },
];

const filters = ["Ongoing", "Completed"] as const;

export function ProjectsGallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Ongoing");
  const [projects, setProjects] = useState<Project[]>(fallback);

  useEffect(() => {
    fetch("/api/content").then(response => response.json()).then(data => Array.isArray(data.projects) && setProjects(data.projects)).catch(() => {});
  }, []);

  return <>
    <div className="filter-row" aria-label="Project filters">
      {filters.map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item} projects</button>)}
    </div>
    <motion.div layout className="portfolio-grid">
      <AnimatePresence mode="popLayout">
        {projects.filter(project => project.category === filter).map(project => {
          const completion = project.completion ?? (project.category === "Completed" ? 100 : parseInt(project.status) || 0);
          return <motion.article key={project.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .4 }}>
            <div className="portfolio-image">
              <Image src={project.image} alt={project.title} fill sizes="(max-width: 800px) 100vw, 50vw" />
              <span className="portfolio-category">{project.category}</span>
              <a className="project-overlay-link" href={`/contact?project=${encodeURIComponent(project.title)}`}>Project enquiry <ArrowUpRight /></a>
            </div>
            <div className="portfolio-content">
              <span className="portfolio-type">{project.type} · {project.category}</span>
              <h2>{project.title} <ArrowUpRight /></h2>
              <div className="project-facts">
                <span><MapPin />{project.location}</span><span><Maximize2 />{project.area}</span>
                <span><Hammer />{project.stage || project.status}</span><span><CalendarClock />{project.expectedCompletion || "On schedule"}</span>
              </div>
              <p className="project-description"><strong>Highlights:</strong> {project.highlights || "Thoughtful planning, professional supervision and quality-controlled execution."}</p>
              <p className="project-description quality"><BadgeCheck /><span><strong>Quality:</strong> {project.materials || "Branded materials with stage-wise quality checks."}</span></p>
              <div className="project-progress"><div><i style={{ width: `${completion}%` }} /></div><span>{completion}% complete</span></div>
              <div className="project-status-row"><strong>{project.status}</strong><a href={`/contact?project=${encodeURIComponent(project.title)}`}>View details <ArrowRight /></a></div>
            </div>
          </motion.article>;
        })}
      </AnimatePresence>
    </motion.div>
  </>;
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Project = { id:string; image:string; category:"Ongoing"|"Completed"; title:string; location:string; type:string; area:string; status:string };
const fallback: Project[] = [
  {id:"p1",image:"/images/project-commercial.png",category:"Ongoing",title:"Urban Work Studios",location:"Whitefield, Bengaluru",type:"Commercial",area:"12,600 sq.ft",status:"72% complete"},
  {id:"p2",image:"/images/project-residence.png",category:"Completed",title:"The Courtyard House",location:"JP Nagar, Bengaluru",type:"Residential",area:"4,800 sq.ft",status:"Completed"}
];
const filters = ["Ongoing", "Completed"];

export function ProjectsGallery() {
  const [filter, setFilter] = useState("Ongoing");
  const [projects, setProjects] = useState<Project[]>(fallback);
  useEffect(() => { fetch("/api/content").then(r=>r.json()).then(data=>Array.isArray(data.projects)&&setProjects(data.projects)).catch(()=>{}); },[]);
  const visible = projects.filter(project => project.category === filter);

  return (
    <>
      <div className="filter-row" aria-label="Project filters">
        {filters.map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      <motion.div layout className="portfolio-grid">
        <AnimatePresence mode="popLayout">
          {visible.map(project => (
            <motion.article key={project.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .4 }}>
              <div><Image src={project.image} alt={project.title} fill sizes="(max-width: 800px) 100vw, 50vw" /><a className="project-overlay-link" href={`/contact?project=${encodeURIComponent(project.title)}`}>Project enquiry <ArrowUpRight /></a></div>
              <span>{project.type} · {project.category}</span>
              <h2>{project.title} <ArrowUpRight /></h2>
              <p>{project.location} · {project.area}</p><div className="project-status-row"><strong>{project.status}</strong><a href={`/contact?project=${encodeURIComponent(project.title)}`}>View details</a></div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

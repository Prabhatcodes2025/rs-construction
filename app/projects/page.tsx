import { PageHero } from "@/components/PageHero";
import { ProjectsGallery } from "@/components/ProjectsGallery";
export const metadata={title:"Projects"};
export default function Projects(){return <><PageHero eyebrow="Our work" title="Spaces made to endure." copy="Explore our ongoing and completed residential, commercial, architecture and interior projects."/><section className="section projects-page"><div className="shell"><ProjectsGallery /></div></section></>}

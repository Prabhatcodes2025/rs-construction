import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Award, BadgeCheck, Building2, Check, CircleDollarSign, Clock3,
  DraftingCompass, HardHat, HeartHandshake, House, Layers3, MessageCircle, Play,
  ShieldCheck, Sparkles, UsersRound
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Estimator } from "@/components/Estimator";
import { VideoTestimonial } from "@/components/VideoTestimonial";

const strengths = [
  [ShieldCheck, "Quality assured", "Stage-wise quality checks and accountable supervision."],
  [CircleDollarSign, "Transparent process", "Clear specifications, budgets and milestone reporting."],
  [HardHat, "Experienced team", "Skilled professionals aligned from design through delivery."],
  [HeartHandshake, "Customer focused", "Decisions shaped around your priorities and peace of mind."],
  [Sparkles, "Premium materials", "Trusted brands and specifications chosen for lasting value."],
  [Clock3, "On-time delivery", "Disciplined scheduling with proactive progress management."],
  [UsersRound, "Professional management", "A single accountable team coordinating every workstream."],
  [Layers3, "Turnkey solutions", "Architecture, construction and interiors under one roof."],
];
const packages = [
  ["01", "Basic", "1,940", "Reliable essentials for a well-built, efficient home.", ["Standard vitrified flooring", "ISI electricals", "Branded plumbing"]],
  ["02", "Classic", "2,070", "Our balanced specification for modern family homes.", ["Premium vitrified flooring", "Enhanced electrical plan", "Designer elevation"]],
  ["03", "Premium", "2,400", "Elevated finishes, refined detailing and more choice.", ["Large-format flooring", "Premium sanitaryware", "Custom façade design"]],
  ["04", "Royale", "2,640", "Statement homes with luxury-grade specifications.", ["Luxury stone finishes", "Smart home readiness", "Bespoke interior detailing"]],
];
const process = ["Consultation", "Planning", "Design", "Approvals", "Construction", "Quality inspection", "Handover"];
const projects = [
  { image: "/images/project-residence.png", type: "Completed residence", name: "The Courtyard House", place: "JP Nagar, Bengaluru", area: "4,800 sq.ft", progress: 100 },
  { image: "/images/project-commercial.png", type: "Ongoing commercial", name: "Urban Work Studios", place: "Whitefield, Bengaluru", area: "12,600 sq.ft", progress: 72 },
  { image: "/images/hero-villa.png", type: "Live project", name: "Aster Villa", place: "Sarjapur, Bengaluru", area: "3,950 sq.ft", progress: 48 },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-visual">
          <Image src="/images/hero-villa.png" alt="Luxury contemporary villa by RS Construction" fill priority sizes="(max-width: 900px) 100vw, 52vw" className="hero-image" />
          <div className="hero-image-shade" />
          <div className="hero-visual-label"><span>Featured build</span><strong>Contemporary residence</strong><small>Bengaluru, Karnataka</small></div>
        </div>
        <div className="hero-content blueprint">
          <div className="hero-draft-lines" />
          <Reveal className="hero-copy">
            <span className="eyebrow">Premium construction · Bengaluru</span>
            <h1>Building dreams.<br /><em>Delivering excellence.</em></h1>
            <p>Thoughtful design, precise execution and complete transparency—from the first sketch to the final key.</p>
            <div className="hero-actions"><Link className="button primary" href="/contact">Get free estimate <ArrowRight size={18} /></Link><Link className="button dark" href="/contact">Schedule consultation</Link></div>
            <Link className="hero-project-link" href="/projects"><Play size={14} fill="currentColor" /> Explore ongoing and completed projects</Link>
          </Reveal>
          <div className="hero-rail">
            {[[House, "Custom homes"], [Building2, "Commercial spaces"], [ShieldCheck, "Quality construction"], [Clock3, "On-time delivery"]].map(([Icon, item], i) => <div key={item as string}><span><Icon /></span><small>0{i + 1}</small><strong>{item as string}</strong></div>)}
          </div>
        </div>
        <div className="hero-bottom"><div className="shell"><span>Home construction</span><span>Architecture</span><span>Commercial</span><span>Interiors</span><a href="https://wa.me/919901567272"><MessageCircle size={17} /> WhatsApp us</a></div></div>
      </section>

      <section className="trust-strip">
        <div className="shell stats-grid">{[["18+", "Years of experience"], ["100+", "Projects delivered"], ["100%", "Process transparency"], ["98%", "Client satisfaction"]].map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}</div>
      </section>

      <section className="section blueprint">
        <div className="shell">
          <Reveal className="section-heading"><span className="eyebrow">The RS standard</span><h2>Confidence, built into<br />every square foot.</h2><p>Premium construction is not just a finish. It is a disciplined process where every detail is planned, tracked and verified.</p></Reveal>
          <div className="strength-grid">{strengths.map(([Icon, title, copy], i) => <Reveal delay={i * .055} className="strength-card" key={title as string}><span className="icon-box"><Icon /></span><h3>{title as string}</h3><p>{copy as string}</p><span className="card-index">RS / 0{strengths.findIndex(x => x[1] === title) + 1}</span></Reveal>)}</div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="shell">
          <Reveal className="section-heading split"><div><span className="eyebrow light">Construction packages</span><h2>Specifications for<br />every ambition.</h2></div><p>Four clear starting points. Every package can be tailored around your site, lifestyle and architectural goals.</p></Reveal>
          <div className="package-grid">{packages.map(([id, name, price, copy, features], i) => <Reveal delay={i * .07} className={`package-card ${i === 2 ? "featured" : ""}`} key={name as string}><span className="package-id">{id as string}</span>{i === 2 && <span className="popular">Most preferred</span>}<h3>{name as string}</h3><p>{copy as string}</p><div className="price"><small>From</small><strong>₹{price as string}</strong><span>/ sq.ft</span></div><ul>{(features as string[]).map(f => <li key={f}><Check size={15} />{f}</li>)}</ul><div className="package-links"><Link href="/packages">View specification <ArrowRight size={16} /></Link><Link href="/contact">Enquire now</Link></div></Reveal>)}</div>
        </div>
      </section>

      <section className="section estimator-section">
        <div className="shell">
          <Reveal className="section-heading split"><div><span className="eyebrow">Smart cost planner</span><h2>Start with a clearer<br />construction budget.</h2></div><p>Get a quick indicative estimate based on built-up area, floors and your preferred specification level.</p></Reveal>
          <Reveal><Estimator /></Reveal>
        </div>
      </section>

      <section className="section process-section">
        <div className="shell">
          <Reveal className="section-heading centered"><span className="eyebrow">Our process</span><h2>Seven stages. One accountable team.</h2><p>A transparent path that keeps design, budget, quality and timelines moving together.</p></Reveal>
          <div className="process-line">{process.map((item, i) => <Reveal delay={i * .06} className="process-step" key={item}><span>{String(i + 1).padStart(2, "0")}</span><div className="process-dot" /><strong>{item}</strong></Reveal>)}</div>
        </div>
      </section>

      <section className="section founder-section">
        <div className="shell founder-grid">
          <Reveal className="founder-image"><Image src="/images/founder-message.png" alt="M. Shankar, Founder of RS Construction" fill sizes="(max-width: 800px) 100vw, 46vw" /></Reveal>
          <Reveal className="founder-copy"><span className="eyebrow light">A message from our founder</span><div className="quote-mark">“</div><h2>We don’t just build structures. We build trust and relationships.</h2><p>My vision is to deliver quality construction with complete transparency and customer satisfaction. Every project is a promise—and we treat it with the care it deserves.</p><div className="signature"><strong>M. Shankar</strong><span>Founder &amp; Managing Director</span></div><Link className="text-link light-link" href="/about">Read our story <ArrowRight size={17} /></Link></Reveal>
        </div>
      </section>

      <section className="section leadership-section">
        <div className="shell leadership-grid">
          <Reveal><span className="eyebrow">Leadership</span><h2>Experience that keeps<br />every project moving.</h2><p>Our management team brings together field discipline, client partnership and commercial clarity.</p><div className="leadership-points"><span><Award /> Operational excellence</span><span><DraftingCompass /> Smart planning</span><span><BadgeCheck /> Quality focus</span></div><Link className="button dark" href="/management">Meet the team <ArrowRight size={18} /></Link></Reveal>
          <Reveal className="leader-card"><Image src="/images/rakesh-profile.png" alt="Rakesh R, General Manager" fill sizes="(max-width: 800px) 100vw, 42vw" /><div className="leader-overlay"><span>General Manager</span><h3>Rakesh R</h3><p>Operations &amp; Business Development</p></div></Reveal>
        </div>
      </section>

      <section className="section projects-section">
        <div className="shell">
          <Reveal className="section-heading split"><div><span className="eyebrow light">Selected projects</span><h2>Built with intent.<br />Finished with pride.</h2></div><Link className="text-link light-link" href="/projects">View all projects <ArrowRight size={17} /></Link></Reveal>
          <div className="project-grid">{projects.map((project, i) => <Reveal delay={i * .08} className="project-card" key={project.name}><div className="project-image"><Image src={project.image} alt={project.name} fill sizes="(max-width: 800px) 100vw, 33vw" /><span>{project.type}</span></div><div className="project-info"><h3>{project.name}</h3><p>{project.place} · {project.area}</p><div className="progress"><i style={{ width: `${project.progress}%` }} /></div><div className="project-meta"><small>{project.progress}% complete</small><Link href="/contact">Enquire <ArrowRight size={14} /></Link></div></div></Reveal>)}</div>
        </div>
      </section>

      <section className="section tracker-section blueprint">
        <div className="shell tracker-grid">
          <Reveal><span className="eyebrow">Project intelligence</span><h2>Know exactly where your build stands.</h2><p>Milestone updates, visual progress and quality checkpoints bring your project closer—even when you are away from site.</p><ul className="check-list"><li><Check /> Weekly progress reports</li><li><Check /> Stage-wise image updates</li><li><Check /> Material and quality logs</li></ul></Reveal>
          <Reveal className="tracker-card"><div className="tracker-head"><div><small>LIVE PROJECT</small><strong>Aster Villa · Sarjapur</strong></div><span>48%</span></div>{["Foundation", "Structure", "Plastering", "Electrical", "Finishing", "Handover"].map((step, i) => <div className={`tracker-step ${i < 2 ? "done" : i === 2 ? "active" : ""}`} key={step}><span>{i < 2 ? <Check size={15} /> : i + 1}</span><strong>{step}</strong><small>{i < 2 ? "Completed" : i === 2 ? "In progress" : "Upcoming"}</small></div>)}</Reveal>
        </div>
      </section>

      <section className="section testimonials">
        <div className="shell">
          <Reveal className="section-heading centered"><span className="eyebrow">Client stories</span><h2>Trust is our most important handover.</h2></Reveal>
          <div className="testimonial-grid"><Reveal><VideoTestimonial /></Reveal><Reveal className="testimonial-quote"><div className="stars">★★★★★</div><blockquote>“The team was open about every stage—from material selections to weekly progress. That clarity made the entire experience feel manageable and professional.”</blockquote><strong>Homeowner · Bengaluru</strong><p>Residential construction</p></Reveal></div>
        </div>
      </section>

      <section className="cta-section"><div className="shell"><Reveal><span className="eyebrow light">Your project starts here</span><h2>Let’s build something<br />worth remembering.</h2><p>Share your plot details and aspirations. Our team will help you shape the right path forward.</p><div><Link className="button white" href="/contact">Book consultation <ArrowRight size={18} /></Link><a className="button ghost" href="tel:+919901567272">Call +91 99015 67272</a></div></Reveal></div></section>
    </>
  );
}

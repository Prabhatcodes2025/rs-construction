import Image from "next/image";
import { PageHero } from "@/components/PageHero";

const roles = ["Project Managers", "Civil Engineers", "Architects", "Interior Designers", "Site Supervisors"];

export const metadata = { title: "Management Team" };

export default function Management() {
  return (
    <>
      <PageHero
        eyebrow="The people behind the work"
        title="Leadership with a site-level view."
        copy="Our leadership and technical teams combine business discipline, construction knowledge and a shared commitment to client trust."
      />
      <section className="section">
        <div className="shell">
          <div className="executive-grid">
            <article>
              <div><Image src="/images/founder-message.png" alt="M. Shankar" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
              <span>Founder &amp; Managing Director</span>
              <h2>M. Shankar</h2>
              <p>Leads company vision, quality culture and client commitment.</p>
            </article>
            <article>
              <div><Image src="/images/rakesh-profile.png" alt="Rakesh R" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
              <span>General Manager</span>
              <h2>Rakesh R</h2>
              <p>Operations &amp; Business Development</p>
            </article>
          </div>
          <div className="team-placeholder-grid">
            {roles.map((role) => (
              <div key={role}>
                <span>Suggested image</span>
                <h3>{role}</h3>
                <p>Professional team portrait</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

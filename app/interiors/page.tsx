import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InteriorLeadForm } from "@/components/InteriorLeadForm";
import { InteriorsExperience } from "@/components/InteriorsExperience";
import { Reveal } from "@/components/Reveal";
import { interiorData } from "@/data/interiors";
import { captchaFallbackEnabled, captchaProvider } from "@/lib/captcha";
import { recaptchaEnabled } from "@/lib/security";
import { getSiteData } from "@/lib/store";

export const metadata: Metadata = {
  title: "Interior Designers in Bengaluru | Complete Home Interiors | RS Construction",
  description: "RS Construction provides complete home interiors, modular kitchens, wardrobes, living-room designs and turnkey interior execution in Bengaluru. Book a design consultation today.",
  alternates: { canonical: "/interiors" },
  openGraph: {
    title: "Interior Designers in Bengaluru | RS Construction",
    description: "Complete home interiors, modular kitchens and turnkey interior execution in Bengaluru.",
    images: [interiorData.hero.image],
  },
};

export default async function InteriorsPage() {
  const data = await getSiteData();
  const settings = (data.settings || {}) as Record<string, unknown>;
  const social = (settings.social || {}) as Record<string, string>;
  const phone = String(settings.phone || "+91 99015 67272");
  const whatsapp = social.whatsapp || "https://wa.me/919901567272";
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: interiorData.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const serviceSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Complete Home Interior Design and Execution",
        provider: { "@type": "LocalBusiness", name: "RS Construction", telephone: phone },
        areaServed: { "@type": "City", name: "Bengaluru" },
        serviceType: ["Complete home interiors", "Modular kitchen design", "Living room interior design", "Bedroom interior design", "Commercial interiors"],
        url: "https://www.rsconstructionscompany.com/interiors",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rsconstructionscompany.com/" },
          { "@type": "ListItem", position: 2, name: "Interiors", item: "https://www.rsconstructionscompany.com/interiors" },
        ],
      },
    ],
  };
  return (
    <>
      <section className="interiors-hero">
        <div className="interiors-hero-image">
          <Image src={interiorData.hero.image} alt={interiorData.hero.alt} fill priority sizes="(max-width: 980px) 100vw, 56vw" />
          <div className="interiors-hero-overlay" />
        </div>
        <div className="interiors-hero-content blueprint">
          <Reveal>
            <span className="eyebrow">{interiorData.hero.eyebrow}</span>
            <h1>{interiorData.hero.title}</h1>
            <p>{interiorData.hero.description}</p>
            <div className="hero-actions">
              <a className="button primary" href="#interior-consultation">Book a Free Design Consultation <ArrowRight /></a>
              <Link className="button dark" href="#interior-portfolio">Explore Interior Designs</Link>
            </div>
          </Reveal>
        </div>
        <Reveal className="interiors-hero-form">
          <InteriorLeadForm captchaFallback={captchaFallbackEnabled()} captchaProvider={captchaProvider() === "text" ? "text" : "google"} recaptcha={recaptchaEnabled()} />
        </Reveal>
      </section>
      <InteriorsExperience phone={phone} whatsapp={whatsapp} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

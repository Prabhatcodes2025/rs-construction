import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { LeadForm } from "@/components/LeadForm";
import { getSiteData } from "@/lib/store";
import { recaptchaEnabled } from "@/lib/security";

export const metadata = { title: "Contact", description: "Contact RS Construction for home and commercial construction in Bengaluru." };

export default async function Contact() {
  const data = await getSiteData();
  const settings = (data.settings || {}) as Record<string, unknown>;
  const social = (settings.social || {}) as Record<string, string>;
  const phone = String(settings.phone || "+91 99015 67272");
  const secondaryPhone = String(settings.secondaryPhone || "+91 97401 77666");
  const email = String(settings.email || "rsconstruction2027@gmail.com");
  const address = String(settings.address || "14, 1st Main Rd, opp. Indian Oil Petrol Bunk, Rahmath Nagar, RT Nagar, Bengaluru, Karnataka 560032");
  const map = String(settings.map || "https://share.google/YoghYTG0lBF0TiA2O");
  const whatsapp = social.whatsapp || "https://wa.me/919901567272";

  return <>
    <PageHero eyebrow="Start a conversation" title="Tell us what you want to build." copy="Share a few project details. Our Bengaluru team will contact you to understand the site, scope and right next step." />
    <section className="section contact-section"><div className="shell contact-grid">
      <div className="contact-details"><span className="eyebrow">RS Construction</span><h2>Local expertise. Professional delivery.</h2><p>Residential, commercial, architecture and turnkey construction across Bengaluru and surrounding areas.</p>
        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}><Phone /><span><small>Call us</small>{phone}<br />{secondaryPhone}</span></a>
        <a href={`mailto:${email}`}><Mail /><span><small>Email</small>{email}</span></a>
        <a href={whatsapp}><MessageCircle /><span><small>WhatsApp</small>Chat with our team</span></a>
        <a className="address-card" href={map}><MapPin /><span><small>Visit our office</small>{address}</span></a>
        <a className="map-placeholder" href={map}><MapPin /><strong>Open location in Google Maps</strong><span>RS Construction · Bengaluru</span></a>
      </div>
      <LeadForm recaptcha={recaptchaEnabled()} />
    </div></section>
  </>;
}

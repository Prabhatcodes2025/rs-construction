import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import "./premium.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { SiteExperience } from "@/components/SiteExperience";
import { EnquiryPopup } from "@/components/EnquiryPopup";
import { getSiteData } from "@/lib/store";
import { recaptchaEnabled } from "@/lib/security";
import { GlobalPreloader, PreloaderFallback } from "@/components/GlobalPreloader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://rsconstruction.in"),
  title: { default: "RS Construction | Premium Home Builders in Bengaluru", template: "%s | RS Construction" },
  description: "Premium residential and commercial construction, architecture, interiors and turnkey project delivery in Bengaluru.",
  openGraph: { title: "RS Construction", description: "Building Excellence. Delivering Trust.", type: "website", images: ["/images/hero-villa.png"] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.png", shortcut: "/icon.png", apple: "/icon.png" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const data = await getSiteData();
  const settings = (data.settings || {}) as Record<string, unknown>;
  const social = (settings.social || {}) as Record<string, string>;
  const phone = String(settings.phone || "+91 99015 67272");
  const whatsapp = social.whatsapp || "https://wa.me/919901567272";
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "GeneralContractor"],
    name: "RS Construction",
    description: "Premium residential and commercial construction company in Bengaluru.",
    areaServed: "Bengaluru, Karnataka",
    telephone: ["+919901567272", "+919740177666"],
    email: "rsconstruction2027@gmail.com",
    address: { "@type": "PostalAddress", streetAddress: "14, 1st Main Rd, opp. Indian Oil Petrol Bunk, Rahmath Nagar, RT Nagar", addressLocality: "Bengaluru", addressRegion: "Karnataka", postalCode: "560032", addressCountry: "IN" },
    hasMap: "https://share.google/YoghYTG0lBF0TiA2O",
  };
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<PreloaderFallback />}><GlobalPreloader /></Suspense>
        <SiteExperience />
        <EnquiryPopup recaptcha={recaptchaEnabled()} address={String(settings.address || "14, 1st Main Rd, RT Nagar, Bengaluru 560032")} />
        <Header whatsapp={whatsapp} />
        <main>{children}</main>
        <Footer />
        <FloatingActions phone={phone} whatsapp={whatsapp} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </body>
    </html>
  );
}

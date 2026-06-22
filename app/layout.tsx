import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { SiteExperience } from "@/components/SiteExperience";
import { EnquiryPopup } from "@/components/EnquiryPopup";

export const metadata: Metadata = {
  metadataBase: new URL("https://rsconstruction.in"),
  title: { default: "RS Construction | Premium Home Builders in Bengaluru", template: "%s | RS Construction" },
  description: "Premium residential and commercial construction, architecture, interiors and turnkey project delivery in Bengaluru.",
  openGraph: { title: "RS Construction", description: "Building Excellence. Delivering Trust.", type: "website", images: ["/images/hero-villa.png"] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
        <SiteExperience />
        <EnquiryPopup />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </body>
    </html>
  );
}

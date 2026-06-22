import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  metadataBase: new URL("https://rsconstruction.in"),
  title: { default: "RS Construction | Premium Home Builders in Bengaluru", template: "%s | RS Construction" },
  description: "Premium residential and commercial construction, architecture, interiors and turnkey project delivery in Bengaluru.",
  openGraph: { title: "RS Construction", description: "Building Excellence. Delivering Trust.", type: "website", images: ["/images/hero-villa.png"] },
  twitter: { card: "summary_large_image" },
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
    address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
  };
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </body>
    </html>
  );
}

import { MessageCircle, Phone } from "lucide-react";
export function FloatingActions({ phone = "+91 99015 67272", whatsapp = "https://wa.me/919901567272" }: { phone?: string; whatsapp?: string }) {
  return <div className="floating-actions"><a href={`tel:${phone.replace(/[^\d+]/g, "")}`} aria-label="Call RS Construction"><Phone /></a><a className="wa" href={whatsapp} aria-label="WhatsApp RS Construction"><MessageCircle /></a></div>;
}

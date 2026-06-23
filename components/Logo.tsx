import Link from "next/link";
import Image from "next/image";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`logo ${light ? "logo-light" : ""}`} aria-label="RS Construction home">
      <span className="logo-mark"><Image src="/images/rs-logo.png" alt="" width={180} height={100} priority /></span>
      <span className="logo-copy"><strong>RS CONSTRUCTION</strong><small>HOME &amp; COMMERCIAL CONSTRUCTION</small></span>
    </Link>
  );
}

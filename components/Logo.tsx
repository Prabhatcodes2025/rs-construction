import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`logo ${light ? "logo-light" : ""}`} aria-label="RS Construction home">
      <span className="logo-mark"><b>R</b><b>S</b></span>
      <span className="logo-copy"><strong>RS CONSTRUCTION</strong><small>HOME &amp; COMMERCIAL CONSTRUCTION</small></span>
    </Link>
  );
}

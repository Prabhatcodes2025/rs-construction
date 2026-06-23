import { PackageExplorer } from "@/components/PackageExplorer";

export const metadata = { title: "Construction Packages" };

export default function Packages() {
  return (
    <section className="section packages-page">
      <div className="shell"><PackageExplorer /></div>
    </section>
  );
}

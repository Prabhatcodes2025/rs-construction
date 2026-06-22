import { PackageExplorer } from "@/components/PackageExplorer";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Construction Packages" };

export default function Packages() {
  return (
    <>
      <PageHero eyebrow="Clear specifications" title="Choose your starting point." copy="Every package is a transparent base specification that can be refined around your architecture, priorities and budget." />
      <section className="section packages-page">
        <div className="shell"><PackageExplorer /></div>
      </section>
    </>
  );
}

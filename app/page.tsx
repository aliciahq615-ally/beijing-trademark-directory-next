import { CompanyDirectory } from "@/components/CompanyDirectory";
import { FeaturedGrid } from "@/components/FeaturedGrid";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SectorGrid } from "@/components/SectorGrid";
import { SourcePreview } from "@/components/SourcePreview";
import { StatsBand } from "@/components/StatsBand";
import { getCatalogData } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getCatalogData();

  return (
    <>
      <Header />
      <main id="top">
        <Hero stats={data.stats} logos={data.logos} />
        <StatsBand stats={data.stats} />
        <FeaturedGrid companies={data.featured} />
        <SectorGrid sectors={data.stats.topClasses} />
        <CompanyDirectory companies={data.companies} />
        <SourcePreview />
      </main>
      <Footer />
    </>
  );
}

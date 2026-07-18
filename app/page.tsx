import { GalaxyDirectory } from "@/components/GalaxyDirectory";
import { getCatalogData } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getCatalogData();

  return <GalaxyDirectory companies={data.companies} stats={data.stats} />;
}

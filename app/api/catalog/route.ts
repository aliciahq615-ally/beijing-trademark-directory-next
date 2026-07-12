import { getCatalogData } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getCatalogData();
  return Response.json(data);
}

import { assertAdminToken, getAdminCatalog, saveAdminCatalog } from "@/lib/catalog";
import type { CatalogData } from "@/types/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authError = assertAdminToken(request);
  if (authError) return authError;

  try {
    const document = await getAdminCatalog();
    return Response.json(document);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "数据库加载失败。" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authError = assertAdminToken(request);
  if (authError) return authError;

  try {
    const payload = (await request.json()) as { data?: CatalogData } | CatalogData | null;
    if (!payload || typeof payload !== "object") {
      return Response.json({ error: "数据格式不正确。" }, { status: 400 });
    }
    const data = "data" in payload && payload.data ? payload.data : (payload as CatalogData);
    if (!Array.isArray(data.companies)) {
      return Response.json({ error: "数据格式不正确，缺少 companies 数组。" }, { status: 400 });
    }
    const document = await saveAdminCatalog(data);
    return Response.json({ ok: true, row: document });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "保存失败。" }, { status: 400 });
  }
}

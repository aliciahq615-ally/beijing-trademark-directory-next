import fallbackCatalog from "@/data/catalog-data.json";
import type { CatalogData, CatalogDocument } from "@/types/catalog";

const TABLE = process.env.SUPABASE_CATALOG_TABLE || "catalog_documents";
const packagedCatalog = fallbackCatalog as CatalogData;

function withPackagedGuangdong(data: CatalogData): CatalogData {
  if (data.companies.some((company) => company.region === "广东")) return data;
  const guangdongCompanies = packagedCatalog.companies.filter((company) => company.region === "广东");
  if (!guangdongCompanies.length) return data;

  const companies = [...data.companies, ...guangdongCompanies];
  const entries = companies.flatMap((company) => company.entries);
  const regionCounts: Record<string, number> = {};
  const bookCounts = { A: 0, B: 0, C: 0 };
  const classCounts = new Map<string, number>();

  companies.forEach((company) => {
    const region = company.region || "北京";
    regionCounts[region] = (regionCounts[region] || 0) + 1;
    bookCounts[company.book] += company.entries.length;
    company.entries.forEach((entry) => {
      const classes = entry.class.match(/\d{1,2}/g) || [];
      classes.forEach((classNumber) => {
        if (Number(classNumber) >= 1 && Number(classNumber) <= 45) {
          classCounts.set(classNumber, (classCounts.get(classNumber) || 0) + 1);
        }
      });
    });
  });

  const classNames = { ...packagedCatalog.classNames, ...data.classNames };
  return {
    ...data,
    classNames,
    companies,
    stats: {
      records: entries.length,
      companies: companies.length,
      classes: classCounts.size,
      books: bookCounts,
      regions: regionCounts,
      topClasses: [...classCounts.entries()]
        .sort((left, right) => right[1] - left[1])
        .slice(0, 8)
        .map(([classNumber, count]) => ({
          class: classNumber,
          name: classNames[classNumber] || `第${classNumber}类`,
          count,
        })),
    },
  };
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;
  return {
    url: url.replace(/\/$/, ""),
    serviceKey,
  };
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const config = supabaseConfig();
  if (!config) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  const extraHeaders = init.headers ? Object.fromEntries(new Headers(init.headers).entries()) : {};

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...extraHeaders,
    },
    cache: "no-store",
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(typeof body === "string" ? body : JSON.stringify(body || response.statusText));
  }
  return body;
}

export function getFallbackCatalog(): CatalogData {
  return packagedCatalog;
}

export async function getCatalogData(): Promise<CatalogData> {
  try {
    const rows = (await supabaseRequest(`${TABLE}?id=eq.main&select=data&limit=1`)) as Array<{ data: CatalogData }>;
    return rows[0]?.data ? withPackagedGuangdong(rows[0].data) : getFallbackCatalog();
  } catch {
    return getFallbackCatalog();
  }
}

export async function getAdminCatalog(): Promise<CatalogDocument | null> {
  const rows = (await supabaseRequest(`${TABLE}?id=eq.main&select=id,data,updated_at&limit=1`)) as CatalogDocument[];
  return rows[0] ? { ...rows[0], data: withPackagedGuangdong(rows[0].data) } : null;
}

export async function saveAdminCatalog(data: CatalogData): Promise<CatalogDocument | null> {
  const rows = (await supabaseRequest(TABLE, {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      id: "main",
      data,
      updated_at: new Date().toISOString(),
    }),
  })) as CatalogDocument[];
  return rows[0] || null;
}

export function assertAdminToken(request: Request): Response | null {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return Response.json({ error: "Missing ADMIN_TOKEN." }, { status: 500 });

  const auth = request.headers.get("authorization") || "";
  const supplied = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (supplied !== token) return Response.json({ error: "未授权，请检查后台访问口令。" }, { status: 401 });
  return null;
}

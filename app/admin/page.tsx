import AdminClient from "@/components/admin/AdminClient";
import { getFallbackCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminClient fallbackData={getFallbackCatalog()} />;
}

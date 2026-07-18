import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogData } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type PageProps = { params: { id: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getCatalogData();
  const company = data.companies[Number(params.id)];
  return company ? { title: `${company.name} | 重点商标保护名录`, description: company.positioning } : {};
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const data = await getCatalogData();
  const index = Number(params.id);
  const company = Number.isInteger(index) ? data.companies[index] : undefined;
  if (!company) notFound();
  const region = company.region || "北京";

  return (
    <main className="company-detail-page">
      <div className="detail-space" aria-hidden="true" />
      <header className="detail-nav">
        <Link href="/">← 返回品牌星系</Link>
        <span>TRADEMARK GALAXY / {region}</span>
      </header>
      <article className="detail-panel">
        <div className="detail-heading">
          <div>
            <p className="detail-kicker">{region}星系 · {company.bookName}</p>
            <h1>{company.name}</h1>
            <p className="detail-positioning">{company.positioning}</p>
          </div>
          <div className="detail-planet" aria-hidden="true"><span /></div>
        </div>
        <div className="detail-stats">
          <div><strong>{company.records}</strong><span>商标记录</span></div>
          <div><strong>{company.marksCount}</strong><span>代表商标</span></div>
          <div><strong>{company.classes.length}</strong><span>涉及类别</span></div>
        </div>
        <section className="detail-section">
          <p className="detail-kicker">REPRESENTATIVE MARKS</p>
          <h2>代表商标</h2>
          <div className="detail-marks">{company.representativeMarks.map((mark) => <span key={mark}>{mark}</span>)}</div>
        </section>
        <section className="detail-section">
          <p className="detail-kicker">REGISTRATION DIRECTORY</p>
          <h2>商标注册与代表商品</h2>
          <div className="detail-records">
            {company.entries.map((entry, entryIndex) => (
              <div key={`${entry.registration}-${entryIndex}`}>
                <span className="record-number">{String(entryIndex + 1).padStart(2, "0")}</span>
                <h3>{entry.mark}</h3>
                <p>注册号 {entry.registration}</p>
                <p>第 {entry.class} 类 · {entry.className}</p>
                {entry.goods ? <small>{entry.goods}</small> : null}
              </div>
            ))}
          </div>
        </section>
        <Link className="detail-back" href="/">返回星系继续探索</Link>
      </article>
    </main>
  );
}

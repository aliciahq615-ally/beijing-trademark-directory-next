"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogStats, Company } from "@/types/catalog";

type Region = "北京" | "上海";
type IndexedCompany = Company & { catalogIndex: number };

const REGIONS: Region[] = ["北京", "上海"];

function searchableText(company: Company) {
  return [
    company.name,
    company.region || "北京",
    company.book,
    company.bookName,
    company.bookDescription || "",
    company.positioning,
    company.classNames.join(" "),
    company.classes.join(" "),
    company.marks.join(" "),
    company.registrations.join(" "),
    company.entries
      .map((entry) => `${entry.mark} ${entry.registration} ${entry.class} ${entry.className} ${entry.goods || ""} ${entry.region || ""}`)
      .join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function planetPosition(index: number, total: number, region: Region) {
  const goldenAngle = 137.508;
  const progress = Math.sqrt((index + 1.8) / (total + 2));
  const angle = (index * goldenAngle + progress * 150 + (region === "上海" ? 29 : 0)) * (Math.PI / 180);
  const x = 50 + Math.cos(angle) * 45 * progress;
  const y = 50 + Math.sin(angle) * 39 * progress;
  const size = 5 + ((index * 17 + (region === "上海" ? 7 : 0)) % 8);
  return { x, y, size };
}

export function GalaxyDirectory({ companies, stats }: { companies: Company[]; stats: CatalogStats }) {
  const [query, setQuery] = useState("");
  const indexedCompanies = useMemo<IndexedCompany[]>(
    () => companies.map((company, catalogIndex) => ({ ...company, catalogIndex })),
    [companies],
  );
  const normalizedQuery = query.trim().toLowerCase();
  const matches = useMemo(
    () => (normalizedQuery ? indexedCompanies.filter((company) => searchableText(company).includes(normalizedQuery)) : []),
    [indexedCompanies, normalizedQuery],
  );
  const matchIds = useMemo(() => new Set(matches.map((company) => company.catalogIndex)), [matches]);

  return (
    <main className="galaxy-home">
      <div className="space-noise" aria-hidden="true" />
      <header className="galaxy-header">
        <Link className="galaxy-brand" href="/" aria-label="返回星系首页">
          <span className="brand-orbit" aria-hidden="true"><i /></span>
          <span><b>重点商标保护名录</b><small>TRADEMARK GALAXY</small></span>
        </Link>
        <div className="galaxy-search-shell">
          <span className="search-icon" aria-hidden="true" />
          <input
            aria-label="搜索企业、商标、注册号或商品服务"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索企业、商标、注册号或代表商品…"
            type="search"
            value={query}
          />
          {normalizedQuery ? <span className="match-count">{matches.length} 个结果</span> : null}
          {normalizedQuery ? (
            <div className="galaxy-search-results">
              {matches.length ? matches.slice(0, 8).map((company) => (
                <Link href={`/company/${company.catalogIndex}`} key={company.catalogIndex}>
                  <span><i>{company.region || "北京"}</i>{company.name}</span>
                  <small>{company.representativeMarks.slice(0, 2).join(" · ") || company.positioning}</small>
                </Link>
              )) : <p>未找到匹配的企业或商标</p>}
              {matches.length > 8 ? <p className="more-results">还有 {matches.length - 8} 个结果已在星系中点亮</p> : null}
            </div>
          ) : null}
        </div>
        <Link className="galaxy-admin" href="/admin">数据管理</Link>
      </header>

      <section className="galaxy-intro">
        <p>CHINA · PROTECTED TRADEMARK ATLAS</p>
        <h1>品牌星系</h1>
        <span>探索北京与上海的重点商标企业</span>
      </section>

      <div className="galaxies-stage">
        {REGIONS.map((region) => {
          const regionCompanies = indexedCompanies.filter((company) => (company.region || "北京") === region);
          return (
            <section className={`galaxy-cluster galaxy-${region === "北京" ? "beijing" : "shanghai"}`} key={region}>
              <div className="nebula" aria-hidden="true" />
              <div className="orbit orbit-one" aria-hidden="true" />
              <div className="orbit orbit-two" aria-hidden="true" />
              <div className="galaxy-core" aria-hidden="true"><span /></div>
              <div className="galaxy-title">
                <small>{region === "北京" ? "CAPITAL CONSTELLATION" : "COASTAL CONSTELLATION"}</small>
                <h2>{region}星系</h2>
                <p>{regionCompanies.length} 家重点企业</p>
              </div>
              {regionCompanies.map((company, index) => {
                const position = planetPosition(index, regionCompanies.length, region);
                const isMatch = matchIds.has(company.catalogIndex);
                return (
                  <Link
                    aria-label={`${company.name}，查看企业详情`}
                    className={`company-planet ${normalizedQuery ? (isMatch ? "search-match" : "search-dim") : ""}`}
                    href={`/company/${company.catalogIndex}`}
                    key={company.catalogIndex}
                    style={{
                      "--planet-x": `${position.x}%`,
                      "--planet-y": `${position.y}%`,
                      "--planet-size": `${position.size}px`,
                      "--planet-delay": `${-(index % 19) * 0.7}s`,
                      "--planet-hue": `${region === "北京" ? 210 + (index % 35) : 266 + (index % 32)}`,
                    } as React.CSSProperties}
                  >
                    <span className="planet-sphere" />
                    <span className="planet-label"><b>{company.name}</b><small>{company.representativeMarks[0] || company.positioning}</small></span>
                  </Link>
                );
              })}
            </section>
          );
        })}
      </div>

      <footer className="galaxy-footer">
        <span><i className="legend-dot" /> 悬停点亮 · 点击探索</span>
        <span>{stats.companies} 家企业 · {stats.records} 条商标记录</span>
      </footer>
    </main>
  );
}

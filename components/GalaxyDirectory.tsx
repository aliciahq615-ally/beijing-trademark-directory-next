"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GalaxyParticleField } from "@/components/GalaxyParticleField";
import type { CatalogStats, Company } from "@/types/catalog";

type Region = "北京" | "上海" | "广东";
type IndexedCompany = Company & { catalogIndex: number };

const REGION_META: Record<Region, { code: string; constellation: string; hue: number }> = {
  北京: { code: "beijing", constellation: "CAPITAL CONSTELLATION", hue: 210 },
  上海: { code: "shanghai", constellation: "COASTAL CONSTELLATION", hue: 330 },
  广东: { code: "guangdong", constellation: "GREATER BAY CONSTELLATION", hue: 28 },
};

const REGIONS: Region[] = ["北京", "上海", "广东"];

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

function planetOrbit(index: number, total: number, region: Region) {
  const progress = Math.sqrt((index + 1.8) / (total + 2));
  const duration = 96 + (index % 13) * 4.6 + progress * 38;
  const phaseShift = region === "北京" ? 0 : region === "上海" ? 29 : 61;
  const phase = ((index * 137.508 + progress * 150 + phaseShift) % 360) / 360;
  const radius = 2.1 + progress * 13.2;
  return {
    duration,
    delay: -(phase * duration),
    radius,
    reverse: index % 7 === 0,
    size: 3.8 + (index % 3 === 0 ? 0.55 : 0),
  };
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
      <GalaxyParticleField />
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
        <span>探索北京、上海与广东的重点商标企业</span>
      </section>

      <div className="galaxies-stage">
        {REGIONS.map((region, regionIndex) => {
          const regionCompanies = indexedCompanies.filter((company) => (company.region || "北京") === region);
          const meta = REGION_META[region];
          return (
            <div
              className={`galaxy-cluster-orbit system-phase-${regionIndex}`}
              key={region}
            >
              <section className={`galaxy-cluster galaxy-${meta.code}`}>
                <div className="nebula" aria-hidden="true" />
                <div className="orbit orbit-one" aria-hidden="true" />
                <div className="orbit orbit-two" aria-hidden="true" />
                <div className="galaxy-core" aria-hidden="true"><span /></div>
                <div className="galaxy-title">
                  <small>{meta.constellation}</small>
                  <h2>{region}星系</h2>
                  <p>{regionCompanies.length} 家重点企业</p>
                </div>
                {regionCompanies.map((company, index) => {
                  const orbit = planetOrbit(index, regionCompanies.length, region);
                  const isMatch = matchIds.has(company.catalogIndex);
                  return (
                    <span
                      className={`planet-orbit-track ${orbit.reverse ? "orbit-reverse" : ""}`}
                      key={company.catalogIndex}
                      style={{
                        "--orbit-radius": `${orbit.radius}vw`,
                        "--orbit-duration": `${orbit.duration}s`,
                        "--orbit-delay": `${orbit.delay}s`,
                        "--planet-size": `${orbit.size}px`,
                        "--planet-delay": `${-(index % 19) * 0.7}s`,
                        "--planet-enter": `${0.75 + index * 0.002}s`,
                        "--planet-hue": `${meta.hue + (index % 29) - 10}`,
                      } as React.CSSProperties}
                    >
                      <Link
                        aria-label={`${company.name}，查看企业详情`}
                        className={`company-planet ${normalizedQuery ? (isMatch ? "search-match" : "search-dim") : ""}`}
                        href={`/company/${company.catalogIndex}`}
                      >
                        <span className="planet-visual">
                          <span className="planet-sphere" />
                          <span className="planet-label"><b>{company.name}</b><small>{company.representativeMarks[0] || company.positioning}</small></span>
                        </span>
                      </Link>
                    </span>
                  );
                })}
              </section>
            </div>
          );
        })}
      </div>

      <details className="catalog-downloads">
        <summary aria-label="下载三地原始PDF名录">
          <span className="download-icon" aria-hidden="true" />
          原始PDF名录
        </summary>
        <div>
          <a download="北京市重点商标保护名录.pdf" href="/site-assets/beijing-trademark-directory-2025.pdf"><span>北京名录</span><small>PDF</small></a>
          <a download="上海市重点商标保护名录.pdf" href="/site-assets/shanghai-trademark-directory-2025.pdf"><span>上海名录</span><small>PDF</small></a>
          <a download="2025年度广东省重点商标保护名录.pdf" href="/site-assets/guangdong-trademark-directory-2025.pdf"><span>广东名录</span><small>PDF</small></a>
        </div>
      </details>

      <footer className="galaxy-footer">
        <span><i className="legend-dot" /> 悬停点亮 · 点击探索</span>
        <span>{stats.companies} 家企业 · {stats.records} 条商标记录</span>
      </footer>
    </main>
  );
}

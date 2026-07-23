"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

function galaxySlot(index: number, activeIndex: number) {
  const offset = (index - activeIndex + REGIONS.length) % REGIONS.length;
  if (offset === 0) return "center";
  return offset === 1 ? "right" : "left";
}

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
  const progress = Math.pow((index + 2.4) / (total + 3), 0.46);
  const phaseShift = region === "北京" ? 0 : region === "上海" ? 29 : 61;
  const phase = ((index * 137.508 + progress * 150 + phaseShift) % 360) / 360;
  const wave = Math.sin((index + phaseShift) * 1.73) * 0.72 + Math.sin(index * 0.47 + phaseShift) * 0.38;
  const radius = 3.4 + progress * 20.8 + wave;
  const flatten = 0.55 + ((index * 17 + phaseShift) % 19) / 100;
  const wobble = 0.035 + ((index * 11 + phaseShift) % 7) / 100;
  const driftX = 0.12 + ((index * 13 + phaseShift) % 11) / 27;
  const driftY = 0.08 + ((index * 7 + phaseShift) % 9) / 32;
  const tilt = -24 + ((index * 23 + phaseShift) % 49);
  const duration = 116 + (index % 17) * 5.1 + progress * 46;
  return {
    duration,
    delay: -(phase * duration),
    radius,
    flatten,
    inverseFlatten: 1 / flatten,
    wobble,
    driftX,
    driftY,
    tilt,
    size: 3.8 + (index % 3 === 0 ? 0.55 : 0),
  };
}

export function GalaxyDirectory({ companies, stats }: { companies: Company[]; stats: CatalogStats }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
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
  const previousIndex = (activeIndex - 1 + REGIONS.length) % REGIONS.length;
  const nextIndex = (activeIndex + 1) % REGIONS.length;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current - 1 + REGIONS.length) % REGIONS.length);
      if (event.key === "ArrowRight") setActiveIndex((current) => (current + 1) % REGIONS.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="galaxy-home" data-active-galaxy={REGION_META[REGIONS[activeIndex]].code}>
      <div className="space-noise" aria-hidden="true" />
      <div className="cinema-grain" aria-hidden="true" />
      <GalaxyParticleField activeGalaxy={activeIndex} />
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
        <span>探索北京、上海与广东的重点商标企业 · 使用左右方向键切换</span>
      </section>

      <nav className="galaxy-pagination" aria-label="切换地区星系">
        <button
          className="galaxy-page-button galaxy-page-previous"
          onClick={() => setActiveIndex(previousIndex)}
          type="button"
        >
          <i aria-hidden="true" />
          <span><small>PREVIOUS</small><b>{REGIONS[previousIndex]}星系</b></span>
        </button>
        <button
          className="galaxy-page-button galaxy-page-next"
          onClick={() => setActiveIndex(nextIndex)}
          type="button"
        >
          <span><small>NEXT</small><b>{REGIONS[nextIndex]}星系</b></span>
          <i aria-hidden="true" />
        </button>
      </nav>

      <div className="galaxies-stage">
        {REGIONS.map((region, regionIndex) => {
          const regionCompanies = indexedCompanies.filter((company) => (company.region || "北京") === region);
          const meta = REGION_META[region];
          const slot = galaxySlot(regionIndex, activeIndex);
          return (
            <div
              className={`galaxy-cluster-frame galaxy-slot-${slot} ${slot === "center" ? "galaxy-is-active" : ""}`}
              key={region}
              aria-hidden={slot !== "center"}
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
                      className="planet-orbit-track"
                      key={company.catalogIndex}
                      style={{
                        "--orbit-radius": `${orbit.radius}vw`,
                        "--orbit-duration": `${orbit.duration}s`,
                        "--orbit-delay": `${orbit.delay}s`,
                        "--orbit-flatness": orbit.flatten,
                        "--orbit-inverse": orbit.inverseFlatten,
                        "--orbit-wobble": orbit.wobble,
                        "--orbit-tilt": `${orbit.tilt}deg`,
                        "--orbit-angle-64": `${orbit.tilt + 64}deg`,
                        "--orbit-angle-154": `${orbit.tilt + 154}deg`,
                        "--orbit-angle-244": `${orbit.tilt + 244}deg`,
                        "--orbit-angle-306": `${orbit.tilt + 306}deg`,
                        "--orbit-angle-360": `${orbit.tilt + 360}deg`,
                        "--orbit-counter-0": `${-orbit.tilt}deg`,
                        "--orbit-counter-64": `${-(orbit.tilt + 64)}deg`,
                        "--orbit-counter-154": `${-(orbit.tilt + 154)}deg`,
                        "--orbit-counter-244": `${-(orbit.tilt + 244)}deg`,
                        "--orbit-counter-306": `${-(orbit.tilt + 306)}deg`,
                        "--orbit-counter-360": `${-(orbit.tilt + 360)}deg`,
                        "--orbit-flatness-plus": orbit.flatten + orbit.wobble,
                        "--orbit-flatness-minus": orbit.flatten - orbit.wobble * 0.45,
                        "--orbit-flatness-late-plus": orbit.flatten + orbit.wobble * 0.3,
                        "--orbit-flatness-late-minus": orbit.flatten - orbit.wobble * 0.22,
                        "--orbit-drift-x": `${orbit.driftX}vw`,
                        "--orbit-drift-x-negative": `${-orbit.driftX}vw`,
                        "--orbit-drift-y": `${orbit.driftY}vh`,
                        "--orbit-drift-y-negative": `${-orbit.driftY}vh`,
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
                        tabIndex={slot === "center" ? 0 : -1}
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

      <div className="galaxy-position-indicator" aria-label={`当前显示${REGIONS[activeIndex]}星系`}>
        {REGIONS.map((region, index) => (
          <button
            aria-label={`显示${region}星系`}
            className={index === activeIndex ? "is-current" : ""}
            key={region}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <i />
            <span>{region}</span>
          </button>
        ))}
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

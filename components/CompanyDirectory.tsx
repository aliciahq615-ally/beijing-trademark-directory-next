"use client";

import { useMemo, useState } from "react";
import type { Book, Company } from "@/types/catalog";

const bookTone: Record<Book, string> = {
  A: "book-A",
  B: "book-B",
  C: "book-C",
};

type FilterBook = Book | "all";
type FilterRegion = string | "all";
const PAGE_SIZE = 24;

export function CompanyDirectory({ companies }: { companies: Company[] }) {
  const [book, setBook] = useState<FilterBook>("all");
  const [region, setRegion] = useState<FilterRegion>("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const updateBook = (value: FilterBook) => {
    setBook(value);
    setVisibleCount(PAGE_SIZE);
  };

  const updateRegion = (value: FilterRegion) => {
    setRegion(value);
    setVisibleCount(PAGE_SIZE);
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  const regions = useMemo(() => {
    return Array.from(new Set(companies.map((company) => company.region || "北京"))).sort();
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return companies.filter((company) => {
      const companyRegion = company.region || "北京";
      if (book !== "all" && company.book !== book) return false;
      if (region !== "all" && companyRegion !== region) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        company.name,
        companyRegion,
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

      return haystack.includes(normalizedQuery);
    });
  }, [book, companies, query, region]);

  return (
    <section className="directory-section" id="directory">
      <div className="directory-head">
        <div>
          <p className="eyebrow">Directory</p>
          <h2>企业定位与代表产品名录</h2>
        </div>
        <div className="search-wrap">
          <input
            type="search"
            placeholder="搜索地区、企业、商标、注册号或商品服务"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="filter-group" aria-label="地区筛选">
        <span>地区</span>
        <div className="filter-row">
          <button className={`filter ${region === "all" ? "active" : ""}`} onClick={() => updateRegion("all")} type="button">
            全部
          </button>
          {regions.map((item) => (
            <button className={`filter ${region === item ? "active" : ""}`} key={item} onClick={() => updateRegion(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group" aria-label="簿册筛选">
        <span>簿册</span>
        <div className="filter-row">
          {[
            ["all", "全部"],
            ["A", "A 簿"],
            ["B", "B 簿"],
            ["C", "C 簿"],
          ].map(([value, label]) => (
            <button
              className={`filter ${book === value ? "active" : ""}`}
              data-book={value}
              key={value}
              onClick={() => updateBook(value as FilterBook)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="result-meta">
        当前显示 {Math.min(visibleCount, filteredCompanies.length)} 个，筛选结果 {filteredCompanies.length} 个，共 {companies.length} 个主体。
      </div>

      <div className="company-grid">
        {filteredCompanies.length ? (
          filteredCompanies
            .slice(0, visibleCount)
            .map((company) => <CompanyCard company={company} key={`${company.region || "北京"}-${company.name}`} />)
        ) : (
          <article className="company-card">
            <h3>未找到匹配结果</h3>
            <p className="positioning">请更换地区、簿册或关键词后再试。</p>
          </article>
        )}
      </div>
      {visibleCount < filteredCompanies.length ? (
        <div className="load-more-wrap">
          <button className="button load-more" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} type="button">
            加载更多
            <span>（剩余 {filteredCompanies.length - visibleCount} 个）</span>
          </button>
        </div>
      ) : null}
    </section>
  );
}

function CompanyCard({ company }: { company: Company }) {
  const remaining = company.entries.length - company.representativeEntries.length;
  const region = company.region || "北京";
  const meta = [`${region}`, `${company.records} 条记录`, `${company.marksCount} 个代表商标`, company.classNames.slice(0, 2).join(" / ")].filter(Boolean);

  return (
    <article className="company-card">
      <div className="badge-row">
        <span className={`book-badge ${bookTone[company.book]}`}>{company.bookName}</span>
        <span className="region-badge">{region}</span>
      </div>
      <h3>{company.name}</h3>
      <p className="positioning">{company.positioning}</p>
      <div className="mark-list">
        {company.representativeMarks.map((mark) => (
          <span className="mark" key={mark}>
            {mark}
          </span>
        ))}
      </div>
      <ul className="registration-list">
        {company.representativeEntries.map((entry) => (
          <li key={`${entry.mark}-${entry.registration}`}>
            <span className="reg-mark">{entry.mark}</span>
            <span className="reg-number">注册号：{entry.registration}</span>
            <span className="reg-class">
              第{entry.class}类 · {entry.className}
            </span>
            {entry.goods ? <span className="reg-goods">{entry.goods}</span> : null}
          </li>
        ))}
      </ul>
      {remaining > 0 ? <p className="registration-more">另有 {remaining} 条商标注册号可通过搜索定位。</p> : null}
      <div className="company-meta">
        {meta.map((item) => (
          <span className="pill" key={item}>
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

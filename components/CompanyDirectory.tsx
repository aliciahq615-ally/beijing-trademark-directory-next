"use client";

import { useMemo, useState } from "react";
import type { Book, Company } from "@/types/catalog";

const bookTone: Record<Book, string> = {
  A: "book-A",
  B: "book-B",
  C: "book-C",
};

type FilterBook = Book | "all";

export function CompanyDirectory({ companies }: { companies: Company[] }) {
  const [book, setBook] = useState<FilterBook>("all");
  const [query, setQuery] = useState("");

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return companies.filter((company) => {
      if (book !== "all" && company.book !== book) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        company.name,
        company.book,
        company.bookName,
        company.positioning,
        company.classNames.join(" "),
        company.classes.join(" "),
        company.marks.join(" "),
        company.registrations.join(" "),
        company.entries.map((entry) => `${entry.mark} ${entry.registration} ${entry.class} ${entry.className}`).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [book, companies, query]);

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
            placeholder="搜索企业、商标、注册号或类别"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="filter-row" aria-label="名录筛选">
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
            onClick={() => setBook(value as FilterBook)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="result-meta">
        当前展示 {filteredCompanies.length} 个企业主体，共 {companies.length} 个主体。
      </div>

      <div className="company-grid">
        {filteredCompanies.length ? (
          filteredCompanies.slice(0, 60).map((company) => <CompanyCard company={company} key={`${company.book}-${company.name}`} />)
        ) : (
          <article className="company-card">
            <h3>未找到匹配结果</h3>
            <p className="positioning">请更换关键词或筛选条件。</p>
          </article>
        )}
      </div>
    </section>
  );
}

function CompanyCard({ company }: { company: Company }) {
  const remaining = company.entries.length - company.representativeEntries.length;
  const meta = [`${company.records} 条记录`, `${company.marksCount} 个代表商标`, company.classNames.slice(0, 2).join(" / ")].filter(Boolean);

  return (
    <article className="company-card">
      <span className={`book-badge ${bookTone[company.book]}`}>{company.bookName}</span>
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
            <span className="reg-number">注册号 {entry.registration}</span>
            <span className="reg-class">
              第 {entry.class} 类 · {entry.className}
            </span>
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

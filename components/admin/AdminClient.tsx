"use client";

import { useMemo, useState } from "react";
import type { Book, CatalogData, Company, LogoItem, TrademarkEntry } from "@/types/catalog";

const bookNames: Record<Book, string> = {
  A: "北京本地主体",
  B: "外埠中国主体",
  C: "外国主体",
};

type AdminClientProps = {
  fallbackData: CatalogData;
};

export default function AdminClient({ fallbackData }: AdminClientProps) {
  const [data, setData] = useState<CatalogData>(fallbackData);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("等待连接。");
  const [isError, setIsError] = useState(false);

  const filteredCompanies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data.companies.map((company, index) => ({ company, index }));

    return data.companies
      .map((company, index) => ({ company, index }))
      .filter(({ company }) => {
        return [
          company.name,
          company.region || "",
          company.positioning,
          company.marks.join(" "),
          company.registrations.join(" "),
          company.entries.map((entry) => `${entry.mark} ${entry.registration} ${entry.goods || ""}`).join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      });
  }, [data.companies, query]);

  const selectedCompany = selectedIndex === null ? null : data.companies[selectedIndex] || null;

  function updateStatus(message: string, error = false) {
    setStatus(message);
    setIsError(error);
  }

  function headers() {
    return {
      Authorization: `Bearer ${token.trim()}`,
      "Content-Type": "application/json",
    };
  }

  function replaceCompany(index: number, updater: (company: Company) => Company) {
    setData((current) => {
      const companies = current.companies.map((company, companyIndex) => (companyIndex === index ? updater(company) : company));
      return normalizeCatalog({ ...current, companies });
    });
  }

  async function loadDatabase() {
    if (!token.trim()) return updateStatus("请先输入后台口令。", true);
    const response = await fetch("/api/admin/catalog", { headers: headers() });
    const body = await response.json();
    if (!response.ok) return updateStatus(body.error || "数据库加载失败。", true);
    if (!body?.data) return updateStatus("数据库还没有初始化，请先用静态数据初始化。", true);
    setData(body.data);
    setSelectedIndex(null);
    updateStatus(`数据库加载成功，更新时间：${body.updated_at || "未知"}`);
  }

  async function saveDatabase(nextData = data) {
    if (!token.trim()) return updateStatus("请先输入后台口令。", true);
    const response = await fetch("/api/admin/catalog", {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ data: normalizeCatalog(nextData) }),
    });
    const body = await response.json();
    if (!response.ok) return updateStatus(body.error || "保存失败。", true);
    updateStatus("已保存到数据库。前台刷新后会读取最新数据。");
  }

  async function seedDatabase() {
    const nextData = normalizeCatalog(fallbackData);
    setData(nextData);
    setSelectedIndex(null);
    await saveDatabase(nextData);
  }

  function updateSelected<K extends keyof Company>(key: K, value: Company[K]) {
    if (selectedIndex === null) return;
    replaceCompany(selectedIndex, (company) => ({ ...company, [key]: value }));
  }

  return (
    <>
      <header className="admin-header">
        <div>
          <p>Database Admin</p>
          <h1>商标名录后台</h1>
        </div>
        <a href="/">返回网站</a>
      </header>

      <main className="admin-layout">
        <section className="panel auth-panel">
          <h2>连接后台</h2>
          <label>
            后台口令
            <input value={token} onChange={(event) => setToken(event.target.value)} type="password" placeholder="输入 ADMIN_TOKEN" />
          </label>
          <div className="button-row">
            <button className="primary" onClick={loadDatabase} type="button">
              加载数据库
            </button>
            <button onClick={seedDatabase} type="button">
              用当前静态数据初始化数据库
            </button>
          </div>
          <p className="status" style={{ color: isError ? "#b72d37" : undefined }}>
            {status}
          </p>
        </section>

        <section className="panel list-panel">
          <div className="panel-head">
            <h2>企业主体</h2>
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="搜索企业、商标或注册号" />
          </div>
          <div className="company-list">
            {filteredCompanies.slice(0, 120).map(({ company, index }) => (
              <button
                className={`company-item ${selectedIndex === index ? "active" : ""}`}
                key={`${company.region || "北京"}-${company.book}-${company.name}`}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <strong>{company.name}</strong>
                <span>
                  {company.region || "北京"} · {company.bookName} · {company.records} 条记录
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel editor-panel">
          <div className="panel-head">
            <h2>编辑内容</h2>
            <button className="primary" onClick={() => saveDatabase()} type="button">
              保存到数据库
            </button>
          </div>

          {!selectedCompany ? <div className="empty-state">请选择左侧企业主体。</div> : null}

          {selectedCompany && selectedIndex !== null ? (
            <form className="editor-form">
              <label>
                企业名称
                <input value={selectedCompany.name} onChange={(event) => updateSelected("name", event.target.value)} type="text" />
              </label>
              <label>
                地区
                <input value={selectedCompany.region || "北京"} onChange={(event) => updateSelected("region", event.target.value)} type="text" />
              </label>
              <label>
                簿册
                <select value={selectedCompany.book} onChange={(event) => updateSelected("book", event.target.value as Book)}>
                  <option value="A">A 簿 · 北京本地主体</option>
                  <option value="B">B 簿 · 外埠中国主体</option>
                  <option value="C">C 簿 · 外国主体</option>
                </select>
              </label>
              <label>
                企业定位
                <textarea value={selectedCompany.positioning} onChange={(event) => updateSelected("positioning", event.target.value)} rows={5} />
              </label>
              <label>
                商标注册记录
                <textarea
                  value={entriesToText(selectedCompany.entries)}
                  onChange={(event) => updateSelected("entries", textToEntries(event.target.value))}
                  rows={10}
                  spellCheck={false}
                />
                <small>每行一条：商标名 | 注册号 | 类别号 | 类别名称 | 商品服务 | 图样路径</small>
              </label>
              <label>
                首页滚动 Logo
                <textarea
                  value={logosToText(data.logos)}
                  onChange={(event) => setData((current) => normalizeCatalog({ ...current, logos: textToLogos(event.target.value) }))}
                  rows={8}
                  spellCheck={false}
                />
                <small>每行一个：显示名称 | 域名或图片路径，例如 上海企业 | /site-assets/shanghai-logos/shanghai-logo-001.png</small>
              </label>
            </form>
          ) : null}
        </section>
      </main>
    </>
  );
}

function normalizeCatalog(data: CatalogData): CatalogData {
  const classCounts: Record<string, { class: string; name: string; count: number }> = {};
  const companies = data.companies.map((company) => {
    const entries = company.entries || [];
    const marks = [...new Set(entries.map((entry) => entry.mark).filter(Boolean))];
    const registrations = entries.map((entry) => entry.registration).filter(Boolean);
    const classes = [...new Set(entries.map((entry) => entry.class).filter(Boolean))];
    entries.forEach((entry) => {
      if (!entry.class) return;
      classCounts[entry.class] = classCounts[entry.class] || { class: entry.class, name: entry.className || "商标类别", count: 0 };
      classCounts[entry.class].count += 1;
    });

    return {
      ...company,
      region: company.region || "北京",
      regionCode: company.regionCode || (company.region === "上海" ? "shanghai" : "beijing"),
      bookName: company.region === "上海" ? "上海重点名录" : bookNames[company.book],
      records: entries.length,
      marks,
      registrations,
      marksCount: marks.length,
      representativeMarks: marks.slice(0, 4),
      representativeEntries: entries.slice(0, 5),
      classes,
      classNames: classes.map((classId) => {
        const found = entries.find((entry) => entry.class === classId);
        return `第 ${classId} 类 · ${found?.className || "商标类别"}`;
      }),
    };
  });

  return {
    ...data,
    companies,
    featured: data.featured.map((featuredCompany) => companies.find((company) => company.name === featuredCompany.name) || featuredCompany),
    stats: {
      ...data.stats,
      records: companies.reduce((sum, company) => sum + company.entries.length, 0),
      companies: companies.length,
      classes: Object.keys(classCounts).length,
      books: companies.reduce(
        (books, company) => {
          books[company.book] += company.entries.length;
          return books;
        },
        { A: 0, B: 0, C: 0 },
      ),
      regions: companies.reduce<Record<string, number>>((regions, company) => {
        const region = company.region || "北京";
        regions[region] = (regions[region] || 0) + 1;
        return regions;
      }, {}),
      topClasses: Object.values(classCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
    },
  };
}

function entriesToText(entries: TrademarkEntry[]) {
  return entries
    .map((entry) => `${entry.mark || ""} | ${entry.registration || ""} | ${entry.class || ""} | ${entry.className || ""} | ${entry.goods || ""} | ${entry.logoSrc || ""}`)
    .join("\n");
}

function textToEntries(text: string): TrademarkEntry[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [mark = "", registration = "", classId = "", className = "", goods = "", logoSrc = ""] = line.split("|").map((item) => item.trim());
      return { mark, registration, class: classId, className, goods, logoSrc };
    });
}

function logosToText(logos: LogoItem[]) {
  return logos.map((logo) => `${logo.name} | ${logo.src || logo.domain || ""}`).join("\n");
}

function textToLogos(text: string): LogoItem[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", value = ""] = line.split("|").map((item) => item.trim());
      return value.startsWith("/") ? { name, src: value } : { name, domain: value };
    });
}

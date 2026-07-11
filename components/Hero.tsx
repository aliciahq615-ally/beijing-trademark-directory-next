import type { CatalogStats, LogoItem } from "@/types/catalog";

type HeroProps = {
  stats: CatalogStats;
  logos: LogoItem[];
};

export function Hero({ stats, logos }: HeroProps) {
  const logoRows = [...logos, ...logos];

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="logo-wall">
          <div className="logo-track">
            {logoRows.map((logo, index) => (
              <LogoChip key={`${logo.domain}-${index}`} logo={logo} />
            ))}
          </div>
          <div className="logo-track reverse">
            {[...logoRows].reverse().map((logo, index) => (
              <LogoChip key={`reverse-${logo.domain}-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
      <div className="hero-content">
        <p className="eyebrow">2025 年度拟纳入名单</p>
        <h1>北京重点商标保护名录</h1>
        <p className="hero-copy">汇集北京本地、外埠中国与国际重点商标，呈现企业定位、代表产品与品牌资产结构。</p>
        <div className="hero-actions">
          <a className="button primary" href="#directory">
            查看名录
          </a>
          <a className="button ghost" href="/site-assets/beijing-trademark-directory-2025.pdf" target="_blank" rel="noreferrer">
            打开 PDF
          </a>
        </div>
      </div>
      <aside className="hero-panel" aria-label="名录概览">
        <div>
          <span className="metric">{stats.records}</span>
          <span className="metric-label">商标记录</span>
        </div>
        <div>
          <span className="metric">{stats.companies}</span>
          <span className="metric-label">名录主体</span>
        </div>
        <div>
          <span className="metric">{stats.classes}</span>
          <span className="metric-label">覆盖类别</span>
        </div>
      </aside>
    </section>
  );
}

function LogoChip({ logo }: { logo: LogoItem }) {
  return (
    <span className="logo-chip">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://logo.clearbit.com/${encodeURIComponent(logo.domain)}`} alt={`${logo.name} logo`} loading="lazy" />
      <b>{logo.name}</b>
    </span>
  );
}

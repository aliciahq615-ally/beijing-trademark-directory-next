import type { CatalogStats, LogoItem } from "@/types/catalog";

type HeroProps = {
  stats: CatalogStats;
  logos: LogoItem[];
};

export function Hero({ stats, logos }: HeroProps) {
  // Keep the animated wall visually rich without asking mobile browsers to
  // create hundreds of repeated image nodes.
  const featuredLogos = logos.slice(0, 24);
  const logoRows = featuredLogos.length ? [...featuredLogos, ...featuredLogos] : [];

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="logo-wall">
          <div className="logo-track">
            {logoRows.map((logo, index) => (
              <LogoChip key={`${logo.src || logo.domain || logo.name}-${index}`} logo={logo} />
            ))}
          </div>
          <div className="logo-track reverse">
            {[...logoRows].reverse().map((logo, index) => (
              <LogoChip key={`reverse-${logo.src || logo.domain || logo.name}-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
      <div className="hero-content">
        <p className="eyebrow">National Trademark Directory</p>
        <h1>全国重点商标保护名录</h1>
        <p className="hero-copy">汇集北京、上海等地区重点商标保护名录，集中展示入选企业主体、代表商标、注册号与核心商品服务。</p>
        <div className="hero-actions">
          <a className="button primary" href="#directory">
            查看企业名录
          </a>
          <a className="button ghost" href="#source">
            查看原始 PDF
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
  const src = logo.src || (logo.domain ? `https://logo.clearbit.com/${encodeURIComponent(logo.domain)}` : "");

  return (
    <span className="logo-chip">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`${logo.name} 商标图样`} loading="lazy" />
      ) : null}
      <b>{logo.name}</b>
    </span>
  );
}

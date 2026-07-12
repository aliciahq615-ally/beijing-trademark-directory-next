import type { CatalogStats } from "@/types/catalog";

type StatsBandProps = {
  stats: CatalogStats;
};

export function StatsBand({ stats }: StatsBandProps) {
  const regions = stats.regions || {};

  return (
    <section className="stats-band" aria-label="地区分布">
      <div className="stat-item">
        <span>北京主体</span>
        <strong>{regions["北京"] || 0}</strong>
        <small>北京重点商标保护名录</small>
      </div>
      <div className="stat-item">
        <span>上海主体</span>
        <strong>{regions["上海"] || 0}</strong>
        <small>第十八批上海市重点商标保护名录</small>
      </div>
      <div className="stat-item">
        <span>覆盖地区</span>
        <strong>{Object.keys(regions).length || 1}</strong>
        <small>支持按地区、企业、商标和注册号检索</small>
      </div>
    </section>
  );
}

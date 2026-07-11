import type { CatalogStats } from "@/types/catalog";

type StatsBandProps = {
  stats: CatalogStats;
};

export function StatsBand({ stats }: StatsBandProps) {
  return (
    <section className="stats-band" aria-label="三簿分布">
      <div className="stat-item">
        <span>A 簿</span>
        <strong>{stats.books.A}</strong>
        <small>北京行政区划内主体</small>
      </div>
      <div className="stat-item">
        <span>B 簿</span>
        <strong>{stats.books.B}</strong>
        <small>外埠中国主体</small>
      </div>
      <div className="stat-item">
        <span>C 簿</span>
        <strong>{stats.books.C}</strong>
        <small>外国民事主体</small>
      </div>
    </section>
  );
}

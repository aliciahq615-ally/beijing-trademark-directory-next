import type { SectorClass } from "@/types/catalog";

export function SectorGrid({ sectors }: { sectors: SectorClass[] }) {
  return (
    <section className="section sectors">
      <div className="section-heading">
        <p className="eyebrow">Industry Coverage</p>
        <h2>高频类别与能力版图</h2>
      </div>
      <div className="sector-grid">
        {sectors.map((item) => (
          <article className="sector-card" key={item.class}>
            <strong>{item.count}</strong>
            <span>
              第{item.class}类 · {item.name}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

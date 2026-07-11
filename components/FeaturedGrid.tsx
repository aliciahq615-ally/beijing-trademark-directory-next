import type { Company } from "@/types/catalog";

const bookTone = {
  A: "book-A",
  B: "book-B",
  C: "book-C",
};

export function FeaturedGrid({ companies }: { companies: Company[] }) {
  return (
    <section className="section" id="portfolio">
      <div className="section-heading">
        <p className="eyebrow">Brand Portfolio</p>
        <h2>代表品牌组合</h2>
      </div>
      <div className="featured-grid">
        {companies.map((company) => (
          <article className="feature-card" key={`${company.book}-${company.name}`}>
            <div>
              <span className={`book-badge ${bookTone[company.book]}`}>{company.book} 簿</span>
              <h3>{company.name}</h3>
              <p className="positioning">{company.positioning}</p>
            </div>
            <div className="mark-list">
              {company.representativeMarks.map((mark) => (
                <span className="mark" key={mark}>
                  {mark}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

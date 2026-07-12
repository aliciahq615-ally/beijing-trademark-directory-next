const pages = Array.from({ length: 9 }, (_, index) => String(index + 1).padStart(2, "0"));

export function SourcePreview() {
  return (
    <section className="source-section" id="source">
      <div className="source-copy">
        <p className="eyebrow">Original Source</p>
        <h2>原始名录页面预览</h2>
        <p>网站数据来源于当前素材中的北京重点商标名录，以及新增的第十八批上海市重点商标保护名录。PDF 原件保留用于核对。</p>
        <div className="source-actions">
          <a className="button primary" href="/site-assets/beijing-trademark-directory-2025.pdf" target="_blank" rel="noreferrer">
            查看北京 PDF
          </a>
          <a className="button ghost" href="/site-assets/shanghai-trademark-directory-2025.pdf" target="_blank" rel="noreferrer">
            查看上海 PDF
          </a>
        </div>
      </div>
      <div className="page-strip" aria-label="PDF 页面预览">
        {pages.map((page, index) => {
          const src = `/site-assets/pages/catalog-${page}.png`;
          return (
            <a href={src} target="_blank" rel="noreferrer" aria-label={`查看北京名录第 ${index + 1} 页`} key={page}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`北京重点商标名录第 ${index + 1} 页`} loading="lazy" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

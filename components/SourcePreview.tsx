const pages = Array.from({ length: 9 }, (_, index) => String(index + 1).padStart(2, "0"));

export function SourcePreview() {
  return (
    <section className="source-section" id="source">
      <div className="source-copy">
        <p className="eyebrow">Original Source</p>
        <h2>原始名录页面预览</h2>
        <p>网站数据来源于当前文件夹中的《北京重点商标名录.pdf》，并保留 PDF 页面影像用于核对。</p>
        <a className="button primary" href="/site-assets/beijing-trademark-directory-2025.pdf" target="_blank" rel="noreferrer">
          查看完整 PDF
        </a>
      </div>
      <div className="page-strip" aria-label="PDF 页面预览">
        {pages.map((page, index) => {
          const src = `/site-assets/pages/catalog-${page}.png`;
          return (
            <a href={src} target="_blank" rel="noreferrer" aria-label={`查看第 ${index + 1} 页`} key={page}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`北京重点商标名录第 ${index + 1} 页`} loading="lazy" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

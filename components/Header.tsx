export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="返回首页">
        <span className="brand-mark">京</span>
        <span>重点商标名录</span>
      </a>
      <nav className="nav-links" aria-label="主导航">
        <a href="#portfolio">品牌组合</a>
        <a href="#directory">企业名录</a>
        <a href="#source">原始名录</a>
        <a href="/admin">后台</a>
      </nav>
    </header>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "品牌星系 | 全国重点商标保护名录",
  description: "汇集北京、上海、广东重点商标保护名录，展示企业主体、代表商标、注册号与核心商品服务。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="galaxy-document">
      <body>{children}</body>
    </html>
  );
}

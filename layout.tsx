import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "全国重点商标保护名录 | 品牌资产展示",
  description: "汇集北京、上海等地区重点商标保护名录，展示企业主体、代表商标、注册号与核心商品服务。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

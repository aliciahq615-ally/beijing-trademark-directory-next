import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "北京重点商标保护名录 | 品牌资产展示",
  description: "展示北京重点商标保护名录中的企业定位、代表产品与品牌资产结构。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

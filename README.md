# 北京重点商标保护名录网站

这是一个 Next.js App Router + TypeScript 项目，用于展示北京重点商标保护名录，并提供基于 Supabase 的后台编辑能力。

## 本地运行

1. 安装依赖：

```bash
npm install
```

2. 创建本地环境变量：

```bash
copy .env.example .env.local
```

3. 填写 `.env.local`：

```bash
SUPABASE_URL=你的 Supabase Project URL
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase service_role key
SUPABASE_CATALOG_TABLE=catalog_documents
ADMIN_TOKEN=你的后台口令
```

4. 启动开发服务：

```bash
npm run dev
```

访问 `http://localhost:3000`。

## Netlify 部署

Netlify 会自动识别 Next.js。当前 `netlify.toml` 配置为：

```toml
[build]
  command = "npm run build"
  publish = ".next"
```

部署时上传或连接本项目根目录：

```text
C:\Users\晴晴\Desktop\北京商标名录-素材\deploy-from-zip\商标名录-素材
```

不要上传 `node_modules`、`.next` 或 `.env.local`。

## 环境变量

在 Netlify 项目环境变量中配置：

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_CATALOG_TABLE`
- `ADMIN_TOKEN`

`SUPABASE_SERVICE_ROLE_KEY` 只在服务端 API 路由中使用，不会暴露给前端。

## 后台访问

部署后访问：

```text
https://你的 Netlify 域名/admin
```

输入 `ADMIN_TOKEN` 后可以：

- 加载 Supabase 数据库中的名录数据
- 用当前静态数据初始化数据库
- 编辑企业定位
- 编辑商标名、注册号、类别
- 编辑首页滚动 Logo
- 保存到 Supabase

前台首页会优先读取 Supabase 数据；如果环境变量缺失或数据库未初始化，会回退到 `data/catalog-data.json`。

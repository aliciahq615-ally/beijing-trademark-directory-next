# 全国重点商标保护名录网站

这是一个 Next.js App Router + TypeScript 项目，用于展示全国重点商标保护名录。目前已包含北京名录和上海名录，支持按地区、企业、商标、注册号和商品服务检索，并提供 Supabase 后台编辑能力。

## 本地运行

```bash
npm install
copy .env.example .env.local
npm run dev
```

访问：

```text
http://localhost:3000
```

`.env.local` 需要填写：

```bash
SUPABASE_URL=你的 Supabase Project URL
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase service_role key
SUPABASE_CATALOG_TABLE=catalog_documents
ADMIN_TOKEN=你的后台口令
```

## Netlify 部署

当前项目根目录是：

```text
C:\Users\晴晴\Desktop\北京商标名录-素材\deploy-from-zip\商标名录-素材
```

Netlify 构建设置：

```toml
[build]
  command = "npm run build"
  publish = ".next"
```

部署步骤：

1. 把当前项目根目录中的文件上传到 GitHub 仓库，确保能看到 `app`、`components`、`data`、`public`、`package.json`、`netlify.toml`。
2. 不要上传 `node_modules`、`.next`、`.env.local`。
3. 在 Netlify 项目 `gleaming-unicorn-c92f6f` 中进入 `Deploys`，点击 `Trigger deploy` 或推送 GitHub 后等待自动部署。
4. 如果是手动上传 ZIP，请压缩“项目根目录里面的所有文件”，不要只压缩外层空文件夹。

## 环境变量

Netlify 项目中需要配置：

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_CATALOG_TABLE`
- `ADMIN_TOKEN`

`SUPABASE_SERVICE_ROLE_KEY` 只在服务端 API 中使用，不会暴露到前端页面。

## 后台访问

部署后访问：

```text
https://你的 Netlify 域名/admin
```

输入 `ADMIN_TOKEN` 后可以加载数据库、初始化数据库、编辑企业定位和商标记录并保存。

重要：前台优先读取 Supabase 数据。如果数据库里还是旧数据，部署新版代码后需要进入 `/admin`，点击“用当前静态数据初始化数据库”，这样北京 + 上海的新名录才会写入 Supabase 并显示到线上前台。

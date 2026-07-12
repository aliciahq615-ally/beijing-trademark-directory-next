create table if not exists public.catalog_documents (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.catalog_documents enable row level security;

drop policy if exists "catalog_documents_no_public_access" on public.catalog_documents;
create policy "catalog_documents_no_public_access"
  on public.catalog_documents
  for all
  using (false)
  with check (false);

comment on table public.catalog_documents is '商标名录网站数据库后台数据。由 Netlify Functions 使用 Supabase service role key 读写。';

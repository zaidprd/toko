create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  data jsonb not null,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);
create table if not exists public.blog_posts (
  id text primary key,
  slug text unique not null,
  data jsonb not null,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
create table if not exists public.orders (
  id text primary key,
  email text not null,
  whatsapp text not null,
  customer jsonb not null,
  items jsonb not null,
  subtotal integer not null check (subtotal >= 0),
  shipping_cost integer not null check (shipping_cost >= 0),
  total integer not null check (total > 0),
  status text not null default 'PENDING' check (status in ('PENDING','PAID','EXPIRED','FAILED','REFUNDED')),
  mayar_invoice_id text unique,
  mayar_transaction_id text unique,
  payment_url text,
  paid_at timestamptz,
  shipment jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.ebook_files (
  product_id text primary key references public.products(id) on delete cascade,
  object_key text not null,
  file_name text not null,
  size_bytes bigint not null,
  mayar_delivery_url text,
  updated_at timestamptz not null default now()
);
create table if not exists public.webhook_events (
  provider text not null,
  event_id text not null,
  payload_hash text not null,
  received_at timestamptz not null default now(),
  primary key (provider, event_id)
);
alter table public.products enable row level security;
alter table public.blog_posts enable row level security;
alter table public.orders enable row level security;
alter table public.ebook_files enable row level security;
alter table public.webhook_events enable row level security;

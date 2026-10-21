-- Amma's Kitchen starter schema. Enable RLS and review policies before production.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  plan_name text not null,
  diet text not null check (diet in ('Veg', 'Non-Veg')),
  monthly_price integer not null check (monthly_price > 0),
  start_date date not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.bulk_enquiries (
  id uuid primary key default gen_random_uuid(),
  occasion text not null,
  guest_count integer not null check (guest_count > 0),
  event_date date not null,
  food_preference text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_menus (
  id uuid primary key default gen_random_uuid(),
  menu_date date not null unique,
  veg_items text[] not null default '{}',
  non_veg_items text[] not null default '{}',
  special_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.plan_prices (
  id uuid primary key default gen_random_uuid(),
  plan_name text not null unique,
  veg_monthly integer not null check (veg_monthly > 0),
  non_veg_monthly integer not null check (non_veg_monthly > 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_pauses (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  pause_date date not null,
  created_at timestamptz not null default now(),
  unique (subscription_id, pause_date)
);

-- RLS is enabled by default for customer data. Add authenticated customer/admin policies
-- tailored to your verified auth and role model before connecting a live client.
alter table public.subscriptions enable row level security;
alter table public.bulk_enquiries enable row level security;
alter table public.daily_menus enable row level security;
alter table public.plan_prices enable row level security;
alter table public.delivery_pauses enable row level security;

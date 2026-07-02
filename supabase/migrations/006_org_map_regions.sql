create table if not exists public.org_map_regions (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.orgs(id) on delete cascade,
  created_by   uuid not null references auth.users(id),
  name         text not null,
  lat_min      float8 not null,
  lat_max      float8 not null,
  lon_min      float8 not null,
  lon_max      float8 not null,
  zoom         int not null,
  source       text,
  location_label text,
  created_at   timestamptz not null default now()
);

alter table public.org_map_regions enable row level security;

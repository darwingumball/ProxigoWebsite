-- Add geographic metadata to usage_events so we can see what areas are being downloaded
alter table public.usage_events
  add column if not exists location_label text,
  add column if not exists lat_min        float8,
  add column if not exists lat_max        float8,
  add column if not exists lon_min        float8,
  add column if not exists lon_max        float8;

-- Index for geographic queries and admin analytics
create index if not exists idx_usage_events_location
  on public.usage_events (location_label)
  where location_label is not null;

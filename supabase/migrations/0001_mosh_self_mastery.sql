-- =============================================================================
-- MOSH Self-Mastery & Wealth Alignment System — Supabase schema
-- =============================================================================
--
-- Read this first: there are two supported ways to run MOSH on Supabase, and
-- they are different things.
--
--   1. Supabase as the database (no changes needed, and the default).
--      Supabase is PostgreSQL. Point DATABASE_URL at the project's pooled
--      connection string and run `npx prisma migrate deploy`. You get every
--      table the shipped app uses, and sessions stay with Auth.js. Nothing in
--      this file is required for that path.
--
--   2. Supabase as the whole backend — Supabase Auth, RLS and PostgREST.
--      That is what this file builds: the same domain model, keyed to
--      `auth.users`, with row-level security so a row is only ever visible to
--      the person who wrote it. Use it when you want to reach the data from
--      supabase-js (a mobile client, an edge function) as well as from the
--      Next.js app.
--
-- Apply with the Supabase CLI:  supabase db push
-- or paste into the SQL editor of a project.
--
-- Every table is scoped by `user_id`, every table has RLS enabled, and every
-- policy checks `auth.uid() = user_id`. There is no shared data in this system
-- and no policy grants cross-user reads.
-- =============================================================================

create schema if not exists public;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type mosh_plane as enum ('MENTAL', 'SPIRITUAL', 'PHYSICAL');
exception when duplicate_object then null; end $$;

do $$ begin
  create type mosh_life_area as enum ('MENTAL', 'SPIRITUAL', 'PHYSICAL', 'BUSINESS', 'IMPACT');
exception when duplicate_object then null; end $$;

do $$ begin
  create type mosh_offer_tier as enum ('ATTRACTION', 'CORE', 'PREMIUM');
exception when duplicate_object then null; end $$;

do $$ begin
  create type mosh_eclipse_phase as enum (
    'FOUNDATION_IN_FLOW',
    'CORE_OFFER_BIRTH',
    'VISIBILITY_EXPANSION',
    'MONEY_MODEL_ARCHITECTURE',
    'MAGNETIC_AUTHORITY'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type mosh_pattern as enum (
    'LIMITING_BELIEF',
    'TRUST_ISSUE',
    'FEAR_OF_LOSS',
    'PERFECTIONISM',
    'INFERIORITY',
    'PROCRASTINATION',
    'LOW_DRIVE'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type mosh_letter_kind as enum ('FUTURE_WISDOM', 'LEGACY_LESSON', 'ADVICE_TO_YOUNGER_SELF');
exception when duplicate_object then null; end $$;

do $$ begin
  create type mosh_coach_source as enum ('AI', 'RULES');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.mosh_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profile
-- ---------------------------------------------------------------------------

create table if not exists public.mosh_profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null unique references auth.users (id) on delete cascade,
  display_name  text,
  title         text not null default 'Life Coach and Mindset Architect',
  philosophy    text not null default 'Structure Creates Freedom.',
  mission       text,
  currency      char(3) not null default 'GHS',
  timezone      text not null default 'Africa/Accra',
  plan_year     integer,
  eclipse_start date,
  onboarded_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Daily tracker
-- ---------------------------------------------------------------------------

create table if not exists public.mosh_daily_entries (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  entry_date       date not null,
  morning_rhythm   boolean not null default false,
  exercise         boolean not null default false,
  creative_work    boolean not null default false,
  journaling       boolean not null default false,
  meditation       boolean not null default false,
  content_creation boolean not null default false,
  trust_delegation boolean not null default false,
  gratitude        text,
  wins             text,
  reflection       text,
  energy           smallint check (energy between 1 and 10),
  mood             smallint check (mood between 1 and 10),
  completion       smallint not null default 0 check (completion between 0 and 100),
  alignment        smallint not null default 0 check (alignment between 0 and 100),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- One row per person per day. This is what makes "today's entry" an upsert.
  unique (user_id, entry_date)
);

create index if not exists mosh_daily_entries_user_date_idx
  on public.mosh_daily_entries (user_id, entry_date desc);

create table if not exists public.mosh_plane_checkins (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  plane      mosh_plane not null,
  attribute  text not null,
  score      smallint not null check (score between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date, attribute)
);

create index if not exists mosh_plane_checkins_user_plane_idx
  on public.mosh_plane_checkins (user_id, plane, entry_date desc);

-- ---------------------------------------------------------------------------
-- Weekly tracker
-- ---------------------------------------------------------------------------

create table if not exists public.mosh_weekly_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  week_start date not null, -- Monday of the ISO week
  intention  text,
  review     text,
  momentum   smallint not null default 0 check (momentum between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table if not exists public.mosh_weekly_goals (
  id         uuid primary key default gen_random_uuid(),
  weekly_id  uuid not null references public.mosh_weekly_entries (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  area       mosh_life_area not null,
  goal       text not null,
  progress   text,
  completion smallint not null default 0 check (completion between 0 and 100),
  position   smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mosh_weekly_goals_weekly_idx
  on public.mosh_weekly_goals (weekly_id, area);

-- ---------------------------------------------------------------------------
-- Monthly review
-- ---------------------------------------------------------------------------

create table if not exists public.mosh_monthly_reviews (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users (id) on delete cascade,
  month                  date not null, -- first day of the month
  energy_givers          text,
  energy_drainers        text,
  proud_of               text,
  fears_overcome         text,
  service                text,
  structural_improvement text,
  growth                 smallint not null default 0 check (growth between 0 and 100),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (user_id, month)
);

create table if not exists public.mosh_monthly_pillars (
  id           uuid primary key default gen_random_uuid(),
  review_id    uuid not null references public.mosh_monthly_reviews (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  area         mosh_life_area not null,
  goals        text,
  achievements text,
  lessons      text,
  score        smallint not null default 0 check (score between 0 and 100),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (review_id, area)
);

-- ---------------------------------------------------------------------------
-- 365-day master plan
-- ---------------------------------------------------------------------------

create table if not exists public.mosh_year_plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  year       smallint not null,
  theme      text,
  vision     text,
  north_star text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, year)
);

create table if not exists public.mosh_quarters (
  id             uuid primary key default gen_random_uuid(),
  year_plan_id   uuid not null references public.mosh_year_plans (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  quarter        smallint not null check (quarter between 1 and 4),
  title          text not null,
  focus          text[] not null default '{}',
  goal           text not null,
  progress       smallint not null default 0 check (progress between 0 and 100),
  revenue_target numeric(14, 2),
  client_target  integer,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (year_plan_id, quarter)
);

create table if not exists public.mosh_milestones (
  id           uuid primary key default gen_random_uuid(),
  quarter_id   uuid not null references public.mosh_quarters (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  month_offset smallint not null check (month_offset between 1 and 3),
  title        text not null,
  detail       text,
  done         boolean not null default false,
  due_date     date,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists mosh_milestones_quarter_idx
  on public.mosh_milestones (quarter_id, month_offset);

-- ---------------------------------------------------------------------------
-- Business: the three-tier offer ecosystem
-- ---------------------------------------------------------------------------

create table if not exists public.mosh_offers (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  tier       mosh_offer_tier not null,
  name       text not null,
  promise    text,
  price      numeric(14, 2) not null default 0,
  currency   char(3) not null default 'GHS',
  active     boolean not null default true,
  position   smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, tier, name)
);

create table if not exists public.mosh_offer_metrics (
  id              uuid primary key default gen_random_uuid(),
  offer_id        uuid not null references public.mosh_offers (id) on delete cascade,
  user_id         uuid not null references auth.users (id) on delete cascade,
  month           date not null,
  revenue         numeric(14, 2) not null default 0,
  leads           integer not null default 0,
  conversions     integer not null default 0,
  subscribers     integer not null default 0,
  downloads       integer not null default 0,
  students        integer not null default 0,
  satisfaction    smallint check (satisfaction between 0 and 100),
  completion_rate smallint check (completion_rate between 0 and 100),
  clients         integer not null default 0,
  retention       smallint check (retention between 0 and 100),
  transformation  smallint check (transformation between 0 and 100),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (offer_id, month)
);

-- The Wealth Flow Index, as a view, so a mobile client gets the same number
-- the dashboard shows: (attraction x 1) + (core x 2) + (premium x 3).
create or replace view public.mosh_wealth_flow as
select
  m.user_id,
  m.month,
  sum(m.revenue) filter (where o.tier = 'ATTRACTION') as attraction_revenue,
  sum(m.revenue) filter (where o.tier = 'CORE')       as core_revenue,
  sum(m.revenue) filter (where o.tier = 'PREMIUM')    as premium_revenue,
  sum(m.revenue)                                      as total_revenue,
  coalesce(sum(m.revenue) filter (where o.tier = 'ATTRACTION'), 0) * 1
    + coalesce(sum(m.revenue) filter (where o.tier = 'CORE'), 0) * 2
    + coalesce(sum(m.revenue) filter (where o.tier = 'PREMIUM'), 0) * 3
    as wealth_flow_index
from public.mosh_offer_metrics m
join public.mosh_offers o on o.id = m.offer_id
group by m.user_id, m.month;

-- ---------------------------------------------------------------------------
-- Customer funnel
-- ---------------------------------------------------------------------------

create table if not exists public.mosh_funnel_snapshots (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  snapshot_on date not null,
  visitors    integer not null default 0,
  leads       integer not null default 0,
  subscribers integer not null default 0,
  customers   integer not null default 0,
  students    integer not null default 0,
  mentorship  integer not null default 0,
  advocates   integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, snapshot_on)
);

-- ---------------------------------------------------------------------------
-- 50-Day Eclipse Growth Strategy
-- ---------------------------------------------------------------------------

create table if not exists public.mosh_eclipse_days (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  day          smallint not null check (day between 1 and 50),
  phase        mosh_eclipse_phase not null,
  focus        text not null,
  action       text not null,
  done         boolean not null default false,
  note         text,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, day)
);

-- ---------------------------------------------------------------------------
-- The Billionaire Self
-- ---------------------------------------------------------------------------

create table if not exists public.mosh_coach_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  pattern         mosh_pattern not null,
  situation       text not null,
  analysis        text not null,
  encouragement   text not null,
  actions         jsonb not null default '[]'::jsonb,
  prompts         jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  source          mosh_coach_source not null default 'RULES',
  model           text,
  created_at      timestamptz not null default now()
);

create index if not exists mosh_coach_sessions_user_idx
  on public.mosh_coach_sessions (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- A Message From My 77-Year-Old Self
-- ---------------------------------------------------------------------------

create table if not exists public.mosh_legacy_letters (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  kind       mosh_letter_kind not null default 'FUTURE_WISDOM',
  title      text not null,
  body       text not null,
  pinned     boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mosh_legacy_letters_user_idx
  on public.mosh_legacy_letters (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

do $$
declare
  target text;
begin
  foreach target in array array[
    'mosh_profiles', 'mosh_daily_entries', 'mosh_plane_checkins',
    'mosh_weekly_entries', 'mosh_weekly_goals', 'mosh_monthly_reviews',
    'mosh_monthly_pillars', 'mosh_year_plans', 'mosh_quarters',
    'mosh_milestones', 'mosh_offers', 'mosh_offer_metrics',
    'mosh_funnel_snapshots', 'mosh_eclipse_days', 'mosh_legacy_letters'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', target || '_touch', target);
    execute format(
      'create trigger %I before update on public.%I
         for each row execute function public.mosh_touch_updated_at()',
      target || '_touch', target
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
--
-- One rule, applied identically to every table: you can see and change your own
-- rows and nobody else's. `with check` is set on write policies as well as
-- `using` on reads, so a row can never be inserted or moved onto another user.

do $$
declare
  target text;
begin
  foreach target in array array[
    'mosh_profiles', 'mosh_daily_entries', 'mosh_plane_checkins',
    'mosh_weekly_entries', 'mosh_weekly_goals', 'mosh_monthly_reviews',
    'mosh_monthly_pillars', 'mosh_year_plans', 'mosh_quarters',
    'mosh_milestones', 'mosh_offers', 'mosh_offer_metrics',
    'mosh_funnel_snapshots', 'mosh_eclipse_days', 'mosh_coach_sessions',
    'mosh_legacy_letters'
  ]
  loop
    execute format('alter table public.%I enable row level security', target);
    execute format('alter table public.%I force row level security', target);

    execute format('drop policy if exists "own rows: select" on public.%I', target);
    execute format(
      'create policy "own rows: select" on public.%I for select using (auth.uid() = user_id)',
      target
    );

    execute format('drop policy if exists "own rows: insert" on public.%I', target);
    execute format(
      'create policy "own rows: insert" on public.%I for insert with check (auth.uid() = user_id)',
      target
    );

    execute format('drop policy if exists "own rows: update" on public.%I', target);
    execute format(
      'create policy "own rows: update" on public.%I for update
         using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      target
    );

    execute format('drop policy if exists "own rows: delete" on public.%I', target);
    execute format(
      'create policy "own rows: delete" on public.%I for delete using (auth.uid() = user_id)',
      target
    );
  end loop;
end $$;

-- Views do not carry their own RLS; this one reads only from tables that do,
-- and `security_invoker` makes it run with the caller's rights so those
-- policies apply.
alter view public.mosh_wealth_flow set (security_invoker = true);

-- ---------------------------------------------------------------------------
-- Bootstrap a profile whenever a Supabase account is created
-- ---------------------------------------------------------------------------

create or replace function public.mosh_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.mosh_profiles (user_id, display_name, plan_year, onboarded_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    extract(year from now())::integer,
    now()
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists mosh_on_auth_user_created on auth.users;
create trigger mosh_on_auth_user_created
  after insert on auth.users
  for each row execute function public.mosh_handle_new_user();

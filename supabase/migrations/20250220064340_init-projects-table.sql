-- The projects table
drop table if exists "public"."projects";

create table 
  projects (
    -- project_id serial primary key generated always as identity not null,
    project_uid uuid default public.uuid_generate_v8() primary key,
    "name" varchar(100) unique not null,
    slug varchar(132) unique not null,
    hex_color varchar(7) not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz null,
    archived_at timestamptz null,
    archived boolean default false,
    deleted_at timestamptz null,
    deleted boolean default false
  );

-- This allows to enable row level security on your tables.
-- See https://supabase.com/docs/guides/database/postgres/row-level-security#enabling-row-level-security
alter table "public"."projects" enable row level security;

create policy "Enable read access for authenticated users only"
on "public"."projects"
as PERMISSIVE
for SELECT
to authenticated
using (true);

create policy "Enable insert access for authenticated users only"
on "public"."projects"
as PERMISSIVE
for INSERT
to authenticated
with check (true);

create policy "Enable update access for authenticated users only"
on "public"."projects"
as PERMISSIVE
for UPDATE
to authenticated
using (true)
with check (true);

create policy "Enable delete access for authenticated users only"
on "public"."projects"
as PERMISSIVE
for DELETE
to authenticated
using (true);


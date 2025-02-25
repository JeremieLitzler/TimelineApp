-- The projects table
drop table if exists "public"."projects";

create table 
  projects (
    -- project_id serial primary key generated always as identity  null,
    project_uid uuid default public.uuid_generate_v8() primary key,
    project_name varchar(100) unique not null,
    project_slug varchar(132) unique not null,
    project_hex_color varchar(7) not null,
    project_created_at timestamptz default now() not null,
    project_updated_at timestamptz null,
    project_archived_at timestamptz null,
    project_archived boolean default false,
    project_deleted_at timestamptz null,
    project_deleted boolean default false
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


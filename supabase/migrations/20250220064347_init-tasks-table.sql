-- The tasks table
drop table if exists "public"."tasks";

create table 
  tasks (
    -- task_id serial primary key generated always as identity not null,
    task_uid uuid default public.uuid_generate_v8() primary key,
    project_uid uuid references projects (project_uid) on delete cascade,
    "name" varchar(250) unique not null,
    slug varchar(250) unique not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz null,
    completed_at timestamptz null,
    completed boolean default false,
    deleted_at timestamptz null,
    deleted boolean default false
  );

-- This allows to enable row level security on your tables.
-- See https://supabase.com/docs/guides/database/postgres/row-level-security#enabling-row-level-security
alter table "public"."tasks" enable row level security;

create policy "Enable read access for authenticated users only"
on "public"."tasks"
as PERMISSIVE
for SELECT
to authenticated
using (true);

create policy "Enable insert access for authenticated users only"
on "public"."tasks"
as PERMISSIVE
for INSERT
to authenticated
with check (true);

create policy "Enable update access for authenticated users only"
on "public"."tasks"
as PERMISSIVE
for UPDATE
to authenticated
using (true)
with check (true);

create policy "Enable delete access for authenticated users only"
on "public"."tasks"
as PERMISSIVE
for DELETE
to authenticated
using (true);

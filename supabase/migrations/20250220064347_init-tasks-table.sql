-- The tasks table
drop table if exists "public"."tasks";

create table 
  tasks (
    -- task_id serial primary key generated always as identity not null,
    task_uid uuid default public.uuid_generate_v8() primary key,
    project_uid uuid references projects (project_uid) on delete cascade,
    task_name varchar(250) unique not null,
    task_slug varchar(250) unique not null,
    task_created_at timestamptz default now() not null,
    task_updated_at timestamptz null,
    task_completed_at timestamptz null,
    task_completed boolean default false,
    task_deleted_at timestamptz null,
    task_deleted boolean default false
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

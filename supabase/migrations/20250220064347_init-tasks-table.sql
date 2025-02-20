-- The tasks table
drop table if exists "public"."tasks";

create table 
  tasks (
    task_id bigint primary key generated always as identity not null,
    task_uid ??? unique not null,
    project_id bigint references projects (project_id) on delete cascade default null,
    task_name varchar(250) unique not null,
    task_created_at timestamptz default now() not null,
    task_updated_at timestamptz null,
    task_completed_at timestamptz null,
    task_completed not null default false,
    task_deleted_at timestamptz null,
    task_deleted not null default false,
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

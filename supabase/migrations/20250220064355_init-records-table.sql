
-- The records table
drop table if exists "public"."records";

create table 
  records (
    -- record_id serial primary key generated always as identity not null,
    record_uid uuid default public.uuid_generate_v8() primary key,
    project_uid uuid references projects (project_uid) on delete cascade,
    task_uid uuid references tasks (task_uid) on delete cascade,
    started_at timestamptz default now() not null,
    ended_at timestamptz null,
    created_at timestamptz default now() not null,
    updated_at timestamptz null,
    deleted_at timestamptz null,
    deleted boolean default false
  );

-- This allows to enable row level security on your tables.
-- See https://supabase.com/docs/guides/database/postgres/row-level-security#enabling-row-level-security
alter table "public"."records" enable row level security;

create policy "Enable read access for authenticated users only"
on "public"."records"
as PERMISSIVE
for SELECT
to authenticated
using (true);

create policy "Enable insert access for authenticated users only"
on "public"."records"
as PERMISSIVE
for INSERT
to authenticated
with check (true);

create policy "Enable update access for authenticated users only"
on "public"."records"
as PERMISSIVE
for UPDATE
to authenticated
using (true)
with check (true);

create policy "Enable delete access for authenticated users only"
on "public"."records"
as PERMISSIVE
for DELETE
to authenticated
using (true);
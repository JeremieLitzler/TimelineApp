
-- The records table
drop table if exists "public"."records";

create table 
  records (
    record_id bigint primary key generated always as identity not null,
    record_uid ??? unique not null,
    project_id bigint references projects (project_id) on delete cascade default not null,
    task_id bigint references tasks (task_id) on delete cascade default null,
    record_started_at timestamptz default now() not null,
    record_ended_at timestamptz null,
    record_created_at timestamptz default now() not null,
    record_updated_at timestamptz null,
    record_deleted_at timestamptz null,
    record_deleted not null default false,
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
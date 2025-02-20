-- The keep_alive table
drop table if exists keep_alive;

create table
  keep_alive(
    is_set boolean not null
  );

alter table "public"."keep_alive" enable row level security;

create policy "Enable read access for all users"
on "public"."keep_alive"
as PERMISSIVE
for SELECT
to public
using (
  true
);

insert into keep_alive values (true);
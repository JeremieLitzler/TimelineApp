
-- Based off IETF draft, https://datatracker.ietf.org/doc/draft-peabody-dispatch-new-uuid-format/
-- Credits: https://gist.github.com/kjmph/5bd772b2c2df145aa645b837da7eca74
create or replace function public.uuid_generate_v7()
returns uuid
as $$
begin
  -- use random v4 uuid as starting point (which has the same variant we need)
  -- then overlay timestamp
  -- then set version 7 by flipping the 2 and 1 bit in the version 4 string
  return encode(
    set_bit(
      set_bit(
        overlay(uuid_send(gen_random_uuid())
                placing substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3)
                from 1 for 6
        ),
        52, 1
      ),
      53, 1
    ),
    'hex')::uuid;
end
$$
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
  volatile;

-- Generate a custom UUID v8 with microsecond precision
create or replace function public.uuid_generate_v8()
returns uuid
as $$
declare
  timestamp    timestamptz;
  microseconds int;
begin
  timestamp    = clock_timestamp();
  microseconds = (cast(extract(microseconds from timestamp)::int - (floor(extract(milliseconds from timestamp))::int * 1000) as double precision) * 4.096)::int;

  -- use random v4 uuid as starting point (which has the same variant we need)
  -- then overlay timestamp
  -- then set version 8 and add microseconds
  return encode(
    set_byte(
      set_byte(
        overlay(uuid_send(gen_random_uuid())
                placing substring(int8send(floor(extract(epoch from timestamp) * 1000)::bigint) from 3)
                from 1 for 6
        ),
        6, (b'1000' || (microseconds >> 8)::bit(4))::bit(8)::int
      ),
      7, microseconds::bit(8)::int
    ),
    'hex')::uuid;
end
$$
 LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
 volatile;
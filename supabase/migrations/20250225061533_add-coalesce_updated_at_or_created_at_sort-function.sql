CREATE OR REPLACE FUNCTION public.coalesce_updated_at_or_created_at_sort(
    target_table text,
    selected_columns text DEFAULT '*',
    sort_direction text DEFAULT 'DESC',
    nulls_position text DEFAULT 'FIRST',
    where_clause text DEFAULT NULL
) 
RETURNS SETOF json AS $$

DECLARE
    query text;
BEGIN
    IF sort_direction NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'sort_direction must be either ASC or DESC';
    END IF;
    IF nulls_position NOT IN ('FIRST', 'LAST') THEN
        RAISE EXCEPTION 'nulls_position must be either FIRST or LAST';
    END IF;

    query := format(
        'SELECT row_to_json(t) FROM (SELECT %s FROM public.%I',
        selected_columns,
        target_table
    );

    IF where_clause IS NOT NULL AND where_clause != '' THEN
        query := query || ' WHERE ' || where_clause;
    END IF;

    query := query || format(
        ' ORDER BY COALESCE(updated_at, created_at) %s NULLS %s) t',
        sort_direction,
        nulls_position
    );

    RETURN QUERY EXECUTE query;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
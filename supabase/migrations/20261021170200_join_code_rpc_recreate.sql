-- Drop e recria para substituir corretamente a função antiga que ainda
-- tinha RETURNS TABLE (campaign_id, title) causando ambiguidade no INSERT.

drop function if exists public.join_campaign_by_code(text, uuid);

create function public.join_campaign_by_code(
  _code text,
  _character_id uuid default null
)
returns table (out_campaign_id uuid, out_title text)
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _c   record;
begin
  if _uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select c.id, c.title into _c
  from public.campaigns c
  where c.join_code = upper(trim(_code))
  limit 1;

  if _c.id is null then
    raise exception 'invalid join code' using errcode = 'P0001';
  end if;

  insert into public.campaign_members (campaign_id, user_id, character_id)
  values (_c.id, _uid, _character_id)
  on conflict (campaign_id, user_id) do update
    set character_id = excluded.character_id;

  out_campaign_id := _c.id;
  out_title := _c.title;
  return next;
end;
$$;

grant execute on function public.join_campaign_by_code(text, uuid) to authenticated;

-- 메뉴 삭제 + 실시간 DELETE 동기화 (Supabase SQL Editor에서 실행)
-- policy가 이미 있어도 다시 실행해도 됩니다.

drop policy if exists "menus_delete" on menus;
create policy "menus_delete" on menus for delete using (true);

-- DELETE 이벤트에 room_id 등 전체 행 포함
alter table menus replica identity full;

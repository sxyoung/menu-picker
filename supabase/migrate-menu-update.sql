-- 메뉴 작성자(author) 수정 허용 (닉네임 변경 시 Supabase SQL Editor에서 실행)
-- policy가 이미 있어도 다시 실행해도 됩니다.

drop policy if exists "menus_update" on menus;
create policy "menus_update" on menus for update using (true) with check (true);

-- 이미 V2를 쓰고 있다면 SQL Editor에서 이 파일만 Run 하세요.

alter table rooms add column if not exists result_name text;

create policy "rooms_update" on rooms for update using (true) with check (true);

alter publication supabase_realtime add table rooms;

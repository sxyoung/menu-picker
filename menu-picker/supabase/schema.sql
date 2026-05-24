-- Supabase SQL Editor에서 이 파일 내용을 붙여넣고 Run 하세요.

-- 1. 방 테이블
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  result_name text,
  created_at timestamptz default now()
);

-- 2. 메뉴 테이블
create table if not exists menus (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade not null,
  name text not null,
  author text not null,
  created_at timestamptz default now()
);

-- 3. 보안 정책 (누구나 읽기/쓰기 - 초보자용 간단 설정)
alter table rooms enable row level security;
alter table menus enable row level security;

create policy "rooms_select" on rooms for select using (true);
create policy "rooms_insert" on rooms for insert with check (true);
create policy "rooms_update" on rooms for update using (true) with check (true);

create policy "menus_select" on menus for select using (true);
create policy "menus_insert" on menus for insert with check (true);

-- 4. 실시간 동기화 활성화
alter publication supabase_realtime add table menus;
alter publication supabase_realtime add table rooms;

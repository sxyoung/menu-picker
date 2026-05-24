export type MenuItem = {
  id: string;
  room_id: string;
  name: string;
  author: string;
  created_at: string;
};

export type Room = {
  id: string;
  code: string;
  result_name: string | null;
};

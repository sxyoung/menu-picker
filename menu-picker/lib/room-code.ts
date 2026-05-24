export function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getNickname() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("nickname") ?? "";
}

export function saveNickname(name: string) {
  localStorage.setItem("nickname", name.trim());
}

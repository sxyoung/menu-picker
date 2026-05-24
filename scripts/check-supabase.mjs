import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(path) {
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    env[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  }
  return env;
}

const env = loadEnv(".env.local");
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log("RESULT: FAIL - 환경변수가 비어 있습니다");
  process.exit(1);
}

const urlOk = url.startsWith("https://") && url.includes(".supabase.co");
console.log("RESULT: ENV OK - URL 형식", urlOk ? "정상" : "오류");

const supabase = createClient(url, key);
const { error } = await supabase.from("rooms").select("id").limit(1);

if (!error) {
  console.log("RESULT: SUPABASE OK - 연결 및 rooms 테이블 조회 성공");
  process.exit(0);
}

if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
  console.log("RESULT: SUPABASE OK - 연결 성공 (rooms 테이블은 아직 없음, V2에서 생성 예정)");
  process.exit(0);
}

console.log("RESULT: FAIL -", error.message);
process.exit(1);

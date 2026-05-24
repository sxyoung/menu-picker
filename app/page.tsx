"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { generateRoomCode, getNickname, saveNickname } from "@/lib/room-code";

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNickname(getNickname());
  }, []);

  const goRoom = (code: string) => {
    router.push(`/room/${code.toUpperCase()}`);
  };

  const createRoom = async () => {
    const name = nickname.trim();
    if (!name) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError("");
    saveNickname(name);

    const code = generateRoomCode();
    const { error: insertError } = await supabase.from("rooms").insert({ code });

    if (insertError) {
      setError("방 만들기에 실패했어요. 다시 시도해 주세요.");
      setLoading(false);
      return;
    }

    goRoom(code);
  };

  const joinRoom = async () => {
    const name = nickname.trim();
    const code = joinCode.trim().toUpperCase();

    if (!name) {
      setError("닉네임을 입력해 주세요.");
      return;
    }
    if (code.length !== 6) {
      setError("방 코드는 6자리예요.");
      return;
    }

    setLoading(true);
    setError("");
    saveNickname(name);

    const { data, error: selectError } = await supabase
      .from("rooms")
      .select("code")
      .eq("code", code)
      .maybeSingle();

    if (selectError || !data) {
      setError("방을 찾을 수 없어요. 코드를 확인해 주세요.");
      setLoading(false);
      return;
    }

    goRoom(data.code);
  };

  return (
    <div className="flex min-h-full flex-col bg-zinc-100">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-8">
        <header className="mb-8 text-center">
          <p className="text-sm font-medium text-orange-500">VERSION 2</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900">오늘 뭐 먹지?</h1>
          <p className="mt-1 text-sm text-zinc-500">친구와 함께 메뉴를 정해 보세요</p>
        </header>

        <label className="mb-6 block">
          <span className="mb-2 block text-sm font-medium text-zinc-500">닉네임</span>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="이름 입력"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </label>

        <button
          type="button"
          onClick={createRoom}
          disabled={loading}
          className="w-full rounded-2xl bg-orange-500 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-orange-600 active:scale-[0.98] disabled:bg-zinc-300"
        >
          {loading ? "처리 중..." : "새 방 만들기"}
        </button>

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-400">또는 코드로 입장</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && joinRoom()}
            placeholder="방 코드 6자리"
            maxLength={6}
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 uppercase tracking-widest text-zinc-900 placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
          <button
            type="button"
            onClick={joinRoom}
            disabled={loading}
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:bg-zinc-300"
          >
            입장
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}
      </main>
    </div>
  );
}

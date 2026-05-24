"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getNickname, saveNickname } from "@/lib/room-code";
import type { MenuItem, Room } from "@/lib/types";

export default function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const roomCode = code.toUpperCase();

  const [room, setRoom] = useState<Room | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nickname, setNickname] = useState("");
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  useEffect(() => {
    setNickname(getNickname());
  }, []);

  useEffect(() => {
    const loadRoom = async () => {
      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", roomCode)
        .maybeSingle();

      if (roomError || !roomData) {
        setError(roomError ? "방 정보를 불러오지 못했어요." : "방을 찾을 수 없어요.");
        setLoading(false);
        return;
      }

      setRoom(roomData as Room);
      setResult(roomData.result_name ?? null);

      const { data: menuData } = await supabase
        .from("menus")
        .select("*")
        .eq("room_id", roomData.id)
        .order("created_at", { ascending: true });

      setMenus(menuData ?? []);
      setLoading(false);

      if (!getNickname()) {
        setShowNicknameModal(true);
      }
    };

    loadRoom();
  }, [roomCode]);

  const confirmNickname = () => {
    const name = nicknameInput.trim();
    if (!name) {
      setNicknameError("닉네임을 입력해 주세요.");
      return;
    }
    saveNickname(name);
    setNickname(name);
    setNicknameError("");
    setShowNicknameModal(false);
  };

  useEffect(() => {
    if (!room) return;

    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "menus",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          const newMenu = payload.new as MenuItem;
          setMenus((prev) => {
            if (prev.some((m) => m.id === newMenu.id)) return prev;
            return [...prev, newMenu];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          const updated = payload.new as Room;
          setRoom(updated);
          setResult(updated.result_name ?? null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room]);

  const clearResult = async () => {
    if (!room) return;
    await supabase.from("rooms").update({ result_name: null }).eq("id", room.id);
    setResult(null);
  };

  const addMenu = async () => {
    if (!room) return;
    const name = input.trim();
    if (!name) return;
    if (!nickname) {
      setShowNicknameModal(true);
      return;
    }

    setError("");
    const { error: insertError } = await supabase.from("menus").insert({
      room_id: room.id,
      name,
      author: nickname,
    });

    if (insertError) {
      setError("메뉴 추가에 실패했어요.");
      return;
    }

    setInput("");
    await clearResult();
  };

  const pickRandom = async () => {
    if (!room || menus.length === 0) return;

    const index = Math.floor(Math.random() * menus.length);
    const picked = menus[index].name;

    const { error: updateError } = await supabase
      .from("rooms")
      .update({ result_name: picked })
      .eq("id", room.id);

    if (updateError) {
      setError(
        updateError.message.includes("result_name")
          ? "랜덤 결과 공유 설정이 필요해요. Supabase에서 migrate-shared-result.sql을 실행해 주세요."
          : "랜덤 선택에 실패했어요."
      );
      return;
    }

    setResult(picked);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/room/${roomCode}`;
    await navigator.clipboard.writeText(url);
    setCopied("link");
    setTimeout(() => setCopied(null), 2000);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied("code");
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-zinc-100 text-sm text-zinc-500">
        불러오는 중...
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-zinc-100 px-5">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="rounded-xl bg-zinc-900 px-5 py-3 text-sm text-white">
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-100">
      {showNicknameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="nickname-modal-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id="nickname-modal-title" className="text-lg font-bold text-zinc-900">
              닉네임 설정
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              방에 참여하려면 사용할 이름을 입력해 주세요.
            </p>
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => {
                setNicknameInput(e.target.value);
                setNicknameError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && confirmNickname()}
              placeholder="이름 입력"
              autoFocus
              className="mt-4 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
            {nicknameError && (
              <p className="mt-2 text-sm text-red-600">{nicknameError}</p>
            )}
            <button
              type="button"
              onClick={confirmNickname}
              className="mt-4 w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              참여하기
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-8">
        <header className="mb-6">
          <Link href="/" className="text-sm text-zinc-400">
            ← 홈
          </Link>
          <h1 className="mt-2 text-xl font-bold text-zinc-900">방 코드</h1>
          <p className="mt-1 text-3xl font-bold tracking-widest text-orange-500">{roomCode}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={copyCode}
              className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm text-zinc-600"
            >
              {copied === "code" ? "코드 복사됨!" : "방 코드 복사"}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm text-zinc-600"
            >
              {copied === "link" ? "링크 복사됨!" : "초대 링크 복사"}
            </button>
          </div>
        </header>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMenu()}
            placeholder="메뉴 입력"
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
          <button
            type="button"
            onClick={addMenu}
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            추가
          </button>
        </div>

        {error && room && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        <section className="mt-6 flex-1">
          <h2 className="mb-3 text-sm font-medium text-zinc-500">
            메뉴 목록 {menus.length > 0 && `(${menus.length})`}
          </h2>

          {menus.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-white py-12 text-center text-sm text-zinc-400">
              아직 등록된 메뉴가 없어요
            </div>
          ) : (
            <ul className="space-y-2">
              {menus.map((menu) => (
                <li key={menu.id} className="rounded-xl bg-white px-4 py-3 shadow-sm">
                  <p className="font-medium text-zinc-800">{menu.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">{menu.author}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {result && (
          <div className="mt-6 rounded-2xl bg-orange-500 px-6 py-8 text-center text-white shadow-lg">
            <p className="text-sm font-medium opacity-90">오늘의 메뉴</p>
            <p className="mt-2 text-3xl font-bold">{result}</p>
          </div>
        )}

        <button
          type="button"
          onClick={pickRandom}
          disabled={menus.length === 0}
          className="mt-6 w-full rounded-2xl bg-orange-500 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none"
        >
          랜덤 선택
        </button>
      </main>
    </div>
  );
}

export type MenuCategoryId =
  | "korean"
  | "chinese"
  | "japanese"
  | "western"
  | "cafe";

export type MenuOption = {
  name: string;
  emoji: string;
};

export type MenuCategory = {
  id: MenuCategoryId;
  label: string;
  emoji: string;
  items: MenuOption[];
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "korean",
    label: "한식",
    emoji: "🍚",
    items: [
      { name: "김치찌개", emoji: "🥘" },
      { name: "된장찌개", emoji: "🍲" },
      { name: "비빔밥", emoji: "🍚" },
      { name: "삼겹살", emoji: "🥓" },
      { name: "보쌈", emoji: "🥬" },
      { name: "치킨", emoji: "🍗" },
      { name: "냉면", emoji: "🍜" },
      { name: "국밥", emoji: "🍚" },
      { name: "제육볶음", emoji: "🐷" },
      { name: "순두부찌개", emoji: "🍲" },
      { name: "갈비탕", emoji: "🍖" },
      { name: "불고기", emoji: "🥩" },
      { name: "칼국수", emoji: "🍜" },
      { name: "떡볶이", emoji: "🌶️" },
      { name: "김밥", emoji: "🍙" },
    ],
  },
  {
    id: "chinese",
    label: "중식",
    emoji: "🥟",
    items: [
      { name: "짜장면", emoji: "🍜" },
      { name: "짬뽕", emoji: "🍲" },
      { name: "탕수육", emoji: "🍖" },
      { name: "마라탕", emoji: "🌶️" },
      { name: "마라샹궈", emoji: "🦐" },
      { name: "깐풍기", emoji: "🍗" },
      { name: "양장피", emoji: "🥗" },
      { name: "볶음밥", emoji: "🍚" },
      { name: "마파두부", emoji: "🧈" },
      { name: "유린기", emoji: "🍗" },
      { name: "고추잡채", emoji: "🫑" },
      { name: "딤섬", emoji: "🥟" },
      { name: "훠궈", emoji: "🫕" },
    ],
  },
  {
    id: "japanese",
    label: "일식",
    emoji: "🍣",
    items: [
      { name: "초밥", emoji: "🍣" },
      { name: "라멘", emoji: "🍜" },
      { name: "돈카츠", emoji: "🍱" },
      { name: "우동", emoji: "🍜" },
      { name: "규동", emoji: "🍖" },
      { name: "가츠동", emoji: "🍱" },
      { name: "오코노미야키", emoji: "🥞" },
      { name: "텐동", emoji: "🍤" },
      { name: "야키토리", emoji: "🍢" },
      { name: "카레", emoji: "🍛" },
      { name: "소바", emoji: "🍜" },
      { name: "회덮밥", emoji: "🐟" },
    ],
  },
  {
    id: "western",
    label: "양식",
    emoji: "🍝",
    items: [
      { name: "파스타", emoji: "🍝" },
      { name: "피자", emoji: "🍕" },
      { name: "스테이크", emoji: "🥩" },
      { name: "햄버거", emoji: "🍔" },
      { name: "리조또", emoji: "🍚" },
      { name: "샐러드", emoji: "🥗" },
      { name: "그라탕", emoji: "🧀" },
      { name: "브런치", emoji: "🥞" },
      { name: "핫도그", emoji: "🌭" },
      { name: "타코", emoji: "🌮" },
      { name: "샌드위치", emoji: "🥪" },
      { name: "수프", emoji: "🥣" },
    ],
  },
  {
    id: "cafe",
    label: "카페·디저트",
    emoji: "☕",
    items: [
      { name: "커피", emoji: "☕" },
      { name: "케이크", emoji: "🍰" },
      { name: "빙수", emoji: "🍧" },
      { name: "마카롱", emoji: "🧁" },
      { name: "와플", emoji: "🧇" },
      { name: "크로플", emoji: "🥐" },
      { name: "아이스크림", emoji: "🍦" },
      { name: "도넛", emoji: "🍩" },
      { name: "브런치", emoji: "🥐" },
      { name: "스무디", emoji: "🥤" },
      { name: "베이글", emoji: "🥯" },
      { name: "티라미수", emoji: "🍮" },
    ],
  },
];

const emojiByName = new Map<string, string>();
for (const category of MENU_CATEGORIES) {
  for (const item of category.items) {
    if (!emojiByName.has(item.name)) {
      emojiByName.set(item.name, item.emoji);
    }
  }
}

export function getMenuEmoji(name: string): string {
  return emojiByName.get(name) ?? "🍽️";
}

export function getCategoryById(id: MenuCategoryId): MenuCategory | undefined {
  return MENU_CATEGORIES.find((c) => c.id === id);
}

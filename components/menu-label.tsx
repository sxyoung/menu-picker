import { getMenuEmoji } from "@/lib/menu-categories";

type MenuLabelProps = {
  name: string;
  emojiSize?: "sm" | "md" | "lg";
  className?: string;
};

const emojiSizeClass = {
  sm: "text-base leading-none",
  md: "text-lg leading-none",
  lg: "text-3xl leading-none",
} as const;

export function MenuLabel({ name, emojiSize = "md", className = "" }: MenuLabelProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={emojiSizeClass[emojiSize]} aria-hidden>
        {getMenuEmoji(name)}
      </span>
      <span>{name}</span>
    </span>
  );
}

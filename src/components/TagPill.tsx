import { cn } from "@/lib/utils";
import type { DBTag } from "@/lib/database.types";

type Props = {
  tag: DBTag;
  onClick?: (tag: DBTag) => void;
  isSelected?: boolean;
  className?: string;
};

export default function TagPill({ tag, onClick, isSelected, className }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(tag)}
      className={cn(
        "tag-pill transition-all",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "tag-pill-gray hover:bg-secondary",
        onClick && "cursor-pointer",
        !onClick && "cursor-default",
        className
      )}
    >
      #{tag.label}
    </button>
  );
}

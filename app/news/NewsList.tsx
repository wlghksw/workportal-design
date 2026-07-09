import type { NewsItem } from "@/features/news";
import { NewsCard } from "./NewsCard";

export type NewsListProps = {
  items?: NewsItem[] | null;
};

export function NewsList({ items }: NewsListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="news-empty" role="status" aria-live="polite">
        표시할 기사가 없습니다.
        <br />
        필터 조건이 너무 강하거나, 최근 기사가 적을 수 있어요.
      </div>
    );
  }

  return (
    <div className="news-list" aria-label="기사 목록">
      {items.map((item, index) => (
        <NewsCard
          key={`${item.link || index}-${index}`}
          item={item}
          index={index}
        />
      ))}
    </div>
  );
}

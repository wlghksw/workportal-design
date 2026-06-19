import type { NewsItem } from "@/features/news";

export type NewsCardProps = {
  item: NewsItem;
  index: number;
};

/** RSS 피드 라벨 → 화면용 짧은 이름 변환 */
function prettySource(label?: string | null) {
  const s = String(label || "").trim();
  if (!s) return "출처 미상";
  if (s.startsWith("GNews_")) {
    const rest = s.slice(6).replace(/_/g, " · ");
    return `구글 뉴스 · ${rest}`;
  }
  return s.replace(/_/g, " · ");
}

/** ISO Date를 읽기 쉬운 형식으로 변환 */
function prettyDate(iso?: string | null) {
  if (!iso) return "";
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return "";
  const d = new Date(ms);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}.${mo}.${dd}`;
}

function normText(t: string) {
  return String(t || "")
    .replace(/\s+/g, " ")
    .replace(/[…\.]{2,}/g, "")
    .trim()
    .toLowerCase();
}

/** 제목과 거의 같으면 요약은 숨김 */
function shouldShowSummary(title: string, summary: string) {
  const t = normText(title);
  const s = normText(summary);
  if (!s || s.length < 12) return false;
  if (t === s) return false;
  if (s.startsWith(t) || t.startsWith(s)) return false;
  if (t.length > 20 && s.includes(t.slice(0, Math.min(40, t.length)))) return false;
  return true;
}

export function NewsCard({ item, index }: NewsCardProps) {
  const title = item.title || "(제목 없음)";
  const href = item.link?.trim() || null;
  const pub = prettyDate(item.published);
  const src = prettySource(item.source);
  
  const rawSummary = String(item.summary || "").replace(/\s+/g, " ").trim();
  const showSum = shouldShowSummary(title, rawSummary);
  const shortSummary = rawSummary.length > 200 ? `${rawSummary.slice(0, 200).trim()}…` : rawSummary;

  return (
    <article className="news-card">
      <div className="news-card-top">
        <span className="news-card-num">{index + 1}</span>
        <span className="news-card-source">{src}</span>
        {pub && item.published && (
          <time className="news-card-date" dateTime={item.published}>
            {pub}
          </time>
        )}
      </div>
      
      {href ? (
        <a
          className="news-card-title"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
          <span className="sr-only"> (새 창에서 열림)</span>
        </a>
      ) : (
        <h2 className="news-card-title">{title}</h2>
      )}
      
      {showSum && <p className="news-card-summary">{shortSummary}</p>}
      
      {href && (
        <a
          className="news-card-link"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} 원문 보기 (새 창에서 열림)`}
        >
          원문 보기
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}
    </article>
  );
}

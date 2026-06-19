/** 뉴스 기사 단일 항목 타입 */
export type NewsItem = {
  title?: string | null;
  link?: string | null;
  source?: string | null;
  published?: string | null;
  summary?: string | null;
};

/** 뉴스 API 전체 응답 타입 (https://news.platformers.kr/v1/news) */
export type NewsApiResponse = {
  items: NewsItem[];
  count: number;
};

/** UI 상태 타입 (목록 렌더링용) */
export type NewsUiState = {
  isLoading: boolean;
  error: Error | null;
  data: NewsApiResponse | null;
};

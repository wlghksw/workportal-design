import type { NewsApiResponse } from "../types/news.types";

export const NEWS_API_ENDPOINT = "https://news.platformers.kr/v1/news";

/**
 * 교육 뉴스 목록을 가져옵니다.
 * @returns {Promise<NewsApiResponse>} 뉴스 데이터
 * @throws {Error} 네트워크 오류 또는 API 응답 실패 시
 */
export async function getNewsList(): Promise<NewsApiResponse> {
  const response = await fetch(NEWS_API_ENDPOINT);

  if (!response.ok) {
    throw new Error(
      `뉴스 데이터를 불러오는데 실패했습니다. (Status: ${response.status})`,
    );
  }

  const data = (await response.json()) as unknown;
  return data as NewsApiResponse;
}

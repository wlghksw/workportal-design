import { NewsletterGenerateRequest, NewsletterGenerateResponse } from "../types/newsletter.types";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

export async function generateNewsletter(
  data: NewsletterGenerateRequest
): Promise<NewsletterGenerateResponse> {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = responseData.detail;
    let msg = typeof detail === "string" ? detail : detail?.message || "생성에 실패했습니다.";
    if (detail?.skipped?.length) {
      msg += ` (제외 ${detail.skipped.length}건)`;
    }
    throw new Error(msg);
  }

  return responseData as NewsletterGenerateResponse;
}

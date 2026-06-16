import {
  NewsletterGenerateRequest,
  NewsletterGenerateResponse,
  NewsletterRecipientsManageRequest,
  NewsletterRecipientsManageResponse,
  NewsletterCsvImportResponse,
  NewsletterMailStatusResponse,
  NewsletterMailSendRequest,
  NewsletterMailSendResponse
} from "../types/newsletter.types";

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

export async function getMailStatus(): Promise<NewsletterMailStatusResponse> {
  const res = await fetch(`${API_BASE}/api/mail/status`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "메일 설정을 불러오지 못했습니다.");
  return data as NewsletterMailStatusResponse;
}

export async function sendMail(
  data: NewsletterMailSendRequest
): Promise<NewsletterMailSendResponse> {
  const res = await fetch(`${API_BASE}/api/mail/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof responseData.detail === "string" ? responseData.detail : "발송 실패");
  }
  return responseData as NewsletterMailSendResponse;
}

export async function getRecipients(): Promise<NewsletterRecipientsManageResponse> {
  const res = await fetch(`${API_BASE}/api/mail/recipients/manage`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "수신자 목록을 불러오지 못했습니다.");
  return data as NewsletterRecipientsManageResponse;
}

export async function saveRecipients(
  data: NewsletterRecipientsManageRequest
): Promise<NewsletterRecipientsManageResponse> {
  const res = await fetch(`${API_BASE}/api/mail/recipients/manage`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(responseData.detail || "저장 실패");
  return responseData as NewsletterRecipientsManageResponse;
}

export async function importCsv(
  file: File,
  merge: boolean
): Promise<NewsletterCsvImportResponse> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("merge", merge ? "true" : "false");

  const res = await fetch(`${API_BASE}/api/mail/recipients/import-csv`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "CSV 가져오기 실패");
  }
  return data as NewsletterCsvImportResponse;
}

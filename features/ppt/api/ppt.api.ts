import {
  PptGenerateRequest,
  PptGenerateResponse,
  PptSessionResponse,
  PptChatMessage,
  PptSessionData,
} from "../types/ppt.types";

/**
 * PPT 서비스 API 연동 함수
 * Extracted from legacy `services/ppt/templates/*.html`
 */

/**
 * 신규 PPT 생성 요청
 */
export async function generatePpt(data: PptGenerateRequest): Promise<PptGenerateResponse> {
  const formData = new FormData();
  
  data.files.forEach(f => {
    formData.append("content_file", f.file);
  });
  formData.append("category", data.category);
  formData.append("instructions", data.instructions);
  if (data.targetAudience) {
    formData.append("target_audience", data.targetAudience);
  }

  const response = await fetch("/api/generate", {
    method: "POST",
    body: formData,
    // Note: multipart/form-data인 경우 Content-Type 헤더를 명시하지 않아야 
    // 브라우저가 자동으로 boundary를 생성합니다.
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "PPT 생성 요청에 실패했습니다.");
  }

  return response.json();
}

/**
 * 기존 PPT에 추가 병합 생성 요청
 */
export async function appendPpt(data: PptGenerateRequest): Promise<PptGenerateResponse> {
  if (!data.basePptx) {
    throw new Error("기존 PPTX 파일이 필요합니다.");
  }

  const formData = new FormData();
  formData.append("base_pptx", data.basePptx.file);
  
  data.files.forEach(f => {
    formData.append("content_file", f.file);
  });
  formData.append("instructions", data.instructions);
  formData.append("category", "proposal"); // 추가 병합은 항상 제안서 성격

  const response = await fetch("/api/generate/append", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "PPT 병합 요청에 실패했습니다.");
  }

  return response.json();
}

/**
 * 세션 데이터 조회 (슬라이드, 이미지, 채팅 등)
 */
export async function getPptSession(sessionId: string): Promise<PptSessionData> {
  const response = await fetch(`/api/session/${sessionId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "세션 정보를 불러오지 못했습니다.");
  }

  const payload: PptSessionResponse = await response.json();
  if (payload.status === "error") {
    throw new Error(payload.error || "세션 데이터를 처리하는 중 오류가 발생했습니다.");
  }

  return payload.data;
}

/**
 * AI 채팅 수정 요청
 */
export async function sendPptChat(
  sessionId: string, 
  activePage: number, 
  message: string
): Promise<{ chat_response: string }> {
  const response = await fetch(`/api/session/${sessionId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      active_page: activePage,
      message: message
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "AI 수정 요청 중 오류가 발생했습니다.");
  }

  return response.json();
}

/**
 * 슬라이드/보고서 데이터 수동 저장
 */
export async function savePptSession(
  sessionId: string,
  category: string,
  data: unknown // PptSlide[] 또는 PptReportData
): Promise<{ status: string }> {
  const response = await fetch(`/api/session/${sessionId}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category,
      data
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "저장에 실패했습니다.");
  }

  return response.json();
}

/**
 * 다운로드 URL 생성 헬퍼
 */
export function getPptDownloadUrl(sessionId: string, type: 'pptx' | 'premium-pptx' | 'docx'): string {
  if (type === 'premium-pptx') {
    return `/download/premium-pptx/${sessionId}`;
  }
  if (type === 'docx') {
    return `/download/docx/${sessionId}`;
  }
  return `/download/pptx/${sessionId}`;
}

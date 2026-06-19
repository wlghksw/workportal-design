import {
  EbookBuildPromptRequest,
  EbookBuildPromptResponse,
  EbookGenerateScriptRequest,
  EbookGenerateImageRequest,
  EbookGenerateResponse,
  EbookSliceRequest,
  EbookScript
} from "../types/ebook.types";

/**
 * E-book 서비스 API 연동 함수
 * Extracted from legacy `services/ebook/index.html`
 */

/**
 * 프롬프트 빌드 요청
 */
export async function buildEbookPrompt(data: EbookBuildPromptRequest): Promise<EbookBuildPromptResponse> {
  const response = await fetch("/api/build-prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "프롬프트 생성에 실패했습니다.");
  }

  return response.json();
}

/**
 * AI 대본 생성 요청 (GPT)
 */
export async function generateEbookScript(data: EbookGenerateScriptRequest): Promise<EbookScript> {
  const formData = new FormData();
  formData.append("script_prompt", data.script_prompt);
  if (data.api_key) formData.append("api_key", data.api_key);
  if (data.model) formData.append("model", data.model);

  const response = await fetch("/api/generate-script", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || "대본 생성 중 오류가 발생했습니다.");
  }

  return response.json();
}

/**
 * 동화 이미지 생성 요청 (DALL-E)
 */
export async function generateFairytaleImages(data: EbookGenerateImageRequest): Promise<EbookGenerateResponse> {
  const formData = new FormData();
  formData.append("image_prompt", data.image_prompt);
  if (data.api_key) formData.append("api_key", data.api_key);
  if (data.model) formData.append("model", data.model);
  if (data.story_script) formData.append("story_script", data.story_script);

  const response = await fetch(`/api/generate-fairytale?mode=${data.mode}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || "이미지 생성 중 오류가 발생했습니다.");
  }

  return response.json();
}

/**
 * 이미지 분할 요청
 */
export async function sliceEbookImage(data: EbookSliceRequest): Promise<EbookGenerateResponse> {
  const formData = new FormData();
  formData.append("file", data.file);
  if (data.story_script) formData.append("story_script", data.story_script);

  const response = await fetch(`/api/slice?mode=${data.mode}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "이미지 분할에 실패했습니다.");
  }

  return response.json();
}

/**
 * 결과 ZIP 다운로드 URL 반환
 */
export function getEbookZipDownloadUrl(): string {
  return "/api/download-zip";
}

/**
 * 서비스 활동 리포팅
 */
export async function reportEbookActivity(
  action: string,
  label?: string,
  detail?: string
): Promise<void> {
  try {
    await fetch("https://portal.platformers.kr/api/activity", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: "fairytale",
        action,
        label,
        detail: detail?.slice(0, 500),
      }),
    });
  } catch (e) {
    // Reporting failure should not block the main flow
  }
}

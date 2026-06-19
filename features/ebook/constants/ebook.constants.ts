import {
  EbookGenerationMode,
  EbookEnglishLevel,
  EbookLayoutMode,
  EbookUiState,
  EbookApiSettings,
} from "../types/ebook.types";

/**
 * E-book 생성 방식 정의
 */
export const EBOOK_GENERATION_MODES: { id: EbookGenerationMode; label: string; icon: string }[] = [
  { id: "title", label: "동화 제목으로 생성", icon: "✏️" },
  { id: "story", label: "완성된 동화로 생성", icon: "📝" },
];

/**
 * 영어 난이도 정의
 */
export const EBOOK_ENGLISH_LEVELS: { id: EbookEnglishLevel; label: string }[] = [
  { id: "Kindergarten", label: "유치원" },
  { id: "Elementary School Lower Grades (1–3)", label: "초등 저학년" },
  { id: "Elementary School Upper Grades (4–6)", label: "초등 고학년" },
];

/**
 * 레이아웃 및 분할 모드 정의
 */
export const EBOOK_LAYOUT_MODES: { id: EbookLayoutMode; label: string }[] = [
  { id: 1, label: "📄 낱장 (16장)" },
  { id: 2, label: "📖 2장 펼침" },
  { id: 3, label: "📚 3장 펼침" },
];

/**
 * E-book 처리 단계 정의
 */
export const EBOOK_PROCESS_STAGES = {
  IDLE: "idle",
  PROMPT: "prompt",                     // 프롬프트 빌드 중
  SCRIPT_GENERATING: "scriptGenerating", // GPT 대본 생성 중
  IMAGE_GENERATING: "imageGenerating",   // DALL-E 이미지 생성 중
  SLICING: "slicing",                   // 이미지 분할 중
  SUCCESS: "success",                   // 최종 완료
  ERROR: "error",                       // 오류 발생
} as const;

export type EbookProcessStage = typeof EBOOK_PROCESS_STAGES[keyof typeof EBOOK_PROCESS_STAGES];

/**
 * 기본 API 설정 생성 함수
 */
export function createDefaultEbookApiSettings(): EbookApiSettings {
  return {
    apiKey: "",
    imageModel: "gpt-image-2",
    chatModel: "gpt-4o-mini",
  };
}

/**
 * 기본 UI 상태 생성 함수
 */
export function createDefaultEbookUiState(): EbookUiState {
  return {
    generationMode: "title",
    currentLevel: "Kindergarten",
    layoutMode: 1,
    isProcessing: false,
    processingText: "",
    currentStep: 1,
    errorMessage: null,
    script: [],
    images: [],
    showResults: false,
    scriptPrompt: "",
    imagePrompt: "",
    title: "",
    fullStory: "",
  };
}

/**
 * E-book 가이드 규칙 리스트
 */
export const EBOOK_GUIDE_RULES = [
  { title: "테두리 및 질감 없는 벡터 스타일", desc: "깔끔한 플랫 solid 컬러로 이미지를 자동 유도합니다." },
  { title: "4x4 만화 그리드 최적화", desc: "16칸의 장면이 동일한 간격과 비율로 균등 배열되어야 합니다." },
  { title: "글씨 없는 깨끗한 일러스트", desc: "DALL-E로 그림 생성 시 일체의 텍스트가 섞이지 않도록 차단합니다." },
  { title: "스마트 HQ 1024px 분할", desc: "LANCZOS 정밀 분할을 통해 흐려짐 없는 고화질을 구현합니다." },
];

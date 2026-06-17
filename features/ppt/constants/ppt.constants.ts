import {
  PptWorkMode,
  PptCategory,
  PptGenerateRequest,
  PptEditorTab,
  PptSlideLayoutType,
  PptUiState
} from "../types/ppt.types";

/**
 * PPT 생성 및 편집 단계 정의
 */
export const PPT_PROCESS_STAGES = {
  IDLE: "idle",           // 초기 상태
  INPUT: "input",         // 정보 입력 중
  UPLOADING: "uploading", // 원천 파일 업로드 중
  GENERATING: "generating", // AI 슬라이드 생성 중
  EDITING: "editing",     // 에디터에서 편집 중
  PREVIEW: "preview",     // 미리보기 모드
  SUCCESS: "success",     // 최종 완료
  ERROR: "error",         // 오류 발생
} as const;

export type PptProcessStage = typeof PPT_PROCESS_STAGES[keyof typeof PPT_PROCESS_STAGES];

/**
 * PPT 작업 모드 정의
 */
export const PPT_WORK_MODES: { id: PptWorkMode; label: string; icon: string }[] = [
  { id: "new", label: "신규 제안서 생성", icon: "✨" },
  { id: "append", label: "기존 PPT에 추가 병합", icon: "➕" },
];

/**
 * PPT 서비스 카테고리 정의
 */
export const PPT_CATEGORIES: { id: PptCategory; label: string; icon: string; description: string }[] = [
  { id: "proposal", label: "B2B 제안서", icon: "🎨", description: "B2B 제안서 및 슬라이드 구성" },
  { id: "report", label: "서면 보고서", icon: "📄", description: "공식 서면 보고서 양식" },
  { id: "at_curriculum", label: "교육 커리큘럼", icon: "📚", description: "교육용 커리큘럼 및 차시 구성" },
];

/**
 * 에디터 탭 정의
 */
export const PPT_EDITOR_TABS: { id: PptEditorTab; label: string; icon: string }[] = [
  { id: "chat", label: "AI 대화식 수정", icon: "💬" },
  { id: "form", label: "직접 수동 수정", icon: "⚙️" },
];

/**
 * 슬라이드 레이아웃 한글 레이블
 */
export const PPT_LAYOUT_LABELS: Record<PptSlideLayoutType, string> = {
  title: "표지",
  full_text: "일반 텍스트",
  card_grid: "그리드 카드",
  split_v: "좌텍스트/우이미지",
  split_h: "상텍스트/하이미지",
  timeline_process: "가로 프로세스",
  data_focus: "KPI 수치 강조",
  comparison: "비교 테이블",
  catalog_grid: "카탈로그 표",
  curriculum_table: "커리큘럼 차시",
  supply_pricing: "공급 단가 견적",
  split_table_images: "표 + 이미지",
  pricing_table_cards: "견적표 + 단가카드",
  closing: "마무리 표지",
  chapter: "간지 (Chapter)",
};

/**
 * 기본 생성 요청 정보 생성 함수
 */
export function createDefaultPptRequest(): PptGenerateRequest {
  return {
    mode: "new",
    category: "proposal",
    files: [],
    instructions: "",
    targetAudience: "",
  };
}

/**
 * 기본 UI 상태 생성 함수
 */
export function createDefaultPptUiState(): PptUiState {
  return {
    workMode: "new",
    category: "proposal",
    activePage: 1,
    activeTab: "chat",
    isAILoading: false,
    isSidebarCollapsed: false,
    errorMessage: null,
  };
}

/**
 * 에디터 설정 상수
 */
export const PPT_EDITOR_CONFIG = {
  MIN_SLIDES: 1,
  MAX_FILES: 10,
  MAX_FILE_SIZE_MB: 100,
} as const;

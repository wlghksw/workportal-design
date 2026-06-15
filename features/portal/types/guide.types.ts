import { ServiceId } from "./portal.types";

export type GuideCategoryId = Extract<
  ServiceId,
  "newsletter" | "meeting" | "fairytale" | "ppt"
>;

/**
 * 서비스 메뉴 항목 (좌측 사이드바)
 */
export interface GuideNavItem {
  id: GuideCategoryId;
  label: string;
  icon: string;
}

/**
 * 이용 가이드 서비스 전체 구조
 */
export interface GuideService {
  id: GuideCategoryId;
  title: string;
  description: string;
  sections: GuideSection[];
  toc: GuideTocItem[];
  processFlow?: GuideProcessFlow;
}

/**
 * 가이드 내 대분류 섹션 (Overview, Steps 등)
 */
export interface GuideSection {
  id: string;
  title: string;
  description?: string;
  collapsible?: boolean; // 상세 가이드 접기/펴기 기능 대응
  cards: GuideCard[];
}

/**
 * 가이드 카드 (개별 안내 카드)
 */
export interface GuideCard {
  id: string;
  title: string;
  icon?: string;
  badge?: string; // 카드 헤더에 붙는 배지 텍스트
  steps?: GuideStep[];
  image?: GuideImage;
  content?: string;
  checklist?: GuideChecklistItem[];
  faqs?: GuideFaqItem[];
}

/**
 * 프로세스 플로우 (카드 그리드 형태의 요약 안내)
 */
export interface GuideProcessFlow {
  items: {
    step: string; // e.g. "01"
    title: string;
    description: string;
    targetId?: string; // 클릭 시 이동할 anchor id
  }[];
}

/**
 * 단계별 안내 (Ordered List 형태)
 */
export interface GuideStep {
  title: string;
  description: string;
  image?: GuideImage;
  highlight?: {
    type: "info" | "warn";
    title: string;
    text: string;
  };
}

/**
 * 가이드 이미지 및 핫스팟
 */
export interface GuideImage {
  src: string;
  alt: string;
  hotspots?: GuideHotspot[];
}

/**
 * 이미지 위 대화형 포인트
 */
export interface GuideHotspot {
  id: number;
  top: string; // e.g. "12.8%"
  left: string;
  width?: string;
  height?: string;
  title: string;
  content: string;
}

/**
 * 내부 목차 항목
 */
export interface GuideTocItem {
  id: string;
  label: string;
  isHeader?: boolean;
}

export interface GuideChecklistItem {
  id: number;
  text: string;
}

export interface GuideFaqItem {
  id: number;
  question: string;
  answer: string;
}

import { GuideNavItem, GuideTocItem, GuideCategoryId, GuideService } from "../types/guide.types";

export const GUIDE_MENU: GuideNavItem[] = [
  { id: "newsletter", label: "뉴스레터 발송", icon: "newsletter" },
  { id: "meeting", label: "회의록 자동화", icon: "meeting" },
  { id: "fairytale", label: "E-Book 동화책", icon: "fairytale" },
  { id: "ppt", label: "PPT 제안서 메이커", icon: "ppt" },
];

export const GUIDE_TOC: Record<GuideCategoryId, GuideTocItem[]> = {
  newsletter: [
    { id: "nl-overview", label: "서비스 소개 개요" },
    { id: "steps", label: "소식지 발행 단계", isHeader: true },
    { id: "nl-step1", label: "1단계. 소식지 자동 변환" },
    { id: "nl-step2", label: "2단계. 화면 미리보기 검수" },
    { id: "nl-step3", label: "3단계. 수신 주소록 가져오기" },
    { id: "nl-step4", label: "4단계. 최종 메일 대량 발송" },
    { id: "tools", label: "유용한 도구", isHeader: true },
    { id: "nl-checklist", label: "발송 전 자가 점검표" },
    { id: "nl-faq", label: "자주 묻는 질문 (FAQ)" },
  ],
  meeting: [
    { id: "mt-overview", label: "회의록 자동화 개요" },
    { id: "steps", label: "회의록 분석 단계", isHeader: true },
    { id: "mt-step1", label: "1단계. 회의 메타 정보 입력" },
    { id: "mt-step2", label: "2단계. 음성 녹음 및 파일 준비" },
    { id: "mt-step3", label: "3단계. AI 회의록 분석 및 공유" },
    { id: "mt-step4", label: "4단계. 최근 회의 히스토리 관리" },
    { id: "tools", label: "유용한 도구", isHeader: true },
    { id: "mt-checklist", label: "제작 전 자가 점검표" },
    { id: "mt-faq", label: "자주 묻는 질문 (FAQ)" },
  ],
  fairytale: [
    { id: "eb-overview", label: "서비스 소개 개요" },
    { id: "steps", label: "동화책 제작 단계", isHeader: true },
    { id: "eb-step1", label: "1단계. 방식 및 영어 난이도 설정" },
    { id: "eb-step2", label: "2단계. 대본/그림 프롬프트 조립" },
    { id: "eb-step3", label: "3단계. 레이아웃 모드 지정" },
    { id: "eb-step4", label: "4단계. 이미지 자동 재단 및 합성" },
    { id: "tools", label: "유용한 도구", isHeader: true },
    { id: "eb-checklist", label: "제작 전 자가 점검표" },
    { id: "eb-faq", label: "자주 묻는 질문 (FAQ)" },
  ],
  ppt: [
    { id: "ppt-overview", label: "서비스 소개 개요" },
    { id: "steps", label: "제안서 생성 단계", isHeader: true },
    { id: "ppt-step1", label: "1단계. 작업 모드 및 문서 유형 선택" },
    { id: "ppt-step2", label: "2단계. 제안 원고 및 멀티 파일 업로드" },
    { id: "ppt-step3", label: "3단계. 대상 지정 및 추가 지시 주입" },
    { id: "ppt-step4", label: "4단계. 독립형 HTML 슬라이드 생성" },
    { id: "ppt-step5", label: "5단계. AI 에디터 활용 및 제안서 리터칭" },
    { id: "tools", label: "유용한 도구", isHeader: true },
    { id: "ppt-checklist", label: "생성 전 자가 점검표" },
    { id: "ppt-faq", label: "자주 묻는 질문 (FAQ)" },
  ],
};

/**
 * 이용 가이드 실제 데이터 (콘텐츠 마이그레이션용)
 */
export const GUIDE_DATA: Partial<Record<GuideCategoryId, GuideService>> = {
  newsletter: {
    id: "newsletter",
    title: "뉴스레터 발송 서비스",
    description: "네이버 블로그를 기반으로 고품질 소식지를 자동 생성하고 대량 발송합니다.",
    processFlow: {
      items: [
        { step: "01", title: "블로그 링크 입력", description: "3~8개의 네이버 블로그 주소 복사", targetId: "nl-step1" },
        { step: "02", title: "자동 변환 & 검수", description: "뉴스레터 화면 자동 생성 및 확인", targetId: "nl-step2" },
        { step: "03", title: "주소록 정리", description: "엑셀 파일 업로드 및 수신 그룹 지정", targetId: "nl-step3" },
        { step: "04", title: "원클릭 대량 발송", description: "개인 정보 보호 대량 이메일 즉시 전송", targetId: "nl-step4" },
      ],
    },
    sections: [
      {
        id: "nl-overview",
        title: "서비스 소개 개요",
        cards: [
          {
            id: "nl-intro",
            title: "에듀올랩 뉴스레터 플랫폼 소개",
            content: "네이버 블로그 글 주소를 뉴스레터 화면으로 자동 변환해 주는 통합 서비스입니다.",
          },
        ],
      },
      // 상세 단계는 Phase 2에서 데이터 추가 예정
    ],
    toc: GUIDE_TOC.newsletter,
  },
};

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
            content: "에듀올랩 교육 소식지 플랫폼은 \"네이버 블로그의 글 주소들을 입력하면 소식지(뉴스레터) 화면으로 자동 변환해 주며, 사전에 등록된 주소록 그룹원들에게 한 번에 대량으로 이메일을 안전하게 발송할 수 있는 통합 소식지 발송 서비스\"입니다.",
          },
        ],
      },
      {
        id: "nl-steps",
        title: "소식지 발행 단계",
        collapsible: true,
        cards: [
          {
            id: "nl-step1",
            title: "1단계. 뉴스레터 자동 생성",
            badge: "번호 클릭 안내",
            steps: [
              {
                title: "블로그 링크 목록 입력",
                description: "만들기 화면의 URL 목록에 네이버 블로그 링크 주소들을 입력합니다. 한 줄에 하나의 링크 주소만 들어가도록 엔터 키로 분리하여 최소 3개에서 최대 8개까지 삽입할 수 있습니다.",
                highlight: {
                  type: "info",
                  title: "주소 복사 미세 팁",
                  text: "인터넷 브라우저 맨 위의 주소창(예: https://blog.naver.com/...)을 통째로 복사해서 그대로 붙여넣어 주세요!",
                },
              },
              {
                title: "대표 배너 지정 (선택사항)",
                description: "소식지 맨 위에 가장 크게 보일 대표 메인 글 주소를 하나 지정합니다. 비워두면 목록 첫 번째 링크가 자동 적용됩니다.",
              },
              {
                title: "발행 월호 설정 및 중복 발송 방지",
                description: "해당 뉴스레터의 연도와 월을 지정합니다.",
                highlight: {
                  type: "warn",
                  title: "이전 호 중복 발송 방지 스마트 기능",
                  text: "실수로 과거에 보냈던 블로그 글 주소를 다시 입력하더라도 자동으로 제외 처리해 줍니다.",
                },
              },
              {
                title: "뉴스레터 만들기 실행",
                description: "하단의 [뉴스레터 만들기] 버튼을 누르면 이메일 화면이 바로 만들어집니다.",
              },
            ],
            image: {
              src: "/workportal/guide/newsletter_step1_links.png",
              alt: "1단계 블로그 링크 입력",
            },
          },
          {
            id: "nl-step2",
            title: "2단계. 미리보기 및 검수",
            steps: [
              { title: "실시간 화면 검수", description: "좌측 미리보기 화면에서 이메일이 실제로 발송되었을 때 어떻게 보이는지 확인합니다." },
              { title: "새 창에서 시원하게 크게 보기", description: "상단의 [새 탭] 버튼을 누르면 브라우저 새 창에서 전체 화면으로 살펴볼 수 있습니다." },
              { title: "이메일 본문 파일 저장", description: "상단의 [다운로드] 버튼을 누르면 뉴스레터 이메일 본문 파일(.html)이 즉시 저장됩니다." },
            ],
            image: {
              src: "/workportal/guide/newsletter_step2_preview.png",
              alt: "2단계 미리보기 검수",
            },
          },
        ],
      },
      {
        id: "nl-tools",
        title: "유용한 도구",
        cards: [
          {
            id: "nl-checklist",
            title: "발송 전 자가 점검표",
            checklist: [
              { id: 1, text: "네이버 블로그 글 주소(링크)가 최소 3개에서 8개 사이로 잘 구성되어 있나요?" },
              { id: 2, text: "이번에 보내는 '연도'와 '월호' 정보가 올바르게 선택되었나요?" },
              { id: 3, text: "미리보기 화면 및 [새 탭] 보기로 메일 레이아웃과 오탈자가 없는지 검수하셨나요?" },
              { id: 4, text: "업로드한 주소록 엑셀 파일(CSV)에 한글 이름이 깨지지 않고 정상 표시되나요?" },
              { id: 5, text: "보내고 싶지 않은 수신 대상의 [수신] 체크박스는 정상적으로 해제하셨나요?" },
            ],
          },
          {
            id: "nl-faq",
            title: "자주 묻는 질문 (FAQ)",
            faqs: [
              { id: 1, question: "네이버 블로그 글은 꼭 에듀올랩 블로그 글만 넣어야 하나요?", answer: "아닙니다! 어떤 글이든 정상적으로 링크를 복사하여 추가할 수 있습니다." },
              { id: 2, question: "블로그의 특정 글을 넣었더니 미리보기에 이미지가 안 보여요.", answer: "비공개 상태이거나 외부 이미지 무단 링크가 차단된 경우일 수 있습니다." },
            ],
          },
        ],
      },
    ],
    toc: GUIDE_TOC.newsletter,
  },
};

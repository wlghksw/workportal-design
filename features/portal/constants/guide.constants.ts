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
    { id: "nl-steps-header", label: "소식지 발행 단계", isHeader: true },
    { id: "nl-step1", label: "1단계. 소식지 자동 변환" },
    { id: "nl-step2", label: "2단계. 화면 미리보기 검수" },
    { id: "nl-step3", label: "3단계. 수신 주소록 가져오기" },
    { id: "nl-step4", label: "4단계. 최종 메일 대량 발송" },
    { id: "nl-tools-header", label: "유용한 도구", isHeader: true },
    { id: "nl-checklist", label: "발송 전 자가 점검표" },
    { id: "nl-faq", label: "자주 묻는 질문 (FAQ)" },
  ],
  meeting: [
    { id: "mt-overview", label: "회의록 자동화 개요" },
    { id: "mt-steps-header", label: "회의록 분석 단계", isHeader: true },
    { id: "mt-step1", label: "1단계. 회의 메타 정보 입력" },
    { id: "mt-step2", label: "2단계. 음성 녹음 및 파일 준비" },
    { id: "mt-step3", label: "3단계. AI 회의록 분석 및 공유" },
    { id: "mt-step4", label: "4단계. 최근 회의 히스토리 관리" },
    { id: "mt-tools-header", label: "유용한 도구", isHeader: true },
    { id: "mt-checklist", label: "제작 전 자가 점검표" },
    { id: "mt-faq", label: "자주 묻는 질문 (FAQ)" },
  ],
  fairytale: [
    { id: "eb-overview", label: "서비스 소개 개요" },
    { id: "eb-steps-header", label: "동화책 제작 단계", isHeader: true },
    { id: "eb-step1", label: "1단계. 방식 및 영어 난이도 설정" },
    { id: "eb-step2", label: "2단계. 대본/그림 프롬프트 조립" },
    { id: "eb-step3", label: "3단계. 레이아웃 모드 지정" },
    { id: "eb-step4", label: "4단계. 이미지 자동 재단 및 합성" },
    { id: "eb-tools-header", label: "유용한 도구", isHeader: true },
    { id: "eb-checklist", label: "제작 전 자가 점검표" },
    { id: "eb-faq", label: "자주 묻는 질문 (FAQ)" },
  ],
  ppt: [
    { id: "ppt-overview", label: "서비스 소개 개요" },
    { id: "ppt-steps-header", label: "제안서 생성 단계", isHeader: true },
    { id: "ppt-step1", label: "1단계. 작업 모드 및 문서 유형 선택" },
    { id: "ppt-step2", label: "2단계. 제안 원고 및 멀티 파일 업로드" },
    { id: "ppt-step3", label: "3단계. 대상 지정 및 추가 지시 주입" },
    { id: "ppt-step4", label: "4단계. 독립형 HTML 슬라이드 생성" },
    { id: "ppt-step5", label: "5단계. AI 에디터 활용 및 제안서 리터칭" },
    { id: "ppt-tools-header", label: "유용한 도구", isHeader: true },
    { id: "ppt-checklist", label: "생성 전 자가 점검표" },
    { id: "ppt-faq", label: "자주 묻는 질문 (FAQ)" },
  ],
};

/**
 * 이용 가이드 실제 데이터 (콘텐츠 마이그레이션용)
 */
export const GUIDE_DATA: Record<GuideCategoryId, GuideService> = {
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
        id: "nl-steps-header",
        title: "소식지 발행 단계",
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
          {
            id: "nl-step3",
            title: "3단계. 수신 주소록 가져오기",
            steps: [
              { title: "엑셀(CSV) 주소록 파일 가져오기", description: "연락처 엑셀 파일을 업로드해 수백 명의 수신인 정보를 빠르게 등록합니다." },
              { title: "수신 그룹 지정 및 분류", description: "새 그룹 이름을 입력하고 그룹을 만들어 수신자들을 분류합니다." },
              { title: "메일 발송 여부 개별 제어", description: "이름 옆의 체크박스를 통해 특정 수신자를 이번 발송에서 제외할 수 있습니다." },
            ],
          },
          {
            id: "nl-step4",
            title: "4단계. 최종 메일 대량 발송",
            steps: [
              { title: "공식 발송 정보 확인", description: "발신 계정과 총 수신 인원을 최종 확인합니다." },
              { title: "뉴스레터를 수령할 발송 그룹 선택", description: "이번에 메일을 전송할 그룹들을 체크박스로 선택합니다." },
              { title: "안전한 숨은 참조(BCC) 대량 발송", description: "메일 발행 버튼을 누르면 모든 수신자가 숨은 참조로 처리되어 발송됩니다." },
            ],
          },
        ],
      },
      {
        id: "nl-tools-header",
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
              { id: 1, question: "네이버 블로그 글은 꼭 에듀올랩 블로그 글만 넣어야 하나요?", answer: "아닙니다! 에듀올랩 공식 블로그 외에도 유용한 네이버 블로그 글이라면 어떤 것이든 링크를 추가할 수 있습니다." },
              { id: 2, question: "블로그의 특정 글을 넣었더니 미리보기에 이미지가 안 보여요.", answer: "네이버 블로그 게시글이 비공개 상태이거나, 외부 이미지 링크가 차단된 경우일 수 있습니다. '전체 공개' 상태인지 확인해 주세요." },
              { id: 3, question: "엑셀을 올렸더니 글자가 이상한 기호로 깨집니다.", answer: "엑셀 저장 시 파일 형식을 'CSV UTF-8 (쉼표로 분리)'로 선택하여 저장한 뒤 다시 업로드해 주세요." },
              { id: 4, question: "메일을 실수로 잘못 보냈어요! 전송 취소가 가능한가요?", answer: "한 번 전송된 대량 메일은 시스템 특성상 취소가 불가능합니다. 발송 전 자가 점검표를 통해 최종 확인을 권장합니다." },
            ],
          },
        ],
      },
    ],
    toc: GUIDE_TOC.newsletter,
  },
  meeting: {
    id: "meeting",
    title: "회의록 자동화 서비스",
    description: "음성 녹음 및 파일을 분석하여 회의록 요약문을 자동 생성하고 Teams에 공유합니다.",
    processFlow: {
      items: [
        { step: "01", title: "회의 메타 입력", description: "제목, 참석자, 장소, Teams 채널 선택", targetId: "mt-step1" },
        { step: "02", title: "음성 녹음 및 파일", description: "실시간 녹음 또는 녹음 파일 추가", targetId: "mt-step2" },
        { step: "03", title: "AI 회의록 자동 분석", description: "음성 텍스트 변환 및 회의록 요약", targetId: "mt-step3" },
        { step: "04", title: "Teams 및 히스토리", description: "Teams 채널 즉시 공유 및 내역 조회", targetId: "mt-step4" },
      ],
    },
    sections: [
      {
        id: "mt-overview",
        title: "서비스 소개 개요",
        cards: [
          {
            id: "mt-intro",
            title: "에듀올랩 회의록 자동화 플랫폼 소개",
            content: "에듀올랩 회의록 자동화 플랫폼은 \"실시간 회의 녹음 또는 녹음 파일들을 업로드하면 AI가 음성을 분석하여 회의록 요약문을 생성하고, Microsoft Teams에 자동으로 공유 및 보관해주는 비서 솔루션\"입니다.",
            image: {
              src: "/workportal/guide/meeting_dashboard.png",
              alt: "회의록 자동화 대시보드",
            },
          },
        ],
      },
      {
        id: "mt-steps-header",
        title: "회의록 분석 단계",
        cards: [
          {
            id: "mt-step1",
            title: "1단계. 회의 메타 정보 입력",
            steps: [
              { title: "회의 제목 및 날짜/장소 기입", description: "회의 성격에 맞게 제목, 날짜, 장소를 입력합니다." },
              { title: "참석자 목록 입력", description: "참석자들을 쉼표(,)로 구분하여 입력합니다. AI가 발화자 구분 기초 정보로 활용합니다." },
              { title: "Teams 공유 채널 선택", description: "회의록 요약본을 실시간으로 공유받을 부서별 채널을 선택합니다." },
            ],
          },
          {
            id: "mt-step2",
            title: "2단계. 음성 녹음 및 파일 준비",
            steps: [
              { title: "방법 A. 실시간 '직접 녹음'", description: "마이크 버튼을 클릭하여 실시간으로 회의를 녹음합니다." },
              { title: "방법 B. '파일 업로드'", description: "기존에 저장된 m4a, mp3, wav 파일 등을 드래그하여 업로드합니다." },
              { title: "스마트 오디오 파일 자동 병합", description: "여러 개로 나뉜 파일들을 올리고 순서를 조절하면 하나의 회의록으로 합쳐집니다." },
            ],
            image: {
              src: "/workportal/guide/meeting_step2.png",
              alt: "2단계 음성 녹음 및 파일 업로드",
            },
          },
          {
            id: "mt-step3",
            title: "3단계. AI 회의록 분석 및 공유",
            steps: [
              { title: "보안 업로드 실행", description: "[회의록 생성 & Teams 공유] 버튼을 눌러 데이터를 안전하게 전송합니다." },
              { title: "실시간 AI 작업 상태 확인", description: "stt(텍스트 변환), summarize(요약), teams(공유) 단계를 실시간으로 모니터링합니다." },
              { title: "회의록 완성 및 품질 확인", description: "완성된 요약문 텍스트를 확인하고 필요시 품질 경고 문구를 참고하여 보정합니다." },
            ],
          },
          {
            id: "mt-step4",
            title: "4단계. 최근 회의 히스토리 관리",
            steps: [
              { title: "브라우저 자동 저장 활용", description: "사이드바에 최대 50개까지 저장된 최근 회의 목록을 확인합니다." },
              { title: "원클릭 로드 및 복사", description: "목록에서 제목을 클릭하면 당시 입력 정보와 요약 텍스트가 즉시 복구됩니다." },
            ],
          },
        ],
      },
      {
        id: "mt-tools-header",
        title: "유용한 도구",
        cards: [
          {
            id: "mt-checklist",
            title: "제작 전 자가 점검표",
            checklist: [
              { id: 1, text: "직접 녹음 시 브라우저 마이크 권한 [허용]을 클릭하셨나요?" },
              { id: 2, text: "회의 날짜, 장소, 참석자 목록을 정확히 기입하셨나요?" },
              { id: 3, text: "요약본이 전송될 Microsoft Teams 수신 [공유 팀]을 선택하셨나요?" },
              { id: 4, text: "업로드할 개별 오디오 파일 용량이 1GB 미만인지 확인하셨나요?" },
              { id: 5, text: "분할 오디오 파일의 순서가 실제 회의 흐름과 맞게 배치되었나요?" },
            ],
          },
          {
            id: "mt-faq",
            title: "자주 묻는 질문 (FAQ)",
            faqs: [
              { id: 1, question: "노트북이 잠금화면으로 넘어가도 녹음이 계속되나요?", answer: "절전 모드나 잠금화면 진입 시 브라우저 녹음이 중단될 수 있으므로, PC 설정에서 절전 시간을 넉넉히 늘려주세요." },
              { id: 2, question: "Teams 채널로 요약 텍스트가 발송되지 않습니다.", answer: "채널 웹훅 설정 문제일 수 있습니다. 이 경우 완성된 텍스트를 직접 복사하여 Teams에 공유해 주세요." },
              { id: 3, question: "녹음 음질이 정확도에 영향을 미치나요?", answer: "네, 주변 소음이나 마이크 거리에 따라 AI 분석 정확도가 달라질 수 있습니다. 또박또박 이야기하는 환경이 좋습니다." },
            ],
          },
        ],
      },
    ],
    toc: GUIDE_TOC.meeting,
  },
  fairytale: {
    id: "fairytale",
    title: "E-Book 동화책 서비스",
    description: "AI를 활용하여 영어 동화 대본과 삽화를 생성하고 고품질 E-Book으로 제작합니다.",
    processFlow: {
      items: [
        { step: "01", title: "방식 & 난이도 설정", description: "제목 입력 혹은 스토리 본문 입력 & 수준 설정", targetId: "eb-step1" },
        { step: "02", title: "프롬프트 조립 & 생성", description: "대본(JSON) 생성과 16칸 삽화 이미지 획득", targetId: "eb-step2" },
        { step: "03", title: "레이아웃 지정", description: "낱장, 2장 펼침, 3장 펼침 중 선택", targetId: "eb-step3" },
        { step: "04", title: "HQ 자동 분할 & 합성", description: "고해상도 재단 및 영어 대본 합성 완료", targetId: "eb-step4" },
      ],
    },
    sections: [
      {
        id: "eb-overview",
        title: "서비스 소개 개요",
        cards: [
          {
            id: "eb-intro",
            title: "에듀올랩 E-Book 동화책 자동화 소개",
            content: "에듀올랩 E-Book 동화책 플랫폼은 \"동화 제목이나 줄거리만 입력하면 AI가 16장면 영어 대본과 삽화 프롬프트를 빌드해주고, 이를 1024px HQ 화질로 자동 정밀 컷팅 및 합성해주는 디지털 동화 제작 비서\"입니다.",
            image: {
              src: "/workportal/guide/ebook_overview.png",
              alt: "E-Book 동화책 제작 흐름",
            },
          },
        ],
      },
      {
        id: "eb-steps-header",
        title: "동화책 제작 단계",
        cards: [
          {
            id: "eb-step1",
            title: "1단계. 방식 및 영어 난이도 설정",
            steps: [
              { title: "생성 방식 선택 (제목 vs 완성 스토리)", description: "[동화 제목으로 생성]은 AI가 자동 창작하며, [완성된 동화로 생성]은 기획된 원문을 분석합니다." },
              { title: "영어 학습 수준 선택", description: "유치원, 초등 저학년, 초등 고학년 등 3개 등급에 맞춰 영어 문장 난이도가 재설계됩니다." },
            ],
            image: {
              src: "/workportal/guide/ebook_step1.png",
              alt: "1단계 방식 및 난이도 설정",
            },
          },
          {
            id: "eb-step2",
            title: "2단계. 대본/그림 프롬프트 조립 & 생성",
            steps: [
              { title: "대본 프롬프트 활용", description: "프롬프트를 복사하여 ChatGPT에 입력하면 16장면 JSON 영어 대본이 생성됩니다." },
              { title: "그림 프롬프트 및 삽화 획득", description: "그림 프롬프트를 DALL-E에 입력하여 일관성 있는 16칸 그리드 삽화 1장을 받아옵니다." },
            ],
            image: {
              src: "/workportal/guide/ebook_step2.png",
              alt: "2단계 프롬프트 빌더",
            },
          },
          {
            id: "eb-step3",
            title: "3단계. 레이아웃 모드 지정 및 이미지 업로드",
            steps: [
              { title: "3종 레이아웃 모드 선택", description: "낱장(16장), 2장 펼침, 3장 펼침 중 제본 목적에 맞는 모드를 선택합니다." },
              { title: "16칸 그리드 이미지 업로드", description: "DALL-E에서 생성한 4x4 일러스트 원본을 업로드합니다." },
            ],
            image: {
              src: "/workportal/guide/ebook_step3.png",
              alt: "3단계 레이아웃 모드 및 업로드",
            },
          },
          {
            id: "eb-step4",
            title: "4단계. 이미지 자동 재단 및 영어 대본 합성",
            steps: [
              { title: "지능형 재단 및 합성", description: "업로드 즉시 16등분으로 정밀 재단되어 1024px 고품질 삽화로 분리됩니다." },
              { title: "대본 수정 및 다운로드", description: "장면별 대본을 직접 수정하고 결과물을 ZIP 파일로 일괄 다운로드합니다." },
            ],
            image: {
              src: "/workportal/guide/ebook_step4.png",
              alt: "4단계 AI 동화 편집기",
            },
          },
        ],
      },
      {
        id: "eb-tools-header",
        title: "유용한 도구",
        cards: [
          {
            id: "eb-checklist",
            title: "제작 전 자가 점검표",
            checklist: [
              { id: 1, text: "동화 타겟 연령에 적합한 [영어 난이도]가 지정되어 있나요?" },
              { id: 2, text: "일러스트에 이질적인 외곽선이나 문자 글씨가 포함되진 않았나요?" },
              { id: 3, text: "하단 대본 박스의 JSON 텍스트 형식이 16장면으로 딱 맞나요?" },
              { id: 4, text: "목적에 맞는 레이아웃 모드가 정상 선택되었나요?" },
            ],
          },
          {
            id: "eb-faq",
            title: "자주 묻는 질문 (FAQ)",
            faqs: [
              { id: 1, question: "OpenAI API Key가 없으면 제작이 불가능한가요?", answer: "아닙니다! 프롬프트만 복사하여 무료 ChatGPT 사이트에서 생성해온 자료를 업로드해도 동일하게 제작 가능합니다." },
              { id: 2, question: "그림이 16칸 균등 분할이 아니고 다르게 나옵니다.", answer: "AI의 해석 오류일 수 있습니다. 'exactly 4x4 grid consisting of 16 separate boxes'라고 추가 명령을 주어 교정하세요." },
            ],
          },
        ],
      },
    ],
    toc: GUIDE_TOC.fairytale,
  },
  ppt: {
    id: "ppt",
    title: "PPT 제안서 메이커",
    description: "원본 문서와 이미지를 분석하여 전문가 수준의 제안서 슬라이드를 자동 생성합니다.",
    processFlow: {
      items: [
        { step: "01", title: "작업 모드 선택", description: "신규 창작 vs 기존 PPT에 추가 병합 지정", targetId: "ppt-step1" },
        { step: "02", title: "멀티자료 업로드", description: "기획서 텍스트와 실물 이미지 통합 업로드", targetId: "ppt-step2" },
        { step: "03", title: "대상 & 지시 주입", description: "타겟 고객군 선택 및 맞춤 지시문 기입", targetId: "ppt-step3" },
        { step: "04", title: "독립형 HTML 획득", description: "선명한 웹 슬라이드 원클릭 획득", targetId: "ppt-step4" },
      ],
    },
    sections: [
      {
        id: "ppt-overview",
        title: "서비스 소개 개요",
        cards: [
          {
            id: "ppt-intro",
            title: "에듀올랩 PPT 제안서 메이커 소개",
            content: "에듀올랩 AI Generator는 원본 문서와 이미지를 종합 분석하여, 에듀올랩 고유의 수주 디자인 규격이 내장된 '독립형 고품질 HTML 웹 슬라이드'로 변환해주는 서비스입니다.",
            image: {
              src: "/workportal/guide/ppt_dashboard.png",
              alt: "PPT 제안서 메이커 대시보드",
            },
          },
        ],
      },
      {
        id: "ppt-steps-header",
        title: "제안서 생성 단계",
        cards: [
          {
            id: "ppt-step1",
            title: "1단계. 작업 모드 및 문서 유형 선택",
            steps: [
              { title: "작업 모드 (신규 생성 vs 기존 추가 병합)", description: "[기존 PPT에 추가 병합] 모드는 기존 디자인 톤을 모방하여 이어 붙여줍니다." },
              { title: "제안서 유형 분류 (B2B 제안서 vs 서면 보고서)", description: "슬라이드 쇼 형태의 웹 슬라이드 또는 정갈한 서면 보고서 중 선택합니다." },
            ],
          },
          {
            id: "ppt-step2",
            title: "2단계. 제안 원고 및 멀티 파일 업로드",
            steps: [
              { title: "텍스트와 이미지 통합 업로드", description: "PDF, DOCX 원고와 JPG 교구 이미지를 한꺼번에 올려 AI 비전 분석을 유도합니다." },
              { title: "기존 PPT 추가 병합 시 요령", description: "기준이 될 원본 .pptx 파일과 추가할 원천 문서를 각각 지정 업로드합니다." },
            ],
            image: {
              src: "/workportal/guide/ppt_step_input.png",
              alt: "2단계 파일 업로드",
            },
          },
          {
            id: "ppt-step3",
            title: "3단계. 대상 지정 및 추가 지시 주입",
            steps: [
              { title: "대상 고객군 타겟팅", description: "투자·사업계획 등 수신자 유형을 지정하거나 자동 감지되도록 둡니다." },
              { title: "5대 수주 및 디자인 규정", description: "에듀올랩 그레이시 블루 캔버스, 입체 섀도우 카드 등 전문가 규격이 자동 주입됩니다." },
            ],
          },
          {
            id: "ppt-step4",
            title: "4단계. 독립형 HTML 슬라이드 생성",
            steps: [
              { title: "3단계 실시간 상태 모니터링", description: "분석, 구조 설계, 렌더링 과정을 실시간으로 추적합니다." },
              { title: "독립형 HTML 웹 슬라이드 획득", description: "완료 후 [웹 슬라이드 열기]를 통해 선명한 슬라이드 쇼를 즉시 가동합니다." },
            ],
          },
          {
            id: "ppt-step5",
            title: "5단계. AI 에디터 활용 및 제안서 리터칭",
            steps: [
              { title: "AI 대화형 리디자인", description: "어시스턴트에게 자연어로 레이아웃 변경이나 문구 수정을 요청합니다." },
              { title: "직접 수동 수정 및 제어", description: "폼 에디터에서 대제목, 본문 리스트, 레이아웃 형식을 직접 변경합니다." },
              { title: "최종 포맷 다운로드", description: "독립형 HTML 웹페이지 또는 오프라인 PPTX 파일로 저장합니다." },
            ],
          },
        ],
      },
      {
        id: "ppt-tools-header",
        title: "유용한 도구",
        cards: [
          {
            id: "ppt-checklist",
            title: "생성 전 자가 점검표",
            checklist: [
              { id: 1, text: "문장 끝맺음이 공적 입찰 문법인 '명사형 종결어미'로 통일되었나요?" },
              { id: 2, text: "추가 병합 시 원본 PPTX의 디자인 형식이 잘 유지되었나요?" },
              { id: 3, text: "신뢰도 사수를 위해 다크배경이나 이모지가 금지되어 있나요?" },
              { id: 4, text: "교구 실물 이미지나 핵심 도표가 적절히 배치되었나요?" },
            ],
          },
          {
            id: "ppt-faq",
            title: "자주 묻는 질문 (FAQ)",
            faqs: [
              { id: 1, question: "기존 PPT의 디자인을 AI가 그대로 흉내 내 주나요?", answer: "네, 배경 색상, 로고 위치, 폰트 비율 등을 비전 분석하여 일관성 있게 연장 생성합니다." },
              { id: 2, question: "학교·방과후 고객군을 선택하고 싶을 땐 어떻게 하나요?", answer: "드롭다운을 '선택 안 함'으로 두고 추가 지시사항에 수신 대상을 명시하면 AI가 맞춰서 튜닝합니다." },
            ],
          },
        ],
      },
    ],
    toc: GUIDE_TOC.ppt,
  },
};

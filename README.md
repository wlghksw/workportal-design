# Integration Platform — Design Share

에듀올랩 통합 플랫폼 **전체 프로그램의 UI/디자인 협업용** 공개 저장소입니다.

서버·DB·배포·API 로직은 제외하고, **화면(HTML/CSS/JS)과 디자인 자산**만 포함합니다.

## 포함된 프로그램

| 폴더 | 프로그램 | 미리보기 진입점 |
|------|----------|----------------|
| `services/workportal/` | 통합 업무 포탈 + 이용 가이드 | `guide.html`, `index.html` |
| `services/ppt/` | AI PPT 제안서 메이커 | `templates/index.html`, `templates/editor.html` |
| `services/ebook/` | AI E-Book 동화 | `index.html` |
| `services/meeting/` | 회의록 자동화 | `ui-page.html` |
| `services/newsletter/` | 교육 뉴스레터 | `web/index.html`, `template.html` |
| `services/news-api/` | 뉴스 수집 목록 UI | `preview.html` |
| `services/bidding/` | 입찰 공고 모니터링 | `index.php`, `search.php` |
| `services/dashboard/` | 크레용스쿨 대시보드 (React) | `index.html` + `src/` |
| `services/website/` | 플랫포머즈 마케팅 사이트 | `index.php` |
| `shared/` | 공통 헤더·로고 | `portal-header.css` |

## 로컬 미리보기

각 서비스 폴더에서 정적 서버를 실행합니다.

```bash
# 예: 이용 가이드
npx serve services/workportal -p 3000
# → http://localhost:3000/guide.html

# 예: PPT
npx serve services/ppt -p 3001
# → http://localhost:3001/templates/index.html

# 예: E-Book
npx serve services/ebook -p 3002

# 예: 회의록
npx serve services/meeting -p 3003

# 예: 뉴스레터 웹앱
npx serve services/newsletter/web -p 3004

# 예: 대시보드 (React — npm 필요)
cd services/dashboard && npm install && npm run dev
```

## 협업 범위 (가능)

- 레이아웃, 색상, 타이포, 컴포넌트 스타일
- 가이드 핫스팟(번호 클릭 영역) UI
- 이메일 템플릿 HTML/CSS
- 반응형·다크모드 등 프론트 디자인

## 제외된 항목 (불가 / 미포함)

- Python/Node 백엔드 (`server.js`, `app.py`, `main.py` 로직)
- DB, 사용자 인증, API Key
- nginx, systemd, deploy 스크립트
- `.env`, 운영 서버 설정

> **기능(API 호출, 로그인, 데이터 저장)은 동작하지 않습니다.**  
> 디자인 수정·화면 확인 목적입니다.

## 폴더 구조

```
├── shared/                 # 공통 헤더·로고
└── services/
    ├── workportal/         # 포탈 + guide.html
    ├── ppt/
    ├── ebook/
    ├── meeting/
    ├── newsletter/
    ├── news-api/
    ├── bidding/
    ├── dashboard/
    └── website/
```

## 운영 저장소와의 관계

| 저장소 | 용도 |
|--------|------|
| [platformers2026/WorkPortal](https://github.com/platformers2026/WorkPortal) | 운영 배포 (private) |
| **이 저장소** | 디자인 협업 (public) |

디자인 개선안은 이 저장소에서 PR → 검토 후 운영 저장소에 선택 반영합니다.

## 주의사항

- `services/bidding/*.php`, `services/website/*.php`는 PHP+HTML 혼합 파일입니다. 마크업/CSS 위주로 수정하세요.
- `services/dashboard/`는 React(Vite) 프로젝트입니다. `npm run dev`로 확인하세요.
- `services/ebook/index.html`은 백엔드에서 추출한 SPA 화면입니다. API는 모킹되지 않아 일부 버튼은 동작하지 않을 수 있습니다.

# Integration Platform — Design Share

에듀올랩 통합 플랫폼 **전체 프로그램의 UI/디자인 협업용** 공개 저장소입니다.

서버·DB·배포·API 로직은 제외하고, **화면(HTML/CSS/JS)과 디자인 자산**만 포함합니다.

---
## 프로젝트 실행 방식

현재 프로젝트는 **기존 정적 HTML 기반 서비스**와 **새로운 Next.js 플랫폼**이 공존하는 과도기 상태입니다. 목적에 맞는 명령어를 선택하세요.

### 1. Next.js 플랫폼 (추천 - 개발 중인 새 플랫폼)

마이그레이션이 진행 중인 React + TypeScript 기반의 현대적 플랫폼입니다.

```bash
pnpm install
pnpm dev
```
- **URL**: [http://localhost:3000](http://localhost:3000)
- **주요 기능**: 통합 업무 포탈(Home), 공통 React 컴포넌트 라이브러리
- **API 연동**: `.env.local` 파일을 생성하고 `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` 설정을 추가하면 백엔드 기능을 활용할 수 있습니다. (예시는 `.env.example` 참고)

### 2. 레거시 정적 미리보기 (기존 HTML/CSS 수정용)

기존에 작성된 정적 HTML 파일들을 로컬 정적 서버에서 확인할 때 사용합니다.

```bash
pnpm install
pnpm preview
```
- **URL**: [http://localhost:3000/preview.html](http://localhost:3000/preview.html)
- **주요 기능**: 개별 서비스(뉴스레터, PPT, 회의록 등)의 기존 HTML/CSS 레이아웃 확인
- **주의**: API 호출이나 로그인 기능은 동작하지 않습니다.

---

## 사전 준비 (UI 수정 전 필수)

| 항목 | 설명 |
|------|------|
| [Node.js](https://nodejs.org/) **18 이상** | `pnpm dev`, `pnpm preview` 실행에 필요 |
| [Git](https://git-scm.com/) | 저장소 clone 및 PR 제출에 필요 |
| 코드 에디터 | VS Code, Cursor 등 아무거나 가능 |
| 브라우저 | Chrome, Safari 등 최신 브라우저 |

### 처음 시작하기

```bash
git clone https://github.com/wlghksw/workportal-design.git
cd workportal-design
pnpm install
pnpm dev
```

브라우저에서 **[http://localhost:3000](http://localhost:3000)** 을 열면 마이그레이션된 새 포털 홈을 확인할 수 있습니다.

> 레거시 정적 미리보기 목록(`preview.html`)을 확인하려면 별도로 `pnpm preview`를 실행한 후 **[http://localhost:3000/preview.html](http://localhost:3000/preview.html)** 에 접속하세요.

### 작업 흐름

1. 아래 표에서 수정할 **화면 → 파일 경로** 확인
2. 에디터에서 HTML/CSS 파일 수정
3. 브라우저 **새로고침**으로 변경 확인
4. 서버 종료: `Ctrl+C`

### 주의사항

- HTML 파일을 **더블클릭(`file://`)으로 열면 CSS가 깨집니다.** 반드시 `pnpm dev` 또는 `pnpm preview` 실행 후 브라우저에서 접속하세요.
- **API·로그인·저장 기능은 동작하지 않습니다.** 버튼 클릭 오류는 무시하고 레이아웃·색상·폰트만 확인하세요.
- 한 번에 여러 화면을 볼 필요 없으면 `pnpm preview` 하나만 켜두면 됩니다.

---

## 화면별 UI 수정 가이드

수정하려는 화면의 **미리보기 URL**과 **편집할 파일**을 아래에서 찾으세요.

### 공통 (모든 서비스 상단 헤더)

| 미리보기 | 수정 파일 |
|----------|-----------|
| (각 서비스 화면 상단) | `shared/portal-header.css` — 헤더·네비 스타일 |
| | `shared/portal-header.js` — 로그인 버튼 동작 (운영 API 연동) |
| | `shared/eduallab-logo.png` — 로고 이미지 |

### 이용 가이드

| 미리보기 URL | 수정 파일 |
|--------------|-----------|
| http://localhost:3000/services/workportal/guide.html | `services/workportal/guide.html` — 본문·핫스팟·인라인 스타일 |
| | `services/workportal/assets/portal-header.css` — 가이드 전용 헤더 |
| | `services/workportal/guide-assets/` — 가이드 스크린샷 이미지 |

### 통합 업무 포탈 (홈)

| 미리보기 URL | 수정 파일 |
|--------------|-----------|
| http://localhost:3000/services/workportal/index.html | `services/workportal/index.html` — 홈 레이아웃 |
| | `services/workportal/styles.css` — 포탈 전체 스타일 |
| | `services/workportal/app.js` — 카드·탭 동작 (UI 구조) |
| | `services/workportal/login.html` — 로그인 화면 |

### 교육 뉴스레터

| 미리보기 URL | 수정 파일 |
|--------------|-----------|
| http://localhost:3000/services/newsletter/web/index.html | `services/newsletter/web/index.html` — 웹앱 화면 구조 |
| | `services/newsletter/web/static/theme.css` — **메인 스타일시트** |
| | `services/newsletter/web/static/app.js` — 탭·폼 UI 동작 |
| | `services/newsletter/template.html` — 발송용 이메일 HTML 템플릿 |
| | `services/newsletter/template_outlook.html` — Outlook용 템플릿 |

### AI PPT 제안서

| 미리보기 URL | 수정 파일 |
|--------------|-----------|
| http://localhost:3000/services/ppt/templates/index.html | `services/ppt/templates/index.html` — 입력 화면 (인라인 스타일 포함) |
| http://localhost:3000/services/ppt/templates/editor.html | `services/ppt/templates/editor.html` — 에디터 화면 |
| | `services/ppt/css/presentation.css` — 슬라이드 공통 스타일 |
| | `services/ppt/css/presentation_white.css` — 화이트 테마 |
| | `services/ppt/css/presentation_crayon.css` — 크레용 테마 |
| | `services/ppt/PPT_Design_Guidelines.md` — PPT 디자인 규격 |

### AI E-Book 동화

| 미리보기 URL | 수정 파일 |
|--------------|-----------|
| http://localhost:3000/services/ebook/index.html | `services/ebook/index.html` — 전체 화면 (인라인 `<style>` 포함) |

### 회의록 자동화

| 미리보기 URL | 수정 파일 |
|--------------|-----------|
| http://localhost:3000/services/meeting/ui-page.html | `services/meeting/ui-page.html` — 화면 구조·인라인 스크립트 |
| | `services/meeting/theme-light.css` — **메인 스타일시트** |

### 뉴스 수집 목록

| 미리보기 URL | 수정 파일 |
|--------------|-----------|
| http://localhost:3000/services/news-api/preview.html | `services/news-api/preview.html` — 카드 목록 UI (인라인 스타일) |

### 크레용스쿨 대시보드 (React — 별도 실행)

```bash
cd services/dashboard
npm install
npm run dev
```

| 수정 파일 | 설명 |
|-----------|------|
| `services/dashboard/src/App.jsx` | 앱 레이아웃 |
| `services/dashboard/src/index.css` | Tailwind·전역 스타일 |
| `services/dashboard/src/components/` | 리포트·스펙 컴포넌트 |
| `services/dashboard/public/reports/*.html` | 정적 리포트 HTML |

### 입찰 공고 / 마케팅 사이트 (PHP)

| 폴더 | 수정 파일 |
|------|-----------|
| `services/bidding/` | `index.php`, `search.php` — HTML/CSS 마크업 위주 |
| `services/website/` | `index.php`, `contact.php` 등 + `static/css/main.css` |

> PHP 파일은 `pnpm preview`로 정적 미리보기만 가능합니다. PHP 렌더링은 별도 서버가 필요합니다.

---

## 미리보기 URL 한눈에 보기

| 화면 | URL |
|------|-----|
| **시작 페이지 (목록)** | http://localhost:3000/preview.html |
| 이용 가이드 | http://localhost:3000/services/workportal/guide.html |
| 통합 포탈 | http://localhost:3000/services/workportal/index.html |
| 뉴스레터 | http://localhost:3000/services/newsletter/web/index.html |
| PPT | http://localhost:3000/services/ppt/templates/index.html |
| E-Book | http://localhost:3000/services/ebook/index.html |
| 회의록 | http://localhost:3000/services/meeting/ui-page.html |
| 뉴스 수집 | http://localhost:3000/services/news-api/preview.html |

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

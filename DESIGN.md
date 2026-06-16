# WorkPortal DESIGN.md

## 1. Visual Theme & Atmosphere

전체 UI는 다음 분위기를 기준으로 한다.

- 깔끔하고 정돈된 업무용 SaaS UI
- Toss 스타일에 가까운 밝고 명확한 인터페이스
- 과한 장식보다 읽기 쉬운 정보 구조 우선
- 카드 기반 레이아웃
- 충분한 여백과 명확한 계층 구조
- 주요 액션은 파란색 primary 컬러로 강조
- 위험 액션은 빨간색 danger 계열로 제한적으로 사용
- 서비스별 개성은 허용하되, 기본 UI 토큰은 공통 기준을 따른다

디자인의 핵심 방향은 다음과 같다.

```txt
단순함
일관성
명확한 상태 표현
점진적 마이그레이션 가능성
React / Next.js 컴포넌트화 가능성
```

기존 HTML/CSS 기반 서비스는 공통 디자인 토큰을 먼저 적용한 뒤, React + TypeScript + Next.js 구조로 점진적으로 이전한다.

---

## 2. Color Palette & Roles

색상은 `shared/colors.css`에서 한 번만 정의한다.

각 서비스는 실제 hex color를 직접 사용하지 않고, 다음과 같은 공통 semantic token을 사용한다.

```txt
--primary
--background
--surface
--text
--border
--success
--warning
--danger
```

### 2.1 Primitive Colors

Primitive Color는 실제 색상 팔레트다.  
UI에서는 가능하면 primitive color를 직접 사용하지 않고, semantic color를 통해 사용한다.

```css
:root {
  /* Blue */
  --blue-50: #e8f3ff;
  --blue-100: #c9e2ff;
  --blue-200: #90c2ff;
  --blue-500: #3182f6;
  --blue-600: #1b64da;
  --blue-700: #1957c2;

  /* Gray */
  --gray-0: #ffffff;
  --gray-50: #f9fafb;
  --gray-100: #f2f4f6;
  --gray-200: #e5e8eb;
  --gray-300: #d1d6db;
  --gray-400: #b0b8c1;
  --gray-500: #8b95a1;
  --gray-600: #6b7684;
  --gray-700: #4e5968;
  --gray-800: #333d4b;
  --gray-900: #191f28;

  /* Green */
  --green-50: #e9f9ef;
  --green-500: #00a661;
  --green-600: #008f53;

  /* Yellow / Orange */
  --yellow-50: #fff7e0;
  --yellow-500: #ffb020;
  --yellow-600: #f59e0b;

  /* Red */
  --red-50: #fff0f0;
  --red-500: #f04452;
  --red-600: #d92d3e;
}
```

### 2.2 Semantic Colors

Semantic Color는 실제 UI에서 사용하는 역할 기반 색상이다.

```css
:root {
  /* Brand */
  --primary: var(--blue-500);
  --primary-hover: var(--blue-600);
  --primary-active: var(--blue-700);
  --primary-soft: var(--blue-50);

  /* Secondary */
  --secondary: var(--gray-800);
  --secondary-hover: var(--gray-900);
  --secondary-soft: var(--gray-100);

  /* Background */
  --background: var(--gray-50);
  --background-subtle: var(--gray-100);

  /* Surface */
  --surface: var(--gray-0);
  --surface-subtle: var(--gray-50);
  --surface-raised: var(--gray-0);

  /* Border */
  --border: var(--gray-200);
  --border-strong: var(--gray-300);

  /* Text */
  --text: var(--gray-900);
  --text-sub: var(--gray-700);
  --text-muted: var(--gray-500);
  --text-disabled: var(--gray-400);
  --text-inverse: var(--gray-0);

  /* Status */
  --success: var(--green-500);
  --success-hover: var(--green-600);
  --success-soft: var(--green-50);

  --warning: var(--yellow-500);
  --warning-hover: var(--yellow-600);
  --warning-soft: var(--yellow-50);

  --danger: var(--red-500);
  --danger-hover: var(--red-600);
  --danger-soft: var(--red-50);
}
```

### 2.3 Color Usage

| 용도                         | 토큰                  |
| ---------------------------- | --------------------- |
| 메인 버튼, 활성 탭, 주요 CTA | `--primary`           |
| 메인 버튼 hover              | `--primary-hover`     |
| 메인 버튼 active             | `--primary-active`    |
| 연한 파란 배경               | `--primary-soft`      |
| 일반 배경                    | `--background`        |
| 보조 배경                    | `--background-subtle` |
| 카드 배경                    | `--surface`           |
| 연한 카드/입력 배경          | `--surface-subtle`    |
| 기본 텍스트                  | `--text`              |
| 보조 텍스트                  | `--text-sub`          |
| 흐린 텍스트                  | `--text-muted`        |
| 비활성 텍스트                | `--text-disabled`     |
| 반전 텍스트                  | `--text-inverse`      |
| 기본 경계선                  | `--border`            |
| 강조 경계선                  | `--border-strong`     |
| 성공                         | `--success`           |
| 경고                         | `--warning`           |
| 에러/위험                    | `--danger`            |

### 2.4 Legacy Alias

기존 서비스에서 사용 중인 변수명은 바로 제거하지 않는다.  
초기에는 alias를 제공해 화면 깨짐을 막고, 이후 점진적으로 공통 토큰으로 교체한다.

```css
:root {
  /* WorkPortal 기존 이름 호환 */
  --bg: var(--background);
  --surface2: var(--surface-subtle);
  --ok: var(--success);
  --warn: var(--warning);
  --bad: var(--danger);

  /* Meeting 기존 이름 호환 */
  --panel: var(--surface);
  --panel2: var(--surface-subtle);
  --panel3: var(--background-subtle);
  --muted: var(--text-sub);
  --muted2: var(--text-muted);
  --accent: var(--primary);
  --accent-hover: var(--primary-hover);
  --accent-soft: var(--primary-soft);
  --green: var(--success);
  --red: var(--danger);

  /* Portal Header 기존 prefix 호환 */
  --ph-bg: var(--background);
  --ph-surface: var(--surface);
  --ph-surface2: var(--surface-subtle);
  --ph-border: var(--border);
  --ph-text: var(--text);
  --ph-text-muted: var(--text-sub);
  --ph-text-soft: var(--text-muted);
  --ph-primary: var(--primary);
  --ph-primary-hover: var(--primary-hover);
  --ph-primary-soft: var(--primary-soft);
  --ph-radius-sm: var(--radius-md);
  --ph-layout-max: var(--layout-max);
}
```

---

## 3. Typography Rules

Typography는 `shared/typography.css`에서 관리한다.

모든 서비스는 임의의 `font-size`, `font-weight`를 계속 추가하지 않고, 공통 typography token을 우선 사용한다.

### 3.1 Font Family

```css
:root {
  --font-family-base:
    "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Apple SD Gothic Neo", system-ui, sans-serif;

  --font-family-mono:
    ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
}
```

### 3.2 Font Size

```css
:root {
  --font-title-lg: 28px;
  --font-title-md: 22px;
  --font-title-sm: 18px;

  --font-subtitle: 15px;

  --font-body-lg: 16px;
  --font-body: 14px;
  --font-body-sm: 13px;

  --font-caption: 12px;
  --font-caption-sm: 11px;
}
```

### 3.3 Font Weight

```css
:root {
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extra-bold: 800;
}
```

### 3.4 Line Height / Letter Spacing

```css
:root {
  --line-title: 1.3;
  --line-body: 1.6;
  --line-caption: 1.45;

  --letter-title: -0.03em;
  --letter-card-title: -0.02em;
  --letter-normal: -0.01em;
}
```

### 3.5 Typography Hierarchy

| 역할          | 토큰                | 값   | 사용 위치                |
| ------------- | ------------------- | ---- | ------------------------ |
| Page Title    | `--font-title-lg`   | 28px | 페이지 메인 제목         |
| Section Title | `--font-title-md`   | 22px | 큰 섹션 제목             |
| Card Title    | `--font-title-sm`   | 18px | 카드 제목                |
| Subtitle      | `--font-subtitle`   | 15px | 페이지 설명, 보조 문장   |
| Body Large    | `--font-body-lg`    | 16px | 강조 본문                |
| Body          | `--font-body`       | 14px | 일반 본문, label, 설명   |
| Body Small    | `--font-body-sm`    | 13px | 리스트 설명, 보조 텍스트 |
| Caption       | `--font-caption`    | 12px | 날짜, 상태, 작은 안내    |
| Caption Small | `--font-caption-sm` | 11px | badge, table meta, host  |

### 3.6 Text Utilities

```css
body {
  font-family: var(--font-family-base);
  font-size: var(--font-body);
  line-height: var(--line-body);
  color: var(--text);
}

.text-title-lg {
  font-size: var(--font-title-lg);
  font-weight: var(--font-extra-bold);
  line-height: var(--line-title);
  letter-spacing: var(--letter-title);
  color: var(--text);
}

.text-title-md {
  font-size: var(--font-title-md);
  font-weight: var(--font-bold);
  line-height: var(--line-title);
  letter-spacing: var(--letter-title);
  color: var(--text);
}

.text-title-sm {
  font-size: var(--font-title-sm);
  font-weight: var(--font-bold);
  line-height: 1.35;
  letter-spacing: var(--letter-card-title);
  color: var(--text);
}

.text-subtitle {
  font-size: var(--font-subtitle);
  font-weight: var(--font-regular);
  line-height: 1.7;
  color: var(--text-sub);
}

.text-body {
  font-size: var(--font-body);
  font-weight: var(--font-regular);
  line-height: var(--line-body);
  color: var(--text);
}

.text-body-sm {
  font-size: var(--font-body-sm);
  font-weight: var(--font-regular);
  line-height: 1.55;
  color: var(--text-sub);
}

.text-caption {
  font-size: var(--font-caption);
  font-weight: var(--font-medium);
  line-height: var(--line-caption);
  color: var(--text-muted);
}

.text-caption-sm {
  font-size: var(--font-caption-sm);
  font-weight: var(--font-semibold);
  line-height: var(--line-caption);
  color: var(--text-muted);
}
```

### 3.7 Existing Class Mapping

기존 typography 관련 클래스는 아래 기준으로 점진적으로 맞춘다.

```txt
.page-title
→ .text-title-lg 기준

.portal-hero__title
→ .text-title-lg 기준

.card-title h2
→ .text-title-sm 기준

.page-subtitle
→ .text-subtitle 기준

.card-title p
→ .text-body 기준

.portal-tile__desc
→ .text-body-sm 기준

.badge, .meta, .host, .date
→ .text-caption 또는 .text-caption-sm 기준
```

---

## 4. Component Stylings

공통 UI 컴포넌트는 다음 기준으로 정의한다.

```txt
Button
Card
Input
Badge
Header
Layout
```

현재 모든 주요 공통 컴포넌트가 `shared/*.css` 파일로 정의되어 있으며, React + TypeScript 컴포넌트로 구현되어 있다.
Input, Badge, Header, Layout은 동일한 토큰 기준으로 확장되었다.

---

### 4.1 Button

버튼은 사용자의 행동을 실행하는 요소다.

모든 버튼은 기본 클래스 `.btn`을 사용하고, 역할에 따라 variant class를 추가한다.

```html
<button class="btn btn--primary">저장하기</button>
<button class="btn btn--secondary">취소</button>
<button class="btn btn--danger">삭제</button>
```

`.btn`은 공통 모양만 담당한다.  
`.btn--primary`, `.btn--secondary`, `.btn--danger`는 색상 역할을 담당한다.

#### Button Variants

| 종류        | 클래스              | 용도                                                   |
| ----------- | ------------------- | ------------------------------------------------------ |
| Primary     | `.btn--primary`     | 저장, 생성, 로그인, 다음 단계, 주요 CTA                |
| Secondary   | `.btn--secondary`   | 취소, 뒤로가기, 새 탭, 다운로드, 보조 액션             |
| Danger      | `.btn--danger`      | 삭제, 제거, 로그아웃성 위험 액션, 중단                 |
| Danger Soft | `.btn--danger-soft` | 파일 삭제, 리스트 행 삭제, 작은 X 버튼, 첨부 파일 제거 |

#### Base Button

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);

  min-height: 42px;
  padding: var(--space-3) var(--space-4);

  border: 1px solid transparent;
  border-radius: var(--radius-md);

  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.01em;
  white-space: nowrap;
  text-decoration: none;

  cursor: pointer;
  user-select: none;

  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### Primary Button

Primary 버튼은 화면에서 사용자가 가장 먼저 해야 하는 주요 액션에 사용한다.

사용 위치:

```txt
로그인
저장하기
생성하기
뉴스레터 만들기
CSV 반영
최종본 생성
발행
업로드
```

```css
.btn--primary {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--text-inverse);
  box-shadow: 0 1px 2px rgba(49, 130, 246, 0.2);
}

.btn--primary:hover:not(:disabled) {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  box-shadow: 0 4px 12px rgba(49, 130, 246, 0.24);
}

.btn--primary:active:not(:disabled) {
  background: var(--primary-active);
  border-color: var(--primary-active);
}
```

사용 예시:

```html
<button class="btn btn--primary">뉴스레터 만들기</button>
<button class="btn btn--primary">로그인</button>
<button class="btn btn--primary">CSV 반영</button>
```

#### Secondary Button

Secondary 버튼은 Primary 버튼 옆의 보조 액션에 사용한다.  
흰 배경과 회색 border를 기본으로 한다.

사용 위치:

```txt
취소
뒤로가기
새 탭
다운로드
이전
새로고침
워크포탈
닫기
```

```css
.btn--secondary {
  background: var(--surface);
  border-color: var(--border);
  color: var(--text-sub);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--surface-subtle);
  border-color: var(--border-strong);
  color: var(--text);
}

.btn--secondary:active:not(:disabled) {
  background: var(--background-subtle);
}
```

사용 예시:

```html
<button class="btn btn--secondary">취소</button>
<a class="btn btn--secondary" href="#">새 탭</a>
<button class="btn btn--secondary">새로고침</button>
```

기존 뉴스레터의 `.btn-ghost`는 secondary 역할로 본다.  
장기적으로는 `.btn-ghost`보다 `.btn--secondary`로 이름을 맞춘다.

#### Danger Button

Danger 버튼은 삭제, 제거, 중단처럼 위험하거나 되돌리기 어려운 액션에 사용한다.

사용 위치:

```txt
삭제
파일 제거
회의 삭제
녹음 종료
목록에서 제거
초기화
발행 취소
```

```css
.btn--danger {
  background: var(--danger);
  border-color: var(--danger);
  color: var(--text-inverse);
  box-shadow: 0 1px 2px rgba(240, 68, 82, 0.2);
}

.btn--danger:hover:not(:disabled) {
  background: var(--danger-hover);
  border-color: var(--danger-hover);
  box-shadow: 0 4px 12px rgba(240, 68, 82, 0.24);
}

.btn--danger:active:not(:disabled) {
  background: var(--danger-hover);
  border-color: var(--danger-hover);
}
```

사용 예시:

```html
<button class="btn btn--danger">삭제</button>
<button class="btn btn--danger">녹음 종료</button>
```

Meeting 쪽에 개별 정의된 danger hover는 공통 `.btn--danger` 또는 `.btn--danger-soft`로 정리한다.

#### Danger Soft Button

작은 삭제 버튼에는 강한 빨간 배경보다 soft danger를 우선 사용한다.

사용 위치:

```txt
파일 삭제
리스트 행 삭제
작은 X 버튼
첨부 파일 제거
```

```css
.btn--danger-soft {
  background: var(--danger-soft);
  border-color: var(--danger-soft);
  color: var(--danger);
}

.btn--danger-soft:hover:not(:disabled) {
  background: var(--danger);
  border-color: var(--danger);
  color: var(--text-inverse);
}
```

사용 예시:

```html
<button class="btn btn--danger-soft">삭제</button>
```

#### Button Sizes

```css
.btn--sm {
  min-height: 34px;
  padding: var(--space-2) var(--space-3);
  font-size: 13px;
  border-radius: var(--radius-sm);
}

.btn--md {
  min-height: 42px;
  padding: var(--space-3) var(--space-4);
  font-size: 14px;
}

.btn--lg {
  min-height: 48px;
  padding: var(--space-4) var(--space-6);
  font-size: 15px;
}

.btn--block {
  width: 100%;
}

.btn--icon {
  width: 36px;
  height: 36px;
  min-height: 36px;
  padding: 0;
  border-radius: var(--radius-sm);
}

.btn svg {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}
```

사용 예시:

```html
<button class="btn btn--primary btn--lg">뉴스레터 만들기</button>

<button class="btn btn--secondary btn--sm">새 탭</button>

<button class="btn btn--danger-soft btn--icon" aria-label="삭제">×</button>

<button class="btn btn--primary btn--block">로그인</button>
```

#### Button Legacy Alias

기존 클래스는 초기에는 alias로 유지한다.

```css
.btn-primary {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--text-inverse);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

.btn-ghost {
  background: var(--surface);
  border-color: var(--border);
  color: var(--text-sub);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--surface-subtle);
  border-color: var(--border-strong);
  color: var(--text);
}

.btn-send {
  background: var(--success);
  border-color: var(--success);
  color: var(--text-inverse);
}
```

장기적으로는 아래 기준으로 통일한다.

```txt
.btn-primary
→ class="btn btn--primary"

.btn-ghost
→ class="btn btn--secondary"

.btn-send
→ class="btn btn--primary" 또는 class="btn btn--success"

danger
→ class="btn btn--danger-soft"
```

#### React Component Example

React 컴포넌트에서는 다음처럼 사용할 수 있다.

```tsx
<Button variant="primary">저장</Button>
<Button variant="secondary">취소</Button>
<Button variant="danger">삭제</Button>
<Button variant="dangerSoft" size="sm">삭제</Button>
```

---

### 4.2 Card

카드는 관련된 정보를 하나의 영역으로 묶는 컨테이너다.

모든 카드는 기본 클래스 `.card`를 사용하고, 목적에 따라 variant class를 추가한다.

```html
<section class="card">
  <div class="card__body">카드 내용</div>
</section>
```

#### Card Variants

| 종류             | 클래스             | 용도                                 |
| ---------------- | ------------------ | ------------------------------------ |
| 기본 카드        | `.card`            | 일반 섹션, 폼 박스, 정보 영역        |
| 클릭 카드        | `.card--clickable` | 서비스 바로가기, 목록 아이템         |
| 강조 카드        | `.card--elevated`  | 메인 패널, 중요한 영역, 큰 컨테이너  |
| 큰 컨테이너 카드 | `.card--container` | Meeting의 `.app` 같은 화면 래퍼      |
| Soft 카드        | `.card--soft`      | 보조 안내 박스, 힌트 박스, 필터 영역 |
| Danger 카드      | `.card--danger`    | 경고/에러성 안내                     |

#### Card Tokens

```css
:root {
  --card-radius-sm: var(--radius-md);
  --card-radius-md: var(--radius-lg);
  --card-radius-lg: var(--radius-xl);

  --card-border: 1px solid var(--border);
  --card-border-hover: var(--border-strong);

  --card-bg: var(--surface);
  --card-bg-subtle: var(--surface-subtle);

  --card-shadow-sm: var(--shadow-sm);
  --card-shadow-md: var(--shadow-md);
  --card-shadow-lg: var(--shadow-lg);

  --card-padding-sm: var(--space-4);
  --card-padding-md: var(--space-5);
  --card-padding-lg: var(--space-6);
}
```

#### Base Card

```css
.card {
  background: var(--card-bg);
  border: var(--card-border);
  border-radius: var(--card-radius-md);
  box-shadow: var(--card-shadow-sm);
  overflow: hidden;
}
```

#### Card Structure

카드는 가능하면 `header`, `body`, `footer` 구조를 사용한다.

```html
<section class="card">
  <header class="card__header">
    <div>
      <h2 class="card__title">블로그 링크</h2>
      <p class="card__description">한 줄에 URL 하나씩 입력하세요.</p>
    </div>
  </header>

  <div class="card__body">내용 영역</div>

  <footer class="card__footer">
    <button class="btn btn--secondary">취소</button>
    <button class="btn btn--primary">저장</button>
  </footer>
</section>
```

```css
.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--card-padding-lg);
  border-bottom: 1px solid var(--border);
  background: linear-gradient(
    180deg,
    var(--surface-subtle) 0%,
    var(--surface) 100%
  );
}

.card__title {
  margin: 0;
  font-size: var(--font-title-sm);
  font-weight: var(--font-extra-bold);
  line-height: 1.35;
  letter-spacing: var(--letter-card-title);
  color: var(--text);
}

.card__description {
  margin: var(--space-1) 0 0;
  font-size: var(--font-body);
  line-height: 1.55;
  color: var(--text-sub);
}

.card__body {
  padding: var(--card-padding-lg);
}

.card__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
  padding: var(--card-padding-md) var(--card-padding-lg);
  border-top: 1px solid var(--border);
  background: var(--surface-subtle);
}
```

#### Card Variant Styles

```css
.card--default {
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.card--clickable {
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.card--clickable:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.card--clickable:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.card--elevated {
  box-shadow: var(--shadow-md);
}

.card--container {
  border-radius: var(--card-radius-lg);
  box-shadow: var(--shadow-lg);
}

.card--soft {
  background: var(--surface-subtle);
  border-color: var(--border);
  box-shadow: none;
}

.card--danger {
  background: var(--danger-soft);
  border-color: var(--danger);
  box-shadow: none;
}
```

#### Card Size Modifiers

```css
.card--compact .card__header,
.card--compact .card__body,
.card--compact .card__footer {
  padding: var(--card-padding-sm);
}

.card--spacious .card__header,
.card--spacious .card__body,
.card--spacious .card__footer {
  padding: var(--card-padding-lg);
}
```

#### Existing Class Mapping

기존 클래스는 바로 삭제하지 않고, 공통 카드 클래스를 함께 붙여 점진적으로 이전한다.

```txt
.card
→ class="card"

.service-card
→ class="card card--clickable service-card"

.portal-tile
→ class="card card--clickable portal-tile"

.side-card
→ class="card card--soft side-card"

.app
→ class="card card--container app"
```

예시:

```html
<article class="card card--clickable portal-tile">...</article>
```

---

### 4.3 Input

Input은 사용자가 값을 입력하는 요소다.

기본적으로 label과 함께 사용하고, focus 상태가 명확히 보여야 한다.

```html
<label class="field">
  <span class="field__label">이메일</span>
  <input class="input" type="email" placeholder="example@email.com" />
</label>
```

Input은 다음 구조를 기준으로 한다.

```txt
.field
.field__label
.input
.field__help
.field__error
```

Input 상태는 다음을 고려한다.

| 상태     | 설명                    |
| -------- | ----------------------- |
| default  | 일반 입력 가능 상태     |
| focus    | 사용자가 입력 중인 상태 |
| disabled | 입력 불가능 상태        |
| error    | 유효성 검사 실패 상태   |

기본 spacing은 다음 토큰을 사용한다.

```css
.input {
  padding: var(--input-padding-y) var(--input-padding-x);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text);
}
```

React 컴포넌트 전환 예시:

```tsx
<FormField label="이메일" htmlFor="email" errorMessage={emailError}>
  <Input
    id="email"
    type="email"
    placeholder="example@email.com"
    error={Boolean(emailError)}
  />
</FormField>
```

---

### 4.4 Badge

Badge는 상태, 분류, 작은 정보를 표시하는 요소다.

```html
<span class="badge badge--success">완료</span>
<span class="badge badge--warning">대기</span>
<span class="badge badge--danger">오류</span>
```

Badge 종류는 다음을 기준으로 한다.

| 종류    | 클래스            | 용도            |
| ------- | ----------------- | --------------- |
| Default | `.badge--default` | 일반 상태       |
| Primary | `.badge--primary` | 활성, 주요 상태 |
| Success | `.badge--success` | 완료, 성공      |
| Warning | `.badge--warning` | 대기, 주의      |
| Danger  | `.badge--danger`  | 실패, 오류      |

Badge는 기본적으로 caption 계열 typography를 사용한다.

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  min-height: 24px;
  padding: 0 var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-caption);
  font-weight: var(--font-semibold);
  line-height: var(--line-caption);
}
```

---

### 4.5 Header

Header는 모든 서비스에서 공통적으로 사용하는 상단 영역이다.

공통 헤더는 `shared/portal-header.css`를 기준으로 관리한다.  
색상은 `--ph-*` alias를 통해 `shared/colors.css`에서 공급받는다.

```css
@import url("/shared/tokens.css");
```

Header 구조는 다음을 기준으로 한다.

```txt
.portal-header
.portal-header__inner
.portal-header__brand
.portal-header__nav
.portal-header__actions
```

---

### 4.6 Layout

페이지의 최대 너비, padding, section gap은 공통 토큰을 사용한다.

```css
.page {
  max-width: var(--layout-max);
  margin: 0 auto;
  padding: var(--page-padding);
}

@media (max-width: 640px) {
  .page {
    padding: var(--page-padding-mobile);
  }
}
```

---

## 5. Layout Principles

### 5.1 Spacing Scale

Spacing은 4px grid를 기준으로 한다.

```txt
4px  → 가장 작은 여백
8px  → 작은 요소 사이 간격
16px → 기본 카드 내부 여백
24px → 페이지/섹션 여백
32px 이상 → 큰 섹션 간격
```

```css
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
  --space-9: 48px;
  --space-10: 64px;
  --space-11: 80px;
}
```

### 5.2 Semantic Spacing

```css
:root {
  /* Gap */
  --gap-xs: var(--space-1);
  --gap-sm: var(--space-2);
  --gap-md: var(--space-4);
  --gap-lg: var(--space-6);
  --gap-xl: var(--space-7);

  /* Padding */
  --padding-xs: var(--space-2);
  --padding-sm: var(--space-3);
  --padding-md: var(--space-4);
  --padding-lg: var(--space-6);
  --padding-xl: var(--space-7);

  /* Page */
  --page-padding-mobile: var(--space-4);
  --page-padding: var(--space-6);
  --page-padding-wide: var(--space-7);

  /* Section */
  --section-gap-sm: var(--space-4);
  --section-gap-md: var(--space-6);
  --section-gap-lg: var(--space-7);
  --section-gap-xl: var(--space-9);

  /* Component */
  --card-padding-sm: var(--space-4);
  --card-padding-md: var(--space-5);
  --card-padding-lg: var(--space-6);

  --button-padding-y-sm: var(--space-2);
  --button-padding-x-sm: var(--space-3);

  --button-padding-y-md: var(--space-3);
  --button-padding-x-md: var(--space-4);

  --input-padding-y: var(--space-3);
  --input-padding-x: var(--space-4);
}
```

### 5.3 Spacing Usage

| 값   | 토큰         | 사용 위치                             |
| ---- | ------------ | ------------------------------------- |
| 4px  | `--space-1`  | 아이콘과 텍스트, 라벨과 작은 배지     |
| 8px  | `--space-2`  | 버튼 내부 gap, label과 input 사이     |
| 12px | `--space-3`  | input 세로 padding, 작은 버튼 padding |
| 16px | `--space-4`  | 기본 카드 padding, 컴포넌트 기본 gap  |
| 20px | `--space-5`  | 중간 카드 padding                     |
| 24px | `--space-6`  | 페이지 padding, 섹션 padding          |
| 32px | `--space-7`  | 큰 블록 사이                          |
| 40px | `--space-8`  | hero 영역 상하 여백                   |
| 48px | `--space-9`  | 페이지 대분류 사이                    |
| 64px | `--space-10` | 랜딩/대형 섹션 간격                   |

### 5.4 Ambiguous Spacing Cleanup

기존 CSS의 애매한 값은 4px grid 기준으로 점진적으로 정리한다.

```txt
6px  → 8px
10px → 8px 또는 12px
14px → 16px
18px → 16px 또는 20px
22px → 24px
28px → 32px
```

### 5.5 Newsletter Spacing Alias

Newsletter는 기존 spacing scale이 다르므로 바로 공통 spacing으로 바꾸지 않는다.

기존 newsletter spacing:

```css
--space-1: 8px;
--space-2: 12px;
--space-3: 16px;
--space-4: 24px;
--space-5: 32px;
--space-6: 40px;
--space-7: 48px;
```

공통 기준은 `--space-1: 4px`이므로, 초기에는 newsletter 전용 alias를 둔다.

```css
:root {
  --newsletter-space-1: var(--space-2); /* 기존 8px */
  --newsletter-space-2: var(--space-3); /* 기존 12px */
  --newsletter-space-3: var(--space-4); /* 기존 16px */
  --newsletter-space-4: var(--space-6); /* 기존 24px */
  --newsletter-space-5: var(--space-7); /* 기존 32px */
  --newsletter-space-6: var(--space-8); /* 기존 40px */
  --newsletter-space-7: var(--space-9); /* 기존 48px */
}
```

나중에 전체 리팩토링할 때 `--newsletter-space-*`도 제거하고 공통 `--space-*`로 맞춘다.

---

## 6. Depth & Elevation

Depth는 border, shadow, radius로 표현한다.

### 6.1 Shadow

```css
:root {
  --shadow-sm: 0 1px 2px rgba(25, 31, 40, 0.04);
  --shadow-md: 0 8px 24px rgba(25, 31, 40, 0.08);
  --shadow-lg: 0 16px 40px rgba(25, 31, 40, 0.12);
}
```

| 용도                      | 토큰          |
| ------------------------- | ------------- |
| 일반 카드                 | `--shadow-sm` |
| hover 카드, elevated 카드 | `--shadow-md` |
| 큰 컨테이너, 모달성 영역  | `--shadow-lg` |

### 6.2 Radius

```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
}
```

| 용도                  | 토큰          | 값   |
| --------------------- | ------------- | ---- |
| 작은 버튼, 작은 badge | `--radius-sm` | 8px  |
| 일반 버튼, input      | `--radius-md` | 12px |
| 기본 카드             | `--radius-lg` | 16px |
| 큰 컨테이너, 모달     | `--radius-xl` | 20px |

### 6.3 Border

기본 border는 너무 진하지 않게 사용한다.

```css
border: 1px solid var(--border);
```

hover 또는 active 상태에서는 한 단계 강한 border를 사용한다.

```css
border-color: var(--border-strong);
```

Border 기준:

```txt
기본 카드     → --border
hover 카드    → --border-strong
danger 카드   → --danger
active 카드   → --primary
```

---

## 7. Do's and Don'ts

### 7.1 Do

```txt
공통 토큰을 우선 사용한다.
서비스 CSS에서는 hex color 직접 사용을 피한다.
버튼은 .btn 기반으로 만든다.
카드는 .card 기반으로 만든다.
spacing은 4px grid 기준으로 맞춘다.
기존 클래스는 바로 삭제하지 않고 alias 또는 공통 클래스를 함께 붙인다.
서비스 전용 컬러는 prefix를 붙여 관리한다.
React 컴포넌트 전환을 고려해 variant와 size 개념을 유지한다.
```

좋은 예:

```css
.button {
  background: var(--primary);
  padding: var(--space-3) var(--space-4);
  color: var(--text-inverse);
}
```

```html
<button class="btn btn--primary btn--lg">뉴스레터 만들기</button>
```

### 7.2 Don't

```txt
새로운 색상을 임의로 추가하지 않는다.
#3182f6 같은 hex color를 서비스 CSS에 직접 반복하지 않는다.
6px, 10px, 14px 같은 애매한 spacing을 새로 추가하지 않는다.
Primary 버튼을 한 화면에 과도하게 많이 사용하지 않는다.
삭제 버튼을 무조건 강한 빨간 배경으로 만들지 않는다.
기존 클래스를 한 번에 삭제하지 않는다.
서비스별로 버튼/카드 스타일을 새로 정의하지 않는다.
```

나쁜 예:

```css
.button {
  background: #3182f6;
  padding: 13px 18px;
  color: #ffffff;
}
```

---

## 8. Responsive Behavior

반응형은 모바일 우선으로 고려한다.

### 8.1 Breakpoints

기본 기준은 다음과 같다.

```txt
Mobile: 0px ~ 639px
Tablet: 640px ~ 1023px
Desktop: 1024px 이상
```

### 8.2 Page Padding

```css
.page {
  padding: var(--page-padding);
}

@media (max-width: 640px) {
  .page {
    padding: var(--page-padding-mobile);
  }
}
```

### 8.3 Touch Target

모바일에서 클릭 가능한 요소는 최소 34px 이상을 유지한다.

```txt
작은 버튼: 34px
기본 버튼: 42px
큰 CTA: 48px
아이콘 버튼: 36px
```

### 8.4 Layout Collapse

데스크탑에서 2열 이상으로 배치된 영역은 모바일에서 1열로 접는다.

```txt
카드 그리드 → 1열
사이드바 + 본문 → 본문 우선 1열
버튼 그룹 → 필요 시 세로 배치
```

---

## 9. Agent Prompt Guide

AI 에이전트는 UI를 생성하거나 수정할 때 반드시 이 문서를 먼저 읽고 디자인 기준을 따른다.

### 9.1 General Prompt

```txt
DESIGN.md를 먼저 읽고, WorkPortal의 디자인 시스템에 맞게 UI를 작성해줘.
색상은 CSS variable token을 사용하고, 버튼은 .btn, 카드는 .card 기준을 따라줘.
```

### 9.2 Button Prompt

```txt
DESIGN.md의 Button 섹션을 기준으로 버튼 스타일을 정리해줘.
주요 액션은 class="btn btn--primary", 보조 액션은 class="btn btn--secondary", 위험 액션은 class="btn btn--danger" 또는 class="btn btn--danger-soft"를 사용해줘.
```

### 9.3 Card Prompt

```txt
DESIGN.md의 Card 섹션을 기준으로 카드 UI를 작성해줘.
기본 카드는 class="card", 클릭 가능한 서비스 카드는 class="card card--clickable", 보조 안내 영역은 class="card card--soft"를 사용해줘.
```

### 9.4 Token Refactor Prompt

```txt
현재 CSS에서 직접 사용된 hex color, 임의 spacing, 개별 button/card 스타일을 DESIGN.md 기준으로 공통 token과 공통 class로 교체해줘.
기존 클래스는 바로 삭제하지 말고 alias 또는 공통 클래스를 함께 붙이는 방식으로 점진적으로 수정해줘.
```

### 9.5 React Conversion Prompt

```txt
DESIGN.md 기준으로 HTML/CSS UI를 React + TypeScript 컴포넌트로 변환해줘.
Button은 variant와 size prop을 사용하고, Card는 variant prop으로 default, clickable, elevated, soft, danger를 구분해줘.
```

### 9.6 Next.js Migration Prompt

```txt
DESIGN.md를 기준으로 기존 HTML 서비스를 Next.js App Router 구조로 이전해줘.
공통 Header, Layout, Button, Card 컴포넌트를 우선 분리하고, 각 서비스 페이지는 app/ 하위 route로 구성해줘.
```

---

## 10. Migration Plan

디자인 시스템 적용과 마이그레이션은 다음 순서로 진행한다.

```txt
1. 공통 디자인 토큰 정리 (완료)
   - colors, spacing, typography, radius, shadow

2. 기존 HTML 서비스에 공통 CSS 토큰 연결 (완료)
   - WorkPortal, Newsletter, Meeting, Dashboard, Ebook, PPT

3. 공통 UI 컴포넌트 스타일 정의 (완료)
   - Button, Card, Input, Badge, Header, Layout

4. Next.js + TypeScript 프로젝트 초기 구성 (완료)
   - App Router, 프로젝트 scripts 및 기본 설정 정리

5. React + TypeScript 공통 UI 컴포넌트 생성 (완료)
   - shared CSS 기반의 재사용 가능한 컴포넌트 라이브러리 구축

6. WorkPortal 홈 화면, 로그인 및 사용 이력 페이지 이전 (완료)

7. 각 서비스별 점진적 마이그레이션 (예정)

```

### 10.1 Shared File Structure

```txt
shared/
  colors.css
  spacing.css
  typography.css
  buttons.css
  cards.css
  inputs.css
  badges.css
  layout.css
  portal-header.css
  tokens.css
```

`tokens.css`는 공통 토큰과 공통 컴포넌트 스타일을 모아서 import한다.

```css
@import url("./colors.css");
@import url("./spacing.css");
@import url("./typography.css");
@import url("./buttons.css");
@import url("./cards.css");
@import url("./inputs.css");
@import url("./badges.css");
@import url("./layout.css");
```

각 서비스 CSS에서는 가능하면 `tokens.css`만 import한다.

```css
@import url("/shared/tokens.css");
```

### 10.2 Service Application Order

```txt
1. WorkPortal
2. Newsletter
3. Meeting
4. Dashboard
5. Ebook
6. PPT
```

### 10.3 WorkPortal

```txt
styles.css 상단에 tokens.css import
기존 :root 색상 정의 축소
portal-hero gradient를 공통 토큰으로 변경
portal-tile에 card card--clickable 기준 반영
```

```css
.portal-hero {
  background: linear-gradient(
    135deg,
    var(--primary-active) 0%,
    var(--primary) 45%,
    var(--blue-200) 100%
  );
  color: var(--text-inverse);
}
```

### 10.4 Newsletter

Newsletter는 기존에 별도 브랜드 컬러를 사용한다.  
서비스 고유 포인트 컬러는 유지하되, 공통 토큰과 구분해서 관리한다.

```css
:root {
  --newsletter-brand: #e85d4a;
  --newsletter-brand-soft: #fff5f2;
  --newsletter-brand-mid: #fecaca;
}
```

기본 배경, 텍스트, border, success, danger는 공통 토큰을 우선 사용한다.

### 10.5 Meeting

Meeting은 기존에 `--panel`, `--muted`, `--accent` 같은 토큰을 사용하고 있다.

초기에는 alias로 연결한다.

```css
--panel: var(--surface);
--muted: var(--text-sub);
--accent: var(--primary);
```

신규 코드부터는 `--surface`, `--text-sub`, `--primary`를 직접 사용한다.

### 10.6 Dashboard

Dashboard는 Tailwind 기반이므로 Tailwind theme token과 CSS variable을 연결한다.

```css
@import "/shared/tokens.css";
@import "tailwindcss";

@theme {
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-soft: var(--primary-soft);

  --color-secondary: var(--secondary);
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface2: var(--surface-subtle);

  --color-text-main: var(--text);
  --color-text-sub: var(--text-sub);
  --color-text-soft: var(--text-muted);

  --color-border: var(--border);
  --color-border-strong: var(--border-strong);

  --font-sans: var(--font-family-base);

  --shadow-premium: var(--shadow-md);
  --radius-portal: var(--radius-lg);
}
```

---

## 11. React + TypeScript Component Direction

HTML/CSS로 정의한 공통 UI를 React + TypeScript 컴포넌트로 구현했다.

실제 구조:

```txt
components/
  index.ts

  ui/
    index.ts
    utils.ts
    Button.tsx
    Card.tsx
    Input.tsx
    Textarea.tsx
    Select.tsx
    FormField.tsx
    Badge.tsx

  layout/
    index.ts
    PortalHeader.tsx
    Page.tsx
    Section.tsx
    Stack.tsx
    Cluster.tsx
    Grid.tsx
```

### 11.1 Button Type Example

```tsx
type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "dangerSoft";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}
```

### 11.2 Card Type Example

```tsx
type CardVariant =
  | "default"
  | "clickable"
  | "elevated"
  | "soft"
  | "danger";

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  spacing?: "compact" | "default" | "spacious";
}
```

---

## 12. Next.js App Router Direction

기존 HTML 서비스는 Next.js App Router 기반으로 이전한다.

예상 구조:

```txt
app/
  layout.tsx
  page.tsx

  workportal/
    page.tsx

  newsletter/
    page.tsx

  meeting/
    page.tsx

  dashboard/
    page.tsx

  ebook/
    page.tsx

  ppt/
    page.tsx
```

공통 layout은 Header와 page wrapper를 포함한다.

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <PortalHeader />
        {children}
      </body>
    </html>
  );
}
```

---

## 13. Completion Criteria

디자인 시스템 마이그레이션 진행 상태는 다음과 같다.

```txt
[완료] 1. DESIGN.md 작성 및 마이그레이션 전략 수립
[완료] 2. 기초 디자인 토큰 생성 (colors, spacing, typography)
[완료] 3. 기존 모든 서비스(6개)에 공통 토큰 1차 연결 및 검증
[완료] 4. 공통 UI 컴포넌트 스타일 명세 확립 (buttons, cards, inputs, badges, layout)
[완료] 5. Next.js 15 + TypeScript 5 마이그레이션 플랫폼 초기 구축
[완료] 6. React + TypeScript 기반 공통 UI 컴포넌트 라이브러리 구현
[완료] 7. WorkPortal 홈, 로그인 및 사용 이력 페이지 Next.js 이전 및 연동
[완료] 8. 이용 가이드 페이지(/guide) 정적 콘텐츠 Next.js 라우트 이전 완수
[완료] 9. 교육 뉴스레터 서비스(/newsletter) 도메인 로직 및 UI Next.js 이전 완수
[완료] 10. 회의록 자동화 서비스(/meeting) Next.js 마이그레이션 (Chunk 업로드 · Polling · 녹음 복구)
[예정] 11. E-Book 동화책 및 PPT 제안서 메이커 서비스 React 전환 및 연동
```

---

## 14. Checklist

### Design Tokens & Base

- [x] `shared/colors.css` 생성 및 시맨틱 정의
- [x] `shared/spacing.css` 생성 (4px grid 시스템)
- [x] `shared/typography.css` 생성 및 유틸리티 클래스
- [x] `shared/tokens.css` 통합 엔트리 포인트 구축
- [x] 기존 서비스별 Legacy Alias 매핑 및 UI 안정성 검증

### Shared Component Styles (CSS)

- [x] `shared/buttons.css` (Base + Variants + Sizes)
- [x] `shared/cards.css` (Header/Body/Footer 구조화)
- [x] `shared/inputs.css` (FormField 래퍼 및 상태별 스타일)
- [x] `shared/badges.css` (Solid/Soft 테마 구분)
- [x] `shared/layout.css` (Page/Section/Responsive Grid)
- [x] `shared/portal-header.css` 리팩토링 및 시맨틱화

### Next.js Platform Setup

- [x] Next.js App Router 구조 초기화
- [x] TypeScript Strict Mode 및 절대 경로(@/*) 설정
- [x] ESLint CLI 기반 정적 분석 환경 구축 (.eslintignore 포함)
- [x] `pnpm` 기반 패키지 매니저 정렬 및 락파일 관리
- [x] 글로벌 CSS 통합 및 디자인 토큰 연결 기반 마련
- [x] WorkPortal 홈 화면 (app/page.tsx) 마이그레이션 및 API 연동
- [x] WorkPortal 로그인 페이지 (app/login/page.tsx) 및 인증 로직 구현
- [x] WorkPortal 사용 이력 페이지 (app/activity/page.tsx) 및 필터/페이징 구현


### React UI Components (Implementation)

- [x] 컴포넌트 디렉토리 및 Export 구조 설계 (`components/ui`, `layout`)
- [x] 클래스명 조합 유틸리티 `cx` 구현 (Type-safe)
- [x] `Button` 컴포넌트 (HTMLAttributes 확장 및 Props 매핑)
- [x] `Card` 컴포넌트 (Dot notation: Header, Body 등 지원)
- [x] `Input`, `Textarea`, `Select`, `FormField` 컴포넌트
- [x] `Badge` 컴포넌트 (Solid/Soft 변체 대응)
- [x] `PortalHeader` 및 레이아웃 관련 컴포넌트 (`Page`, `Section`, `Stack` 등)

---

## 15. Final Principles

```txt
1. 디자인 기준은 프로젝트 루트의 DESIGN.md에 문서화한다.
2. 실제 CSS 값은 shared/*.css에서 관리한다.
3. 서비스 CSS에서는 공통 토큰을 우선 사용한다.
4. 기존 변수명과 클래스명은 alias로 유지하고 점진적으로 제거한다.
5. 신규 UI는 Button, Card, Input, Badge 기준에 맞춘다.
6. spacing은 4px grid를 기준으로 한다.
7. 버튼은 class="btn ..." 형태로 작성한다.
8. 카드는 class="card ..." 형태로 작성한다.
9. 신규 UI와 이전 대상 UI는 React + TypeScript 컴포넌트 기준으로 작성한다.
10. 최종적으로 Next.js App Router 기반 구조로 이전한다.
```

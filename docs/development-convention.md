# Development Convention

## 문서 목적

현재 프로젝트는 여러 업무 서비스를 하나의 포탈에서 제공하는 구조이다.

따라서 코드의 일관성, 유지보수성, 확장성, 협업 안정성을 높이기 위해 공통 개발 기준이 필요하다.

본 컨벤션은 다음 항목을 기준으로 작성한다.

```txt
코드 작성 방식
파일 및 폴더 구조
Lint & Formatting
브라우저 호환성
테스트 전략
성능 최적화
접근성
Git 및 기타 협업 규칙
```

---

## 1. 코드 컨벤션

### 1.1 기본 원칙

에듀올랩 통합 업무 포탈은 로그인, 서비스 바로가기, 게시판, 캘린더, 알림, 사용 이력, 관리자 기능 등 다양한 화면과 상태를 가지는 업무용 서비스이다.

따라서 코드 작성 시 다음 원칙을 따른다.

### 기능별 책임을 명확하게 분리한다

기능은 역할별로 분리한다.

```txt
UI 컴포넌트
API 요청
타입 정의
폼 검증 스키마
상태 관리
유틸 함수
상수
```

### 서버 상태와 클라이언트 상태를 분리한다

서버에서 받아오는 데이터는 TanStack Query로 관리한다.

```txt
서비스 목록
사용자 정보
게시글 목록
일정 데이터
대시보드 데이터
API 응답 데이터
```

모달, 토스트, 사이드바 상태처럼 화면 내부에서만 필요한 상태는 Zustand로 관리한다.

```txt
모달 열림/닫힘
토스트 메시지
사이드바 접힘/펼침
드롭다운 상태
클라이언트 전용 UI 상태
```

서버 응답 데이터를 특별한 이유 없이 Zustand에 저장하지 않는다.

### 재사용 가능한 코드는 공통 영역으로 분리한다

여러 도메인에서 재사용되는 코드는 `shared/` 하위에 둔다.

```txt
Button
Input
Modal
Dialog
Table
Header
Layout
날짜 포맷 함수
className 병합 함수
문자열 처리 함수
```

### TypeScript 타입을 적극적으로 사용한다

다음 항목은 타입을 명확히 정의한다.

```txt
API 응답 타입
컴포넌트 props 타입
폼 데이터 타입
전역 상태 타입
도메인 모델 타입
```

---

## 1.2 폴더 구조 컨벤션

마이그레이션 후 프로젝트는 다음 구조를 기준으로 한다.

```txt
src/
  app/
    layout.tsx
    page.tsx
    loading.tsx
    error.tsx
    not-found.tsx

    login/
      page.tsx

    portal/
      page.tsx

    meeting/
      page.tsx

    newsletter/
      page.tsx

    bidding/
      page.tsx

    dashboard/
      page.tsx

  features/
    auth/
      api/
      components/
      hooks/
      schemas/
      stores/
      types/

    portal/
      api/
      components/
      hooks/
      schemas/
      stores/
      types/

    meeting/
      api/
      components/
      hooks/
      schemas/
      stores/
      types/

    newsletter/
      api/
      components/
      hooks/
      schemas/
      stores/
      types/

    bidding/
      api/
      components/
      hooks/
      schemas/
      stores/
      types/

  shared/
    api/
      axios.ts
      query-client.ts

    components/
      ui/
      layout/
      common/

    constants/
    hooks/
    lib/
    stores/
    styles/
    types/
```

| 폴더                        | 역할                                                       |
| --------------------------- | ---------------------------------------------------------- |
| `app/`                      | Next.js App Router 기반 라우팅, 레이아웃, 페이지 파일 관리 |
| `features/`                 | 도메인별 기능 코드 관리                                    |
| `features/*/api/`           | 도메인별 API 요청 함수 관리                                |
| `features/*/components/`    | 특정 도메인에서만 사용하는 컴포넌트 관리                   |
| `features/*/hooks/`         | 도메인 전용 커스텀 훅 관리                                 |
| `features/*/schemas/`       | Zod 기반 입력값 검증 스키마 관리                           |
| `features/*/stores/`        | 도메인 전용 Zustand store 관리                             |
| `features/*/types/`         | 도메인 전용 TypeScript 타입 관리                           |
| `shared/api/`               | Axios 인스턴스, QueryClient 등 API 공통 설정 관리          |
| `shared/components/ui/`     | shadcn/ui 기반 공통 UI 컴포넌트 관리                       |
| `shared/components/layout/` | Header, Sidebar, MainLayout 등 레이아웃 컴포넌트 관리      |
| `shared/components/common/` | 여러 도메인에서 재사용되는 공통 컴포넌트 관리              |
| `shared/hooks/`             | 여러 도메인에서 재사용 가능한 커스텀 훅 관리               |
| `shared/lib/`               | 날짜 포맷, 문자열 처리, className 병합 등 유틸 함수 관리   |
| `shared/stores/`            | 토스트, 모달, 사이드바 등 전역 UI 상태 관리                |
| `shared/styles/`            | 공통 스타일, 디자인 토큰 관리                              |
| `shared/types/`             | 프로젝트 전역에서 사용하는 공통 타입 관리                  |

---

## 1.3 파일 네이밍 컨벤션

| 대상           | 네이밍 규칙              | 예시                 |
| -------------- | ------------------------ | -------------------- |
| React 컴포넌트 | PascalCase               | `ServiceCard.tsx`    |
| 커스텀 훅      | use prefix               | `useServices.ts`     |
| API 함수 파일  | 도메인명 + `.api.ts`     | `portal.api.ts`      |
| 타입 파일      | 도메인명 + `.types.ts`   | `user.types.ts`      |
| Zod 스키마     | 도메인명 + `.schema.ts`  | `login.schema.ts`    |
| Zustand store  | 도메인명 + `.store.ts`   | `modal.store.ts`     |
| 유틸 함수      | 기능명 + `.utils.ts`     | `date.utils.ts`      |
| 상수 파일      | 기능명 + `.constants.ts` | `route.constants.ts` |
| 테스트 파일    | 원본 파일명 + `.test.ts` | `date.utils.test.ts` |
| E2E 테스트     | 시나리오명 + `.spec.ts`  | `login.spec.ts`      |

---

## 1.4 컴포넌트 작성 규칙

컴포넌트는 기본적으로 함수형 컴포넌트로 작성한다.

```txt
컴포넌트명은 PascalCase로 작성한다.
props 타입은 컴포넌트 상단에 선언한다.
props 이름은 역할이 명확하게 드러나도록 작성한다.
컴포넌트 하나가 너무 많은 역할을 가지지 않도록 한다.
UI가 길어지면 하위 컴포넌트로 분리한다.
데이터 요청 로직이 복잡하면 커스텀 훅으로 분리한다.
공통 UI는 shared/components/ui에 둔다.
도메인 전용 UI는 features/{domain}/components에 둔다.
```

좋은 예시:

```tsx
type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
};

export function ServiceCard({ title, description, href }: ServiceCardProps) {
  return (
    <a href={href} className="card card--clickable">
      <h3>{title}</h3>
      <p>{description}</p>
    </a>
  );
}
```

---

## 1.5 TypeScript 작성 규칙

TypeScript는 API 응답, 사용자 정보, 일정, 게시글, 알림 등 복잡한 데이터 구조를 안전하게 관리하기 위해 사용한다.

```txt
any 사용은 금지한다.
타입을 알 수 없는 값은 unknown으로 받고 타입 좁히기를 사용한다.
API 응답 타입은 반드시 정의한다.
컴포넌트 props 타입은 반드시 정의한다.
폼 데이터 타입은 Zod schema에서 추론하는 방식을 우선한다.
enum보다는 union type을 우선 사용한다.
중복 타입은 도메인별 types 폴더로 분리한다.
```

나쁜 예시:

```tsx
function getUserName(user: any) {
  return user.name;
}
```

좋은 예시:

```tsx
type User = {
  id: string;
  name: string;
};

function getUserName(user: User) {
  return user.name;
}
```

---

## 1.6 Server Component / Client Component 컨벤션

Next.js App Router에서는 기본적으로 Server Component를 사용한다.

### Server Component를 사용하는 경우

```txt
정적 콘텐츠 중심 페이지
SEO가 필요한 페이지
서버에서 데이터를 먼저 불러와도 되는 페이지
공통 레이아웃
사용자 인터랙션이 거의 없는 화면
```

### Client Component를 사용하는 경우

다음 기능이 필요한 경우에만 파일 상단에 `'use client'`를 작성한다.

```txt
useState, useEffect 사용
클릭, 입력, 드래그 등 사용자 이벤트 처리
Zustand store 사용
TanStack Query 사용
React Hook Form 사용
브라우저 API 사용
모달, 드롭다운, 탭 등 인터랙션 UI 구현
```

페이지 전체를 불필요하게 Client Component로 만들지 않는다.

---

## 2. Lint & Formatting

코드 스타일은 개인 취향에 따라 작성하지 않고, ESLint와 Prettier를 기준으로 통일한다.

마이그레이션 후 `package.json`에는 다음 스크립트를 추가한다.

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

### 2.1 Prettier 규칙

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### 2.2 Formatting 기준

```txt
들여쓰기는 2 spaces를 사용한다.
문자열은 작은따옴표를 사용한다.
세미콜론은 사용한다.
한 줄 길이는 100자 내외로 제한한다.
불필요한 공백과 빈 줄은 제거한다.
import 순서는 자동 정렬한다.
사용하지 않는 변수와 import는 제거한다.
```

### 2.3 ESLint 기준

ESLint는 다음 항목을 검사한다.

```txt
사용하지 않는 변수
사용하지 않는 import
잘못된 React Hook 사용
접근성 위반 가능 코드
import 순서
TypeScript 타입 오류 가능성
Next.js 권장 규칙 위반
```

PR 전에는 다음 명령어를 실행한다.

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

E2E 테스트가 필요한 작업일 경우 다음 명령어도 실행한다.

```bash
pnpm test:e2e
```

---

## 3. 브라우저 호환성

### 3.1 지원 브라우저

| 브라우저       | 지원 기준                |
| -------------- | ------------------------ |
| Chrome         | 최신 2개 버전            |
| Edge           | 최신 2개 버전            |
| Safari         | 최신 2개 버전            |
| Mobile Safari  | iOS 최신 2개 메이저 버전 |
| Android Chrome | 최신 2개 버전            |

### 3.2 반응형 기준

통합 업무 포탈은 데스크톱 업무 환경이 중심이지만, 모바일에서도 주요 기능 확인이 가능해야 한다.

| 구간    | 기준        |
| ------- | ----------- |
| Mobile  | 360px 이상  |
| Tablet  | 768px 이상  |
| Desktop | 1024px 이상 |
| Wide    | 1280px 이상 |

### 3.3 브라우저 확인 항목

UI 변경 시 다음 항목을 확인한다.

```txt
로그인 페이지가 모바일에서 깨지지 않는가
사이드바가 작은 화면에서 접히는가
테이블이 모바일에서 가로 스크롤 또는 카드 형태로 처리되는가
모달이 화면 밖으로 벗어나지 않는가
드롭다운, 탭, 캘린더가 터치로 조작 가능한가
Safari에서 input, sticky layout, date picker가 정상 동작하는가
```

---

## 4. 테스트 전략

### 4.1 테스트 계층

테스트는 단위 테스트, 컴포넌트 테스트, E2E 테스트로 나눈다.

| 구분            | 도구                  | 테스트 대상                                 |
| --------------- | --------------------- | ------------------------------------------- |
| 단위 테스트     | Vitest                | 유틸 함수, Zod 스키마, Zustand action       |
| 컴포넌트 테스트 | React Testing Library | 버튼, 폼, 모달, 탭, 조건부 렌더링           |
| E2E 테스트      | Playwright            | 로그인, 서비스 이동, 게시글 작성, 일정 등록 |

---

### 4.2 단위 테스트

단위 테스트는 가장 작은 로직을 검증한다.

테스트 대상은 다음과 같다.

```txt
날짜 포맷 함수
문자열 처리 함수
숫자 포맷 함수
Zod validation schema
Zustand store action
API 응답 변환 함수
```

예시:

```tsx
import { describe, expect, it } from "vitest";
import { formatDate } from "./date.utils";

describe("formatDate", () => {
  it("날짜를 YYYY.MM.DD 형식으로 변환한다.", () => {
    expect(formatDate("2026-06-12")).toBe("2026.06.12");
  });
});
```

---

### 4.3 컴포넌트 테스트

컴포넌트 테스트는 내부 구현보다 사용자가 실제로 보는 화면과 상호작용을 기준으로 작성한다.

테스트 대상은 다음과 같다.

```txt
버튼 클릭
모달 열림/닫힘
폼 입력
에러 메시지 노출
탭 전환
검색 결과 노출
Loading 상태
Error 상태
Empty 상태
```

---

### 4.4 E2E 테스트

E2E 테스트는 실제 브라우저에서 사용자 흐름을 검증한다.

| 시나리오    | 검증 내용                                       |
| ----------- | ----------------------------------------------- |
| 로그인      | 사용자가 로그인 후 포탈 메인으로 이동하는가     |
| 서비스 이동 | 포탈 카드 클릭 시 해당 서비스로 이동하는가      |
| 검색        | 서비스명을 검색했을 때 결과가 필터링되는가      |
| 게시글 작성 | 게시글 작성 후 목록에 반영되는가                |
| 일정 등록   | 캘린더에 일정이 정상 등록되는가                 |
| 오류 화면   | 잘못된 경로 접근 시 not-found 화면이 노출되는가 |

---

## 5. 성능 최적화

### 5.1 렌더링 전략

Next.js에서는 화면 특성에 따라 렌더링 방식을 다르게 적용한다.

| 화면          | 권장 방식            | 이유                                                   |
| ------------- | -------------------- | ------------------------------------------------------ |
| 로그인        | Client Component     | 사용자 입력과 폼 검증이 중심이기 때문                  |
| 포탈 메인     | SSR 또는 동적 렌더링 | 사용자별 접근 권한과 서비스 목록이 달라질 수 있기 때문 |
| 공지 / 가이드 | SSG                  | 자주 바뀌지 않는 정적 콘텐츠이기 때문                  |
| 게시판 목록   | SSR + TanStack Query | 초기 데이터와 클라이언트 갱신이 모두 필요하기 때문     |
| 캘린더        | Client Component     | 날짜 선택, 드래그, 일정 등록 등 인터랙션이 많기 때문   |
| 대시보드      | SSR + Client Chart   | 초기 데이터와 차트 인터랙션을 분리하기 위해서          |

---

### 5.2 컴포넌트 최적화

```txt
불필요하게 모든 컴포넌트를 Client Component로 만들지 않는다.
상태는 필요한 위치에만 둔다.
전역 상태는 여러 컴포넌트가 공유해야 할 때만 사용한다.
큰 컴포넌트는 작은 컴포넌트로 분리한다.
목록 렌더링 시 key는 index가 아니라 고유 id를 사용한다.
```

나쁜 예시:

```tsx
{
  items.map((item, index) => <ServiceCard key={index} item={item} />);
}
```

좋은 예시:

```tsx
{
  items.map((item) => <ServiceCard key={item.id} item={item} />);
}
```

---

### 5.3 TanStack Query 최적화

서버 데이터는 TanStack Query로 관리한다.

```tsx
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    staleTime: 1000 * 60,
  });
}
```

---

### 5.4 Query Key 규칙

```tsx
["services"];
["services", serviceId];
["posts", { page, keyword }];
["calendar-events", { startDate, endDate }];
```

Query Key 작성 기준은 다음과 같다.

```txt
query key는 배열로 작성한다.
목록과 상세 query key를 분리한다.
필터, 페이지, 검색어는 query key에 포함한다.
데이터 변경 후에는 관련 query를 invalidate한다.
```

---

### 5.5 이미지 최적화

Next.js에서는 이미지 최적화를 위해 `next/image` 사용을 우선한다.

```tsx
import Image from "next/image";

<Image
  src="/images/logo.png"
  alt="에듀올랩"
  width={160}
  height={48}
  priority
/>;
```

이미지 사용 기준은 다음과 같다.

```txt
로고, 프로필 이미지, 썸네일은 next/image를 사용한다.
중요한 첫 화면 이미지는 priority를 사용한다.
의미 있는 이미지는 alt를 작성한다.
장식 이미지는 빈 alt 또는 CSS background로 처리한다.
불필요하게 큰 원본 이미지를 사용하지 않는다.
```

---

## 6. 접근성

### 6.1 기본 원칙

접근성은 모든 사용자가 키보드, 스크린리더, 모바일 환경에서도 서비스를 사용할 수 있도록 보장하기 위한 기준이다.

업무 포탈은 실제 업무에 사용하는 서비스이므로, 단순히 화면이 보이는 것뿐만 아니라 키보드 조작, 명확한 레이블, 에러 안내, 포커스 이동까지 고려해야 한다.

---

### 6.2 시맨틱 태그

HTML 구조는 의미에 맞는 태그를 사용한다.

```html
<header>상단 헤더</header>
<nav aria-label="주요 메뉴">메뉴</nav>
<main>페이지 본문</main>
<section aria-labelledby="service-title">서비스 목록</section>
<footer>하단 정보</footer>
```

작성 기준은 다음과 같다.

```txt
페이지의 핵심 내용은 main 안에 둔다.
메뉴는 nav를 사용한다.
반복 카드 목록은 필요에 따라 ul, li 구조를 사용한다.
제목 계층은 h1 → h2 → h3 순서를 지킨다.
장식용 아이콘에는 aria-hidden="true"를 사용한다.
```

---

### 6.3 버튼과 링크 구분

버튼과 링크는 역할에 맞게 사용한다.

| 상황           | 사용 태그                |
| -------------- | ------------------------ |
| 페이지 이동    | `<Link>` 또는 `<a>`      |
| 외부 링크 이동 | `<a>`                    |
| 모달 열기      | `<button>`               |
| 폼 제출        | `<button type="submit">` |
| 탭 전환        | `<button role="tab">`    |

나쁜 예시:

```tsx
<div onClick={handleClick}>저장</div>
```

좋은 예시:

```tsx
<button type="button" onClick={handleClick}>
  저장
</button>
```

---

### 6.4 폼 접근성

폼 입력창은 label과 연결한다.

```tsx
<label htmlFor="email">이메일</label>
<input id="email" type="email" />
```

에러 메시지는 `aria-describedby`로 연결한다.

```tsx
<input
  id="email"
  type="email"
  aria-invalid={!!errors.email}
  aria-describedby="email-error"
/>

<p id="email-error">{errors.email?.message}</p>
```

폼 작성 기준은 다음과 같다.

```txt
모든 input에는 label을 연결한다.
에러가 있는 input에는 aria-invalid를 사용한다.
에러 메시지는 aria-describedby로 연결한다.
필수 입력값은 시각적으로만 표시하지 않고 텍스트로도 안내한다.
```

---

### 6.5 키보드 접근성

```txt
모든 버튼과 링크는 Tab 키로 접근 가능해야 한다.
Enter 또는 Space로 주요 액션이 실행되어야 한다.
포커스 스타일을 제거하지 않는다.
모달이 열리면 포커스가 모달 안으로 이동해야 한다.
모달이 열려 있는 동안 포커스가 모달 안에 머물러야 한다.
Escape 키로 모달을 닫을 수 있어야 한다.
드롭다운, 탭, 캘린더 등은 키보드 조작 가능성을 고려한다.
```

---

## 7. 기타

### 7.1 패키지 관리

패키지 매니저는 pnpm으로 통일한다.

```bash
pnpm install
pnpm dev
pnpm build
```

다음 lockfile은 생성하거나 커밋하지 않는다.

```txt
package-lock.json
yarn.lock
```

커밋하면 안 되는 항목은 다음과 같다.

```txt
node_modules/
.env
.env.local
.env.*
dist/
.next/
```

---

### 7.2 환경 변수 관리

환경 변수는 `.env.local`에서 관리한다.

예시:

```txt
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_APP_URL=
```

환경 변수 작성 기준은 다음과 같다.

```txt
브라우저에 노출되어도 되는 값만 NEXT_PUBLIC_을 붙인다.
access token, refresh token, secret key는 클라이언트 환경 변수에 두지 않는다.
.env.local은 로컬 개발용으로만 사용한다.
.env.example을 만들어 필요한 환경 변수 목록만 공유한다.
실제 운영 값은 문서나 GitHub에 직접 작성하지 않는다.
```

---

### 7.3 Git 브랜치 전략

브랜치명은 다음 규칙을 따른다.

```txt
feature/기능명
fix/수정명
refactor/개선명
docs/문서명
chore/설정명
test/테스트명
```

예시:

```txt
feature/portal-main-page
feature/meeting-upload-form
fix/login-redirect
refactor/service-card-component
docs/development-convention
test/login-form
chore/eslint-config
```

---

### 7.4 커밋 메시지 규칙

커밋 메시지는 다음 형식을 사용한다.

```txt
type: 작업 내용
```

예시:

```txt
feat: 통합 포탈 메인 페이지 구현
fix: 로그인 후 리다이렉트 오류 수정
refactor: 서비스 카드 컴포넌트 분리
style: 공통 버튼 스타일 정리
docs: 개발 컨벤션 문서 추가
test: 로그인 폼 테스트 추가
chore: eslint 설정 추가
```

### 7.5 커밋 타입

| 타입       | 의미                          |
| ---------- | ----------------------------- |
| `feat`     | 기능 추가                     |
| `fix`      | 버그 수정                     |
| `refactor` | 기능 변경 없는 코드 구조 개선 |
| `style`    | UI 스타일 또는 포맷 수정      |
| `docs`     | 문서 수정                     |
| `test`     | 테스트 추가 또는 수정         |
| `chore`    | 설정, 패키지, 빌드 관련 작업  |
| `perf`     | 성능 개선                     |
| `ci`       | CI 설정 변경                  |

---

### 7.6 PR 체크리스트

PR 작성 시 다음 항목을 확인한다.

```md
## 작업 내용

-

## 확인한 내용

- [ ] pnpm lint 통과
- [ ] pnpm type-check 통과
- [ ] pnpm test 통과
- [ ] pnpm build 통과
- [ ] 모바일 화면 확인
- [ ] 접근성 기본 항목 확인
- [ ] 불필요한 console.log 제거
- [ ] 환경 변수 또는 민감 정보 포함 여부 확인

## 스크린샷

-
```

---

## 8. 작업 전 확인 사항

작업 전에는 다음 문서를 먼저 확인한다.

```txt
DESIGN.md
AGENTS.md
docs/development-convention.md
```

UI 작업 시에는 반드시 `DESIGN.md`의 디자인 기준을 따른다.

개발 작업 시에는 본 문서의 코드 컨벤션, 폴더 구조, 테스트 전략, 접근성 기준을 따른다.

---

## 9. 작업 완료 전 확인 사항

작업 완료 전에는 다음 항목을 확인한다.

```txt
불필요한 hard-coded color가 없는가
임의 spacing 값이 추가되지 않았는가
중복된 button/card 스타일이 추가되지 않았는가
사용하지 않는 import가 없는가
불필요한 console.log가 없는가
환경 변수 또는 민감 정보가 포함되지 않았는가
기존 기능이 유지되는가
모바일 화면이 깨지지 않는가
접근성 기본 항목을 위반하지 않았는가
```

가능하면 PR 전 다음 명령어를 실행한다.

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

E2E 영향이 있는 작업은 다음 명령어도 실행한다.

```bash
pnpm test:e2e
```

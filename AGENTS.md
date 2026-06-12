# AGENTS.md

## 1. Purpose

This document defines the development rules that AI agents and contributors must follow when working in this repository.

The project is the Eduallab WorkPortal, an integrated work portal that contains multiple services such as login, service navigation, meeting automation, newsletter generation, bidding, dashboard, ebook, and PPT tools.

The goal of this document is to improve:

```txt
Code consistency
Maintainability
Scalability
Collaboration stability
Migration safety
```

Before modifying code, always read this file and follow the rules below.

---

## 2. Required Reading

Before working on UI or frontend code, always read:

```txt
DESIGN.md
AGENTS.md
```

`DESIGN.md` is the source of truth for visual design decisions.

It defines:

```txt
Color tokens
Typography rules
Spacing scale
Button styles
Card styles
Input / Badge / Header / Layout direction
Responsive behavior
Migration direction
```

`AGENTS.md` defines:

```txt
Code conventions
Folder structure
Lint and formatting rules
Browser compatibility
Testing strategy
Performance rules
Accessibility rules
Git and PR rules
```

Do not introduce new UI patterns, colors, spacing values, button styles, or card styles without checking `DESIGN.md`.

---

## 3. Project Direction

The current project contains multiple HTML/CSS/JavaScript-based services.

The long-term direction is:

```txt
1. Define shared design tokens
2. Define shared UI component styles
3. Apply shared tokens to existing services
4. Convert common UI to React + TypeScript components
5. Rebuild the page structure with Next.js App Router
6. Migrate existing HTML services one by one
```

Do not rewrite all services at once.

Prefer gradual migration with compatibility aliases.

---

## 4. Package Manager

Use `pnpm` as the package manager.

```bash
pnpm install
pnpm dev
pnpm build
```

Do not commit other lockfiles.

```txt
package-lock.json
yarn.lock
```

Do not commit generated or sensitive files.

```txt
node_modules/
.env
.env.local
.env.*
dist/
.next/
```

---

## 5. Code Convention

### 5.1 Basic Principles

When writing code, follow these principles:

```txt
Separate responsibilities clearly.
Separate server state and client state.
Move reusable code into shared areas.
Use TypeScript types actively.
Avoid large components with too many responsibilities.
Prefer small, reviewable changes.
```

Responsibilities should be separated into:

```txt
UI components
API request functions
Type definitions
Form validation schemas
State stores
Utility functions
Constants
```

### 5.2 Server State and Client State

Server state should be managed with TanStack Query.

Examples:

```txt
API response data
Service lists
User information
Posts
Calendar events
Dashboard data
```

Client state should be managed with Zustand only when the state is UI-local or shared across components.

Examples:

```txt
Modal state
Toast state
Sidebar state
Dropdown state
Client-only UI state
```

Do not put server response data into Zustand unless there is a specific reason.

---

## 6. Folder Structure

After migration, use the following structure as the standard.

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

### 6.1 Folder Responsibilities

| Folder                      | Responsibility                                                         |
| --------------------------- | ---------------------------------------------------------------------- |
| `app/`                      | Next.js App Router pages, layouts, loading, error, and not-found files |
| `features/`                 | Domain-specific feature code                                           |
| `features/*/api/`           | Domain-specific API request functions                                  |
| `features/*/components/`    | Components used only in that domain                                    |
| `features/*/hooks/`         | Domain-specific custom hooks                                           |
| `features/*/schemas/`       | Zod validation schemas                                                 |
| `features/*/stores/`        | Domain-specific Zustand stores                                         |
| `features/*/types/`         | Domain-specific TypeScript types                                       |
| `shared/api/`               | Axios instance, QueryClient, and API common settings                   |
| `shared/components/ui/`     | Shared UI components such as Button, Input, Modal, Dialog, Table       |
| `shared/components/layout/` | Header, Sidebar, MainLayout, and layout components                     |
| `shared/components/common/` | Reusable common components                                             |
| `shared/hooks/`             | Reusable custom hooks                                                  |
| `shared/lib/`               | Utility functions such as date formatting and className merging        |
| `shared/stores/`            | Global UI stores such as toast, modal, and sidebar                     |
| `shared/styles/`            | Shared styles and design tokens                                        |
| `shared/types/`             | Global shared types                                                    |

---

## 7. File Naming Convention

| Target          | Naming Rule               | Example              |
| --------------- | ------------------------- | -------------------- |
| React component | PascalCase                | `ServiceCard.tsx`    |
| Custom hook     | use prefix                | `useServices.ts`     |
| API file        | domain + `.api.ts`        | `portal.api.ts`      |
| Type file       | domain + `.types.ts`      | `user.types.ts`      |
| Zod schema      | domain + `.schema.ts`     | `login.schema.ts`    |
| Zustand store   | domain + `.store.ts`      | `modal.store.ts`     |
| Utility file    | feature + `.utils.ts`     | `date.utils.ts`      |
| Constant file   | feature + `.constants.ts` | `route.constants.ts` |
| Unit test file  | source file + `.test.ts`  | `date.utils.test.ts` |
| E2E test file   | scenario + `.spec.ts`     | `login.spec.ts`      |

---

## 8. Component Rules

React components must follow these rules:

```txt
Use function components.
Use PascalCase component names.
Define props types explicitly.
Use clear prop names.
Keep each component focused on one responsibility.
Split large UI into smaller components.
Move complex data logic into custom hooks.
Place shared UI in shared/components/ui.
Place domain-specific UI in features/{domain}/components.
```

Good example:

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

## 9. TypeScript Rules

Use TypeScript actively.

```txt
Do not use any.
Use unknown when the type is not known.
Define API response types.
Define component props types.
Infer form types from Zod schemas when possible.
Prefer union types over enum.
Move duplicated types into domain types folders.
```

Bad example:

```tsx
function getUserName(user: any) {
  return user.name;
}
```

Good example:

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

## 10. Server Component and Client Component Rules

In Next.js App Router, use Server Components by default.

### 10.1 Use Server Components For

```txt
Static content pages
SEO-sensitive pages
Pages that can fetch data on the server
Shared layouts
Screens with little or no user interaction
```

### 10.2 Use Client Components Only When Needed

Add `'use client'` only when the component needs:

```txt
useState
useEffect
Click, input, drag, or browser events
Zustand store
TanStack Query
React Hook Form
Browser APIs
Modal, dropdown, tab, calendar, or other interactive UI
```

Do not mark an entire page as a Client Component unless necessary.

---

## 11. Design System Rules

When editing UI styles, follow `DESIGN.md`.

```txt
Use CSS variables from shared styles.
Use semantic color tokens.
Use spacing tokens based on the 4px grid.
Use .btn for buttons.
Use .card for cards.
Do not hard-code hex colors unless defining tokens.
Do not create service-specific button or card systems.
Do not remove legacy classes immediately.
```

Correct example:

```html
<button class="btn btn--primary">저장</button>
```

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
}
```

Incorrect example:

```css
.button {
  background: #3182f6;
  padding: 13px 18px;
}
```

---

## 12. Legacy Compatibility Rules

Do not remove existing classes immediately.

Use compatibility mapping first.

```txt
.btn-primary
→ class="btn btn--primary"

.btn-ghost
→ class="btn btn--secondary"

.portal-tile
→ class="card card--clickable portal-tile"

.side-card
→ class="card card--soft side-card"

.app
→ class="card card--container app"
```

After migration is stable, legacy classes can be removed gradually.

---

## 13. Lint and Formatting

Use ESLint and Prettier to keep code style consistent.

Recommended scripts:

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

### 13.1 Prettier Rules

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### 13.2 Formatting Rules

```txt
Use 2 spaces for indentation.
Use single quotes for strings.
Use semicolons.
Keep line length around 100 characters.
Remove unnecessary whitespace.
Remove unused variables.
Remove unused imports.
Use automatic import sorting if configured.
```

### 13.3 Required Checks Before PR

Run these commands before opening a PR:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

If the change affects end-to-end flows, also run:

```bash
pnpm test:e2e
```

---

## 14. Browser Compatibility

### 14.1 Supported Browsers

| Browser        | Support                     |
| -------------- | --------------------------- |
| Chrome         | Latest 2 versions           |
| Edge           | Latest 2 versions           |
| Safari         | Latest 2 versions           |
| Mobile Safari  | Latest 2 major iOS versions |
| Android Chrome | Latest 2 versions           |

### 14.2 Responsive Breakpoints

The portal is desktop-first for work usage, but core features must remain usable on mobile.

| Range   | Width            |
| ------- | ---------------- |
| Mobile  | 360px and above  |
| Tablet  | 768px and above  |
| Desktop | 1024px and above |
| Wide    | 1280px and above |

### 14.3 Browser Check Items

Check the following when UI changes are made:

```txt
Login page does not break on mobile.
Sidebar collapses or adapts on small screens.
Tables support horizontal scroll or card layout on mobile.
Modals do not overflow the viewport.
Dropdowns, tabs, and calendars work with touch input.
Inputs, sticky layout, and date pickers work in Safari.
```

---

## 15. Testing Strategy

Use three levels of tests.

| Type           | Tool                  | Target                                                    |
| -------------- | --------------------- | --------------------------------------------------------- |
| Unit test      | Vitest                | Utilities, Zod schemas, Zustand actions                   |
| Component test | React Testing Library | Buttons, forms, modals, tabs, conditional rendering       |
| E2E test       | Playwright            | Login, service navigation, posting, calendar registration |

### 15.1 Unit Tests

Unit tests should cover small logic units.

Targets:

```txt
Date formatting functions
String utilities
Number formatting functions
Zod validation schemas
Zustand store actions
API response transformers
```

Example:

```tsx
import { describe, expect, it } from "vitest";
import { formatDate } from "./date.utils";

describe("formatDate", () => {
  it("formats a date as YYYY.MM.DD.", () => {
    expect(formatDate("2026-06-12")).toBe("2026.06.12");
  });
});
```

### 15.2 Component Tests

Component tests should focus on what the user sees and does.

Targets:

```txt
Button click
Modal open and close
Form input
Error message display
Tab switching
Search result display
Loading state
Error state
Empty state
```

### 15.3 E2E Tests

E2E tests should verify actual user flows in a browser.

| Scenario           | Verification                                        |
| ------------------ | --------------------------------------------------- |
| Login              | User can log in and move to the portal main page    |
| Service navigation | Clicking a service card moves to the target service |
| Search             | Service search filters results correctly            |
| Post creation      | A post appears after creation                       |
| Calendar event     | Calendar event is registered correctly              |
| Not found          | Invalid routes show the not-found page              |

---

## 16. Performance Rules

### 16.1 Rendering Strategy

Choose rendering strategy based on screen characteristics.

| Screen         | Recommended Strategy     | Reason                                                       |
| -------------- | ------------------------ | ------------------------------------------------------------ |
| Login          | Client Component         | User input and form validation are central                   |
| Portal main    | SSR or dynamic rendering | Service list and permissions can differ by user              |
| Notice / Guide | SSG                      | Mostly static content                                        |
| Board list     | SSR + TanStack Query     | Initial data and client refresh are both needed              |
| Calendar       | Client Component         | Date selection, drag, and event registration are interactive |
| Dashboard      | SSR + Client Chart       | Initial data and chart interaction should be separated       |

### 16.2 Component Optimization

```txt
Do not make every component a Client Component.
Keep state as close as possible to where it is used.
Use global state only when multiple components need it.
Split large components into smaller components.
Use stable unique ids for list keys.
```

Bad example:

```tsx
{
  items.map((item, index) => <ServiceCard key={index} item={item} />);
}
```

Good example:

```tsx
{
  items.map((item) => <ServiceCard key={item.id} item={item} />);
}
```

### 16.3 TanStack Query Rules

Server data should be managed with TanStack Query.

Example:

```tsx
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    staleTime: 1000 * 60,
  });
}
```

### 16.4 Query Key Rules

Use array-based query keys.

```tsx
["services"];
["services", serviceId];
["posts", { page, keyword }];
["calendar-events", { startDate, endDate }];
```

Rules:

```txt
Use arrays for query keys.
Separate list and detail query keys.
Include filters, page, and search keywords in query keys.
Invalidate related queries after mutation.
```

### 16.5 Image Optimization

Use `next/image` when using Next.js.

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

Rules:

```txt
Use next/image for logos, profile images, and thumbnails.
Use priority for important first-view images.
Write alt text for meaningful images.
Use empty alt or CSS background for decorative images.
Do not use unnecessarily large original images.
```

---

## 17. Accessibility Rules

Accessibility must be considered in every UI change.

The portal is a work tool, so it must support keyboard navigation, clear labels, error guidance, and focus management.

### 17.1 Semantic HTML

Use semantic tags.

```html
<header>상단 헤더</header>
<nav aria-label="주요 메뉴">메뉴</nav>
<main>페이지 본문</main>
<section aria-labelledby="service-title">서비스 목록</section>
<footer>하단 정보</footer>
```

Rules:

```txt
Place the main content inside main.
Use nav for navigation.
Use ul and li for repeated card lists when appropriate.
Keep heading hierarchy in order: h1 → h2 → h3.
Use aria-hidden="true" for decorative icons.
```

### 17.2 Button and Link Roles

Use the correct element for the action.

| Situation                | Element                  |
| ------------------------ | ------------------------ |
| Internal page navigation | `<Link>` or `<a>`        |
| External link navigation | `<a>`                    |
| Open modal               | `<button>`               |
| Submit form              | `<button type="submit">` |
| Switch tabs              | `<button role="tab">`    |

Bad example:

```tsx
<div onClick={handleClick}>저장</div>
```

Good example:

```tsx
<button type="button" onClick={handleClick}>
  저장
</button>
```

### 17.3 Form Accessibility

Connect labels and inputs.

```tsx
<label htmlFor="email">이메일</label>
<input id="email" type="email" />
```

Connect error messages with `aria-describedby`.

```tsx
<input
  id="email"
  type="email"
  aria-invalid={!!errors.email}
  aria-describedby="email-error"
/>

<p id="email-error">{errors.email?.message}</p>
```

Rules:

```txt
Every input must have a connected label.
Use aria-invalid when an input has an error.
Connect error messages with aria-describedby.
Do not indicate required fields only with color or symbols.
```

### 17.4 Keyboard Accessibility

```txt
All buttons and links must be reachable with Tab.
Main actions must work with Enter or Space.
Do not remove focus styles.
When a modal opens, focus must move into the modal.
Focus must remain inside the modal while it is open.
Escape should close modals when appropriate.
Dropdowns, tabs, and calendars should consider keyboard interaction.
```

---

## 18. Environment Variables

Environment variables should be managed with `.env.local`.

Example:

```txt
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_APP_URL=
```

Rules:

```txt
Use NEXT_PUBLIC_ only for values that can be exposed to the browser.
Do not store access tokens, refresh tokens, or secret keys in client environment variables.
Use .env.local only for local development.
Create .env.example to document required variables.
Do not write production secrets in documentation or GitHub.
```

---

## 19. Git Branch Rules

Use a separate branch for each task.

Branch format:

```txt
feature/task-name
fix/task-name
refactor/task-name
docs/task-name
chore/task-name
test/task-name
```

Examples:

```txt
feature/portal-main-page
feature/meeting-upload-form
fix/login-redirect
refactor/service-card-component
docs/development-convention
test/login-form
chore/eslint-config
```

Do not mix unrelated changes in one branch.

---

## 20. Commit Message Rules

Use this commit message format:

```txt
type: description
```

Examples:

```txt
feat: implement portal main page
fix: resolve login redirect issue
refactor: extract service card component
style: add shared button styles
docs: add development convention
test: add login form test
chore: add eslint config
```

### 20.1 Commit Types

| Type       | Meaning                                            |
| ---------- | -------------------------------------------------- |
| `feat`     | New feature                                        |
| `fix`      | Bug fix                                            |
| `refactor` | Code structure improvement without behavior change |
| `style`    | UI style or formatting change                      |
| `docs`     | Documentation change                               |
| `test`     | Test addition or update                            |
| `chore`    | Config, package, or build-related change           |
| `perf`     | Performance improvement                            |
| `ci`       | CI configuration change                            |

---

## 21. Pull Request Rules

Each PR should include:

```txt
What changed
Why it changed
Affected services
Screenshots if UI changed
Checklist of tested pages
```

Use this PR template:

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

Do not combine unrelated work in one PR.

Bad example:

```txt
Shared button system + login API migration + dashboard refactor
```

Good example:

```txt
Shared button system only
```

---

## 22. Before Finishing a Task

Before completing any task, check:

```txt
DESIGN.md rules are followed.
No unnecessary hard-coded colors were added.
No arbitrary spacing values were added.
No duplicated button/card styles were added.
Existing behavior is preserved.
Legacy compatibility is preserved.
No unused imports remain.
No unnecessary console.log remains.
No environment variables or secrets are included.
```

If scripts exist, run:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

For E2E-sensitive changes, also run:

```bash
pnpm test:e2e
```

---

## 23. Agent Instruction Summary

When working in this repository:

```txt
Read DESIGN.md first before UI work.
Follow shared design tokens.
Use pnpm.
Use TypeScript.
Avoid any.
Use Server Components by default.
Use Client Components only when needed.
Use TanStack Query for server state.
Use Zustand for shared client UI state.
Preserve existing behavior.
Use gradual migration.
Avoid large unrelated rewrites.
Prefer small, reviewable changes.
Run lint, type-check, test, and build before PR.
```

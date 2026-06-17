"use client";

import {
  PortalHeader,
  Page,
  Section,
  Grid,
  Card,
  CardBody,
  Badge,
  Button,
  Stack,
  cx,
} from "@/components";
import {
  SERVICES,
  ServiceId,
  HealthStatus,
  ActivityItem,
  AuthState,
} from "@/features/portal";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// --- Types & Constants ---
type ViewType = "dashboard" | "guide";
type BoardTabType = "recent" | "guide";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/$/,
  ""
);

// --- Helpers ---
function ServiceIcon({ id, className }: { id: ServiceId; className?: string }) {
  switch (id) {
    case "bidding":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      );
    case "meeting":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      );
    case "news":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <line x1="8" y1="11" x2="16" y2="11" />
        </svg>
      );
    case "newsletter":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "ppt":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      );
    case "crayon":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case "fairytale":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
          <path d="M5 19c2-2 4-3 7-3s5 1 7 3" />
        </svg>
      );
    default:
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

function fmtDateTime(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// --- Main Page Component ---
export default function WorkPortalHomePage() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [activeBoardTab, setActiveBoardTab] = useState<BoardTabType>("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [me, setMe] = useState<AuthState | null>(null);
  const [healths, setHealths] = useState<HealthStatus[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [isHealthLoading, setIsHealthLoading] = useState(true);
  const [isRecentLoading, setIsRecentLoading] = useState(true);

  const firstResultRef = useRef<HTMLAnchorElement>(null);

  // Fetch logic
  const apiFetch = useCallback((url: string, opts: RequestInit = {}) => {
    return fetch(API_BASE + url, { credentials: "include", ...opts });
  }, []);

  const loadMe = useCallback(async () => {
    try {
      const r = await apiFetch("/api/me");
      if (r.ok) {
        const data: AuthState = await r.json();
        setMe(data);
      }
    } catch (e) {
      console.error("me load failed", e);
    }
  }, [apiFetch]);

  const refreshHealth = useCallback(async () => {
    try {
      const r = await apiFetch("/api/services/health");
      if (r.ok) {
        const data: HealthStatus[] = await r.json();
        setHealths(data);
      }
    } catch (e) {
      console.warn("health check failed", e);
    } finally {
      setIsHealthLoading(false);
    }
  }, [apiFetch]);

  const loadHomeRecent = useCallback(async () => {
    setIsRecentLoading(true);
    try {
      const r = await apiFetch("/api/activity?limit=5&offset=0");
      if (r.ok) {
        const data: { items?: ActivityItem[] } = await r.json();
        setRecentActivities(data.items || []);
      }
    } catch (e) {
      console.error("recent activity load failed", e);
    } finally {
      setIsRecentLoading(false);
    }
  }, [apiFetch]);

  // Initial load
  useEffect(() => {
    loadMe();
    refreshHealth();
    loadHomeRecent();

    // Polling health status every 30 seconds as in legacy app.js
    const healthInterval = setInterval(refreshHealth, 30_000);

    return () => clearInterval(healthInterval);
  }, [loadMe, refreshHealth, loadHomeRecent]);

  // Filtered services
  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SERVICES;
    return SERVICES.filter((s) => {
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.searchKeywords.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      // UI를 자연스럽게 갱신하기 위해 상태 초기화
      setMe((prev) =>
        prev
          ? {
              ...prev,
              loggedIn: false,
              user: undefined,
            }
          : null
      );
      // 최근 사용 내역 갱신
      void loadHomeRecent();
    } catch (e) {
      console.error("logout failed", e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredServices.length > 0 && searchQuery.trim()) {
      firstResultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      firstResultRef.current?.focus();
    }
  };

  return (
    <>
      <PortalHeader
        logo={
          <Image
            src="/shared/eduallab-logo.png"
            alt="에듀올랩"
            width={120}
            height={40}
            className="brand__logo"
          />
        }
        title="통합 업무 포탈"
        search={
          <form
            className="site-search"
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <input
              type="search"
              placeholder="서비스 검색"
              aria-label="서비스 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="site-search__btn" aria-label="검색">
              <svg
                className="site-search__icon"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
          </form>
        }
        actions={
          <div className="site-header__actions">
            {me?.loggedIn ? (
              <>
                <span className="topbar__user">
                  {me.user?.displayName || me.user?.name || "user"}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="topbar__btn"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </>
            ) : me?.authEnabled ? (
              <Link href="/login" className="topbar__btn topbar__btn--login">
                로그인
              </Link>
            ) : null}
          </div>
        }
      >
        <nav className="site-nav" aria-label="주요 메뉴">
          <button
            className={cx("site-nav__item tab", activeView === "dashboard" && "is-active")}
            onClick={() => setActiveView("dashboard")}
            type="button"
          >
            홈
          </button>
          <Link
            href="/guide"
            className="site-nav__item tab"
          >
            가이드
          </Link>
          <Link href="/activity" className="site-nav__item tab">
            사용 이력
          </Link>
        </nav>
      </PortalHeader>

      <Page className="portal-home">
        {activeView === "dashboard" && (
          <Stack spacing="lg" className="portal-home__content-wrap">
            {/* 히어로 영역 */}
            <section className="portal-hero" aria-label="소개">
              <div className="portal-hero__content">
                <p className="portal-hero__eyebrow">에듀올랩 업무 자동화</p>
                <h1 className="portal-hero__title">통합 업무 포탈</h1>
                <p className="portal-hero__sub">
                  한 번의 로그인으로 입찰·회의록·뉴스·제안서·대시보드·e-book 등
                  업무 서비스를 이용할 수 있습니다.
                </p>
              </div>
              <div className="portal-hero__deco" aria-hidden="true"></div>
            </section>

            {/* 소식/안내 보드 */}
            <Section aria-label="최근 소식 및 이용 안내">
              <Card variant="default">
                <Card.Header className="portal-board__head">
                  <div className="portal-board__tabs" role="tablist">
                    <button
                      type="button"
                      id="tab-recent"
                      className={cx(
                        "portal-board__tab",
                        activeBoardTab === "recent" && "is-active"
                      )}
                      onClick={() => setActiveBoardTab("recent")}
                      role="tab"
                      aria-controls="panel-recent"
                      aria-selected={activeBoardTab === "recent"}
                    >
                      최근 사용
                    </button>
                    <button
                      type="button"
                      id="tab-guide"
                      className={cx(
                        "portal-board__tab",
                        activeBoardTab === "guide" && "is-active"
                      )}
                      onClick={() => setActiveBoardTab("guide")}
                      role="tab"
                      aria-controls="panel-guide"
                      aria-selected={activeBoardTab === "guide"}
                    >
                      이용 안내
                    </button>
                  </div>
                  <Link
                    href="/activity"
                    className="portal-board__more"
                    title="사용 이력 전체 보기"
                    aria-label="사용 이력 전체 보기"
                  >
                    +
                  </Link>
                </Card.Header>
                <Card.Body>
                  {activeBoardTab === "recent" ? (
                    <ul
                      id="panel-recent"
                      className="portal-notice"
                      role="tabpanel"
                      aria-labelledby="tab-recent"
                    >
                      {isRecentLoading ? (
                        <li className="portal-notice__empty">불러오는 중…</li>
                      ) : recentActivities.length > 0 ? (
                        recentActivities.map((row, idx) => (
                          <li key={idx}>
                            <Link
                              href="/activity"
                              className="portal-notice__link"
                              aria-label={`${row.label || row.action} 상세 보기`}
                            >
                              <span className="portal-notice__title">
                                {row.label || row.action || "기능 사용"}
                              </span>
                              <span className="portal-notice__desc">
                                {row.displayName || row.user || "—"} ·{" "}
                                {row.serviceName || row.service}
                                {row.detail ? ` · ${row.detail}` : ""}
                              </span>
                              <time className="portal-notice__date">
                                {fmtDateTime(row.ts)}
                              </time>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="portal-notice__empty">
                          아직 기록이 없습니다. 입찰·회의록을 사용하면 여기에
                          표시됩니다.
                        </li>
                      )}
                    </ul>
                  ) : (
                    <ul
                      id="panel-guide"
                      className="portal-notice portal-notice--guide"
                      role="tabpanel"
                      aria-labelledby="tab-guide"
                    >
                      <li>
                        <Link
                          href="/guide?service=newsletter"
                          className="portal-notice__link"
                          aria-label="이용 안내: 로그인 후 서비스 이용"
                        >
                          <span className="portal-notice__title">
                            로그인 후 서비스 이용
                          </span>
                          <span className="portal-notice__desc">
                            포털에서 로그인하면 연동된 업무 서비스에 별도
                            비밀번호 없이 접속할 수 있습니다.
                          </span>
                          <time className="portal-notice__date">안내</time>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/guide?service=newsletter"
                          className="portal-notice__link"
                        >
                          <span className="portal-notice__title">
                            뉴스레터 발송 가이드
                          </span>
                          <span className="portal-notice__desc">
                            네이버 블로그 기반 소식지 자동 생성 및 대량 발송 서비스 가이드
                          </span>
                          <time className="portal-notice__date">서비스</time>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/guide?service=meeting"
                          className="portal-notice__link"
                        >
                          <span className="portal-notice__title">
                            회의록 자동화
                          </span>
                          <span className="portal-notice__desc">
                            녹음 업로드 후 요약·결정사항·Teams 공유
                          </span>
                          <time className="portal-notice__date">서비스</time>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/guide?service=ppt"
                          className="portal-notice__link"
                        >
                          <span className="portal-notice__title">
                            PPT·제안서 생성
                          </span>
                          <span className="portal-notice__desc">
                            문서 업로드 후 HTML·PPT 제안서 자동 생성
                          </span>
                          <time className="portal-notice__date">서비스</time>
                        </Link>
                      </li>
                    </ul>
                  )}
                </Card.Body>
              </Card>
            </Section>

            {/* 서비스 그리드 및 사이드바 레이아웃 */}
            <div className="portal-layout">
              <header className="portal-layout__title">
                <h2 className="portal-section-title">업무 서비스 바로가기</h2>
              </header>

              <div className="portal-layout__main">
                {filteredServices.length > 0 ? (
                  <div className="portal-services">
                    {filteredServices.map((service, index) => {
                      const health = healths.find((h) => h.id === service.id);
                      return (
                        <a
                          key={service.id}
                          href={service.href}
                          ref={index === 0 ? firstResultRef : null}
                          aria-label={`${service.title} 서비스 열기`}
                          className="portal-tile-wrapper"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <article className="portal-tile">
                            <div
                              className={cx(
                                "portal-tile__icon",
                                `portal-tile__icon--${service.iconType}`
                              )}
                              aria-hidden="true"
                            >
                              <ServiceIcon id={service.id} />
                            </div>
                            <div className="portal-tile__body">
                              <div className="portal-tile__head">
                                <h3 className="portal-tile__title">
                                  {service.title}
                                </h3>
                                <Badge
                                  variant={
                                    health?.status === "up"
                                      ? "success"
                                      : health?.status === "down"
                                        ? "danger"
                                        : "default"
                                  }
                                  soft
                                  size="sm"
                                  className={cx(
                                    !health && "badge--muted",
                                    health?.status === "up" && "badge--ok",
                                    health?.status === "down" && "badge--bad"
                                  )}
                                >
                                  {!health
                                    ? "확인 중…"
                                    : health.status === "up"
                                      ? "정상"
                                      : health.status === "down"
                                        ? "응답 없음"
                                        : "확인 불가"}
                                </Badge>
                              </div>
                              <p className="portal-tile__desc">
                                {service.description}
                              </p>
                              <p className="portal-tile__host">{service.host}</p>
                            </div>
                            <span
                              className="portal-tile__arrow"
                              aria-hidden="true"
                            >
                              →
                            </span>
                          </article>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="activity-empty">검색 결과가 없습니다.</div>
                )}
              </div>

              <aside className="portal-layout__side">
                <section className="portal-sidecard">
                  <header className="portal-sidecard__head">
                    <h3 className="portal-sidecard__title">서비스 상태</h3>
                    <span className="portal-sidecard__sub">
                      {isHealthLoading ? "확인 중…" : "갱신됨"}
                    </span>
                  </header>
                  <ul className="portal-status">
                    {SERVICES.map((s) => {
                      const h = healths.find((x) => x.id === s.id);
                      return (
                        <li key={s.id} className="portal-status__item">
                          <span
                            className={cx(
                              "portal-status__dot",
                              h?.status === "up" && "is-up",
                              h?.status === "down" && "is-down"
                            )}
                            aria-hidden="true"
                          />
                          <div className="portal-status__info">
                            <span className="portal-status__name">
                              {s.title}
                            </span>
                            <span className="portal-status__host">{s.host}</span>
                          </div>
                          <span className="portal-status__meta">
                            {!h
                              ? "확인 중…"
                              : h.status === "up"
                                ? `정상 · ${h.ms ?? "-"}ms`
                                : "응답 없음"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </aside>
            </div>
          </Stack>
        )}
      </Page>
    </>
  );
}

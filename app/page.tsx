"use client";

import { cx } from "@/components";
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

// Service additional info mappings based on user prompt
const SERVICE_INFO: Record<string, { badge: string; desc: string; flows: string[]; domain: string }> = {
  bidding: {
    badge: "조달",
    desc: "공공·민간 입찰 정보를 자동으로 수집해 드려요",
    flows: ["공고 자동 수집", "검수·분류", "알림 발송"],
    domain: "bid.platformers.kr"
  },
  meeting: {
    badge: "AI",
    desc: "녹음 파일만 올리면 회의록이 자동으로 만들어져요",
    flows: ["녹취 업로드", "AI 분석", "회의록 완성"],
    domain: "meeting.platformers.kr"
  },
  news: {
    badge: "뉴스",
    desc: "교육 분야 최신 뉴스를 한 곳에서 확인하세요",
    flows: ["뉴스 자동 수집", "카테고리 분류", "피드 제공"],
    domain: "news.platformers.kr"
  },
  newsletter: {
    badge: "발송",
    desc: "링크만 넣으면 뉴스레터가 완성돼요",
    flows: ["링크 입력", "레이아웃 생성", "메일 발송"],
    domain: "newsletter.platformers.kr"
  },
  ppt: {
    badge: "AI",
    desc: "문서를 업로드하면 PPT 제안서가 완성돼요",
    flows: ["문서 업로드", "AI 변환", "PPT 다운로드"],
    domain: "ppt.platformers.kr"
  },
  crayon: {
    badge: "대시보드",
    desc: "크레용스쿨 콘텐츠를 한눈에 관리하세요",
    flows: ["데이터 수집", "통계 분석", "대시보드 표시"],
    domain: "crayon.platformers.kr"
  },
  fairytale: {
    badge: "출판",
    desc: "동화 이미지를 e-book으로 손쉽게 만들어요",
    flows: ["이미지 업로드", "자동 편집", "파일 출력"],
    domain: "fairytale.platformers.kr"
  }
};

// --- Main Page Component ---
export default function WorkPortalHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [me, setMe] = useState<AuthState | null>(null);
  const [healths, setHealths] = useState<HealthStatus[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [isHealthLoading, setIsHealthLoading] = useState(true);
  const [isRecentLoading, setIsRecentLoading] = useState(true);
  const [servicesInView, setServicesInView] = useState(false);

  const firstResultRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const check = () => {
      const el = document.getElementById("services");
      if (!el) return;
      setServicesInView(el.getBoundingClientRect().top < window.innerHeight * 0.4);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

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

  useEffect(() => {
    loadMe();
    refreshHealth();
    loadHomeRecent();

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
      setMe((prev) =>
        prev
          ? {
              ...prev,
              loggedIn: false,
              user: undefined,
            }
          : null
      );
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
    <div className="saas-layout">
      {/* 좌측 고정 사이드바 */}
      <aside className="saas-sidebar">
        <div className="saas-sidebar__header">
          <Image src="/shared/eduallab-logo.png" alt="에듀올랩" width={100} height={32} />
        </div>

        <nav className="saas-sidebar__nav">
          <Link href="/" className={`saas-nav-item${servicesInView ? "" : " is-active"}`}>
            <span className="saas-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </span> 홈
          </Link>
          <a href="#services" className={`saas-nav-item${servicesInView ? " is-active" : ""}`}>
            <span className="saas-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </span> 전체 서비스
          </a>
          <Link href="/guide" className="saas-nav-item">
            <span className="saas-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </span> 이용 가이드
          </Link>
          <Link href="/activity" className="saas-nav-item">
            <span className="saas-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </span> 사용 이력
          </Link>
        </nav>

        <div className="saas-sidebar__status">
          <h3 className="saas-status-title">서비스 상태</h3>
          <ul className="saas-status-list">
            {SERVICES.map((s) => {
              const h = healths.find((x) => x.id === s.id);
              const isUp = h ? h.status === "up" : false;
              return (
                <li key={s.id} className="saas-status-item">
                  <span className="saas-status-name">{s.title}</span>
                  <div className="saas-status-indicator">
                    <span className={cx("status-dot", isUp && "status-dot--up")} />
                    <span className="status-text">{isUp ? "정상" : "확인 중"}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="saas-sidebar__footer">
          <div className="saas-admin-info">
            <div className="admin-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div className="admin-text">
              <span className="admin-name">관리자</span>
              <span className="admin-email">admin@edulab.kr</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 우측 메인 영역 */}
      <main className="saas-main">
        {/* 상단 검색바 */}
        <header className="saas-topbar">
          <form className="saas-search" onSubmit={handleSearchSubmit}>
            <svg className="saas-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="서비스 이름이나 기능으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="saas-search__input"
            />
          </form>
          <div className="saas-topbar__actions">
            <button className="saas-btn-icon" aria-label="알림">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            {me?.loggedIn ? (
              <button className="saas-btn-outline" onClick={handleLogout}>로그아웃</button>
            ) : me?.authEnabled ? (
              <Link href="/login" className="saas-btn-outline">로그인</Link>
            ) : null}
          </div>
        </header>

        <div className="saas-content">
          {/* Hero 영역 */}
          <section className="saas-hero">
            <div className="saas-hero__text">
              <span className="saas-hero__badge">에듀랩 업무 자동화 플랫폼</span>
              <h1 className="saas-hero__title">통합 업무 포털</h1>
              <p className="saas-hero__desc">
                한 번의 로그인으로 입찰·회의록·뉴스·제안서·대시보드 등<br />모든 업무 서비스를 이용할 수 있습니다.
              </p>
            </div>
            <div className="saas-hero__stats">
              <div className="saas-stat-card">
                <span className="stat-val">7</span>
                <span className="stat-label">등록 서비스</span>
              </div>
              <div className="saas-stat-card">
                <span className="stat-val">7</span>
                <span className="stat-label">정상 운영</span>
              </div>
              <div className="saas-stat-card">
                <span className="stat-val">AI</span>
                <span className="stat-label">자동화</span>
              </div>
            </div>
          </section>

          {/* 처음 사용 안내 영역 */}
          <section className="saas-onboarding">
            <div className="saas-onboarding__header">
              <div className="saas-onboarding__title-wrap">
                <div className="icon-play">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                </div>
                <h2>처음 사용하시나요?</h2>
              </div>
              <Link href="/guide" className="saas-link">자세한 가이드 보기 →</Link>
            </div>
            <div className="saas-onboarding__steps">
              <div className="saas-step">
                <span className="step-num">01</span>
                <div className="saas-step__content">
                  <span className="step-title">서비스 선택</span>
                  <p className="step-desc">아래 카드에서 사용할 서비스를 클릭하세요.</p>
                </div>
              </div>
              <div className="saas-step">
                <span className="step-num">02</span>
                <div className="saas-step__content">
                  <span className="step-title">파일·링크 업로드</span>
                  <p className="step-desc">서비스에 맞는 파일이나 링크를 입력합니다.</p>
                </div>
              </div>
              <div className="saas-step">
                <span className="step-num">03</span>
                <div className="saas-step__content">
                  <span className="step-title">결과 확인·다운로드</span>
                  <p className="step-desc">AI가 자동으로 처리한 결과물을 받으세요.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 최근 사용 기록 */}
          <section className="saas-recent">
            <div className="saas-recent__card">
              <svg className="icon-clock" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div className="saas-recent__text">
                <p className="saas-recent__msg">최근 사용 기록이 없습니다.</p>
                <p className="saas-recent__sub">아래 서비스를 클릭해 처음으로 이용해 보세요.</p>
              </div>
            </div>
          </section>

          {/* 업무 서비스 카드 목록 */}
          <section id="services" className="saas-services">
            <header className="saas-services__header">
              <h2>업무 서비스</h2>
              <p>카드를 클릭하면 해당 서비스로 바로 이동합니다</p>
            </header>

            <div className="saas-services__grid">
              {filteredServices.map((service, idx) => {
                const info = SERVICE_INFO[service.id] || { badge: "", desc: service.description, flows: [], domain: service.host };

                return (
                  <a href={service.href} key={service.id} ref={idx === 0 ? firstResultRef : null} className={cx("saas-card", `saas-card--${service.iconType}`)}>
                    <div className="saas-card__body">
                      {/* 아이콘 + 타이틀 가로 배치 */}
                      <div className="saas-card__header">
                        <div className={cx("saas-card__icon", `saas-card__icon--${service.iconType}`)}>
                          <ServiceIcon id={service.id} />
                        </div>
                        <div className="saas-card__header-right">
                          <div className="saas-card__title-row">
                            <h3 className="saas-card__title">{service.title}</h3>
                            <span className="saas-card__badge">{info.badge}</span>
                          </div>
                          <p className="saas-card__desc">{info.desc}</p>
                        </div>
                      </div>

                      {/* 처리 흐름 chip */}
                      <div className="saas-card__flow">
                        {info.flows.map((flow, i) => (
                          <div key={i} className="saas-card__flow-item">
                            <span className="saas-card__chip">{flow}</span>
                            {i < info.flows.length - 1 && <span className="saas-card__arrow">→</span>}
                          </div>
                        ))}
                      </div>

                      {/* 상태 정보 */}
                      <div className="saas-card__status">
                        <svg className="saas-card__status-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span className="saas-card__status-label">운영 중</span>
                        <span className="saas-card__status-sep">·</span>
                        <span className="saas-card__domain">{info.domain}</span>
                      </div>
                    </div>

                    {/* 하단 CTA */}
                    <div className="saas-card__cta saas-card__cta--soft">
                      서비스 바로가기 →
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

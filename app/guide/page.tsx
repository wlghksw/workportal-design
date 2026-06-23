import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { GuideSidebar } from "./GuideSidebar";
import { GuideContent } from "./GuideContent";
import { GUIDE_DATA, GuideCategoryId } from "@/features/portal";

interface GuidePageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function GuidePage({ searchParams }: GuidePageProps) {
  const params = await searchParams;
  const activeId = (params.service as GuideCategoryId) || "newsletter";
  const serviceData = GUIDE_DATA[activeId];

  return (
    <div className="saas-layout">
      <aside className="saas-sidebar">
        <div className="saas-sidebar__header">
          <Image
            src="/shared/eduallab-logo.png"
            alt="에듀올랩"
            width={130}
            height={42}
          />
        </div>

        <nav className="saas-sidebar__nav">
          <Link href="/" className="saas-nav-item">
            <span className="saas-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            홈
          </Link>
          <Link href="/#services" className="saas-nav-item">
            <span className="saas-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </span>
            전체 서비스
          </Link>
          <Link href="/guide" className="saas-nav-item is-active">
            <span className="saas-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </span>
            이용 가이드
          </Link>
          <Link href="/activity" className="saas-nav-item">
            <span className="saas-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            사용 이력
          </Link>
        </nav>

        <div className="saas-sidebar__footer">
          <div className="saas-admin-info">
            <div className="admin-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="admin-text">
              <span className="admin-name">관리자</span>
              <span className="admin-email">admin@edulab.kr</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="saas-main">
        <header className="saas-topbar">
          <span className="saas-topbar__title">이용 가이드</span>
          <div className="saas-topbar__actions">
            <Link href="/" className="saas-btn-outline">← 홈으로</Link>
          </div>
        </header>

        <div className="guide-page-layout">
          <GuideSidebar activeId={activeId} />

          <div className="guide-page-content">
            <Suspense fallback={<div className="guide-loading">가이드 로딩 중...</div>}>
              {serviceData ? (
                <GuideContent service={serviceData} />
              ) : (
                <div className="guide-empty">
                  <p>준비 중인 가이드입니다.</p>
                  <Link href="/guide?service=newsletter" className="saas-link">
                    뉴스레터 가이드 보기 →
                  </Link>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

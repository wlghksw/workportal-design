import { Suspense } from "react";
import {
  PortalHeader,
  Page,
} from "@/components";
import Image from "next/image";
import Link from "next/link";
import { GuideSidebar } from "./GuideSidebar";
import { GuideContent } from "./GuideContent";
import { GUIDE_DATA, GuideCategoryId } from "@/features/portal";

interface GuidePageProps {
  searchParams: Promise<{ service?: string }>;
}

/**
 * 이용 가이드 페이지
 * Phase 2: 정적 콘텐츠 마이그레이션 (뉴스레터 중심)
 */
export default async function GuidePage({ searchParams }: GuidePageProps) {
  const params = await searchParams;
  const activeId = (params.service as GuideCategoryId) || "newsletter";
  const serviceData = GUIDE_DATA[activeId];

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
      >
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/" className="site-nav__item tab">
            홈
          </Link>
          <Link href="/guide" className="site-nav__item tab is-active">
            가이드
          </Link>
          <Link href="/activity" className="site-nav__item tab">
            사용 이력
          </Link>
        </nav>
      </PortalHeader>

      <Page className="guide-page">
        <div className="guide-layout">
          <GuideSidebar activeId={activeId} />

          <main className="guide-main">
            <Suspense fallback={<div className="loading-placeholder">가이드 로딩 중...</div>}>
              {serviceData ? (
                <GuideContent service={serviceData} />
              ) : (
                <div className="guide-empty">
                  <h1 className="text-title-md">준비 중인 가이드입니다</h1>
                  <p className="text-body">
                    선택하신 서비스의 가이드는 현재 마이그레이션 준비 중입니다.
                  </p>
                  <Link href="/guide?service=newsletter" className="guide-empty-link">
                    뉴스레터 가이드 보기
                  </Link>
                </div>
              )}
            </Suspense>
          </main>
        </div>
      </Page>
    </>
  );
}

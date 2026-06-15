import {
  PortalHeader,
  Page,
  Section,
  Stack,
  Card,
} from "@/components";
import Image from "next/image";
import Link from "next/link";

/**
 * 이용 가이드 페이지 (Shell)
 * Phase 1: 기반 구조 및 레이아웃 Placeholder 구축
 */
export default function GuidePage() {
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
        <div className="layout-wrapper" style={{ display: "flex", gap: "20px" }}>
          {/* 좌측 사이드바 (Placeholder) */}
          <aside
            className="portal-sidebar"
            style={{ width: "260px", flexShrink: 0 }}
          >
            <Card variant="default">
              <Card.Header>
                <Card.Title style={{ fontSize: "11px", opacity: 0.6 }}>
                  업무 자동화 서비스
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Stack spacing="sm">
                  <p className="text-body-sm">서비스 목록 로딩 중...</p>
                </Stack>
              </Card.Body>
            </Card>
          </aside>

          {/* 본문 영역 (Placeholder) */}
          <main className="view-container" style={{ flex: 1 }}>
            <Stack spacing="lg">
              <header className="page-header">
                <h1 className="text-title-lg">이용 가이드</h1>
                <p className="text-subtitle">
                  각 서비스의 상세 사용 방법과 팁을 확인하실 수 있습니다.
                </p>
              </header>

              <Section>
                <Card variant="soft">
                  <Card.Body>
                    <p className="text-body">
                      좌측 메뉴에서 서비스를 선택하면 상세 가이드가 표시됩니다.
                    </p>
                  </Card.Body>
                </Card>
              </Section>
            </Stack>
          </main>
        </div>
      </Page>
    </>
  );
}

import { Suspense } from "react";
import {
  PortalHeader,
  Page,
  Section,
  Stack,
} from "@/components";
import Image from "next/image";
import Link from "next/link";
import { ActivityList } from "./ActivityList";

export default function ActivityPage() {
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
          <Link href="/guide" className="site-nav__item tab">
            가이드
          </Link>
          <Link href="/activity" className="site-nav__item tab is-active">
            사용 이력
          </Link>
        </nav>
      </PortalHeader>

      <Page>
        <Stack spacing="lg">
          <header className="page-header">
            <h1 className="text-title-lg">사용 이력</h1>
            <p className="text-subtitle">
              워크포탈 내 주요 기능 사용 기록을 확인할 수 있습니다.
            </p>
          </header>

          <Section title="상세 사용 로그">
            <Suspense fallback={<div className="loading-placeholder">목록 로딩 중...</div>}>
              <ActivityList />
            </Suspense>
          </Section>
        </Stack>
      </Page>
    </>
  );
}

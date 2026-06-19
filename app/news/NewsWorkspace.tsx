"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortalHeader, Page, Stack } from "@/components";
import type { NewsUiState } from "@/features/news";

/**
 * 교육 뉴스 메인 작업 영역
 */
export function NewsWorkspace() {
  // 추후 API 데이터와 연동할 상태 객체
  const [uiState] = useState<NewsUiState>({
    isLoading: false,
    error: null,
    data: null,
  });

  return (
    <>
      <PortalHeader
        className="site-header--service"
        logo={
          <Link href="/" className="brand text-decoration-none">
            <Image
              src="/shared/eduallab-logo.png"
              alt="에듀올랩"
              width={120}
              height={40}
              className="brand__logo"
            />
            <span className="brand__sub">교육 뉴스</span>
          </Link>
        }
        actions={
          <Link href="/" className="topbar__btn">
            워크포탈
          </Link>
        }
      />

      <Page>
        <div className="news-app">
          <header className="news-header">
            <h1 className="news-header-title">최신 교육 뉴스</h1>
            <p className="news-header-desc">
              RSS 및 NewsAPI를 통해 수집된 최신 교육 분야 뉴스를 확인하세요.
            </p>
          </header>

          <main className="news-main-content">
            <Stack spacing="lg">
              {uiState.error && (
                <div className="alert alert-error" role="alert">
                  {uiState.error.message}
                </div>
              )}

              {uiState.isLoading ? (
                <div className="news-empty" aria-busy="true">
                  뉴스를 불러오는 중입니다...
                </div>
              ) : uiState.data?.items && uiState.data.items.length > 0 ? (
                <div className="news-list" aria-label="기사 목록">
                  {/* 뉴스 카드 맵핑 영역 (추후 구현) */}
                </div>
              ) : (
                <div className="news-empty">
                  표시할 기사가 없습니다.
                  <br />
                  (아직 API 연동 전입니다)
                </div>
              )}
            </Stack>
          </main>
        </div>
      </Page>
    </>
  );
}

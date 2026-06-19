"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortalHeader, Page, Stack } from "@/components";
import type { NewsUiState } from "@/features/news";
import { getNewsList } from "@/features/news";

import { NewsList } from "./NewsList";

/**
 * 교육 뉴스 메인 작업 영역
 */
export function NewsWorkspace() {
  const [uiState, setUiState] = useState<NewsUiState>({
    isLoading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      try {
        const data = await getNewsList();
        if (!isCancelled) {
          setUiState({ isLoading: false, error: null, data });
        }
      } catch (err) {
        if (!isCancelled) {
          setUiState({
            isLoading: false,
            error: err instanceof Error ? err : new Error("알 수 없는 오류가 발생했습니다."),
            data: null,
          });
        }
      }
    }

    void fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);

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
              {uiState.isLoading ? (
                <div className="news-empty" role="status" aria-live="polite" aria-busy="true">
                  뉴스를 불러오는 중입니다...
                </div>
              ) : uiState.error ? (
                <div className="alert alert-error" role="alert">
                  {uiState.error.message}
                </div>
              ) : (
                <NewsList items={uiState.data?.items} />
              )}
            </Stack>
          </main>
        </div>
      </Page>
    </>
  );
}

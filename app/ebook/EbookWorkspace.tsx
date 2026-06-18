"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PortalHeader,
  Page,
  Stack,
  cx,
} from "@/components";
import {
  EbookGenerationMode,
  EbookEnglishLevel,
  EbookApiSettings,
  EBOOK_PROCESS_STAGES,
  EBOOK_GUIDE_RULES,
  createDefaultEbookUiState,
} from "@/features/ebook";
import { EbookForm } from "./EbookForm";

/**
 * E-book 서비스 메인 작업 영역
 */
export function EbookWorkspace() {
  const [uiState, setUiState] = useState(createDefaultEbookUiState());

  const handleFormSubmit = (data: {
    mode: EbookGenerationMode;
    title: string;
    fullStory: string;
    level: EbookEnglishLevel;
    apiSettings: EbookApiSettings;
  }) => {
    setUiState(prev => ({
      ...prev,
      title: data.title,
      fullStory: data.fullStory,
      currentLevel: data.level,
      generationMode: data.mode
    }));
  };

  return (
    <>
      <PortalHeader
        logo={
          <Link href="/" className="brand text-decoration-none">
            <Image
              src="/shared/eduallab-logo.png"
              alt="에듀올랩"
              width={120}
              height={40}
              className="brand__logo"
            />
            <span className="brand__sub">e-book</span>
          </Link>
        }
        actions={
          <Link href="/" className="topbar__btn">워크포탈</Link>
        }
      />

      <Page>
        <div className="ebook-app">
          <h1 className="sr-only">E-book 동화책 자동 생성 서비스</h1>

          <div className="ebook-grid">
            {/* 왼쪽: 입력 영역 */}
            <main className="ebook-main-content">
              <EbookForm
                isLoading={uiState.isProcessing}
                onSubmit={handleFormSubmit}
              />
            </main>

            {/* 오른쪽: 정보 및 상태 영역 */}
            <aside className="ebook-side-info" aria-label="서비스 가이드 및 상태">
              <Stack spacing="lg">
                <div className="ebook-card">
                  <div className="ebook-section-title">AI 동화 제작 가이드</div>
                  <div className="ebook-rules-box">
                    <ul className="ebook-rules-list">
                      {EBOOK_GUIDE_RULES.map((rule, idx) => (
                        <li key={idx}>
                          <strong>{rule.title}</strong>: {rule.desc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="ebook-section-title">분할 및 변환 상태</div>
                  <nav className="ebook-step-list" aria-label="진행 단계">
                    <div className={cx("ebook-step", uiState.currentStep === 1 && "active")}>
                      <div className="ebook-step-icon">1</div>
                      <span>매직 프롬프트 실시간 빌드</span>
                    </div>
                    <div className={cx("ebook-step", uiState.currentStep === 2 && "active")}>
                      <div className="ebook-step-icon">2</div>
                      <span>4x4 이미지 그리드 검출 및 트리밍</span>
                    </div>
                    <div className={cx("ebook-step", uiState.currentStep === 3 && "active")}>
                      <div className="ebook-step-icon">3</div>
                      <span>1024px 고화질 슬라이스 및 보정</span>
                    </div>
                  </nav>
                </div>

                <div className="ebook-card">
                  <div className="ebook-section-title">HOW IT WORKS</div>
                  <div className="ebook-how-list">
                    <div className="ebook-how-step">
                      <div className="ebook-how-num">01</div>
                      <div>
                        <div className="ebook-how-text-title">스토리 앤 템플릿 빌드</div>
                        <div className="ebook-how-text-desc">스토리 텍스트 또는 제목을 통해 난이도별 최적화된 프롬프트를 만듭니다.</div>
                      </div>
                    </div>
                    <div className="ebook-how-step">
                      <div className="ebook-how-num">02</div>
                      <div>
                        <div className="ebook-how-text-title">DALL-E 그림 생성</div>
                        <div className="ebook-how-text-desc">그림 프롬프트를 사용하여 질감/테두리 없는 고품질 4x4 그리드 이미지를 얻습니다.</div>
                      </div>
                    </div>
                    <div className="ebook-how-step">
                      <div className="ebook-how-num">03</div>
                      <div>
                        <div className="ebook-how-text-title">16장 컷 분할 및 대본 병합</div>
                        <div className="ebook-how-text-desc">이미지와 JSON 대본을 업로드해 자막이 입혀진 아름다운 동화책을 완성합니다.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Stack>
            </aside>
          </div>
        </div>
      </Page>
    </>
  );
}

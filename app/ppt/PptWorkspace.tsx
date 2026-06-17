"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PortalHeader,
  Page,
  Stack,
  Cluster,
  Button,
  cx,
} from "@/components";
import { PptForm } from "./PptForm";
import {
  PPT_WORK_MODES,
  PPT_CATEGORIES,
  PPT_PROCESS_STAGES,
  PptProcessStage,
  createDefaultPptRequest,
  createDefaultPptUiState,
  PptGenerateRequest,
} from "@/features/ppt";

/**
 * PPT 서비스 메인 작업 영역
 */
export function PptWorkspace() {
  const [stage, setStage] = useState<PptProcessStage>(PPT_PROCESS_STAGES.IDLE);
  const [uiState, setUiState] = useState(createDefaultPptUiState());

  const handleGenerate = async (data: PptGenerateRequest) => {
    // UI 상태 동기화 및 에러 초기화 (API 연동 전 단계)
    setUiState(prev => ({
      ...prev,
      workMode: data.mode,
      category: data.category,
      errorMessage: null
    }));

    // 현재는 입력 폼 확인 단계이므로 스테이지 전환은 하지 않음
    if (stage === PPT_PROCESS_STAGES.IDLE) {
      setStage(PPT_PROCESS_STAGES.INPUT);
    }
  };

  return (
    <>
      <PortalHeader
        logo={
          <Link href="/" className="text-decoration-none">
            <Cluster className="cluster-center gap-sm">
              <Image
                src="/shared/eduallab-logo.png"
                alt="에듀올랩"
                width={120}
                height={40}
                className="brand__logo"
              />
              <span className="text-title-sm text-body">PPT·제안서</span>
            </Cluster>
          </Link>
        }
      >
        <div className="site-header__spacer" />
        <div className="site-header__actions">
          <Link href="/" className="topbar__btn">워크포탈</Link>
        </div>
      </PortalHeader>

      <Page>
        <div className="ppt-app">
          <div className="ppt-grid">
            {/* 왼쪽: 입력 영역 */}
            <PptForm
              onSubmit={handleGenerate}
              isLoading={stage === PPT_PROCESS_STAGES.GENERATING || stage === PPT_PROCESS_STAGES.UPLOADING}
            />

            {/* 오른쪽: 정보 및 상태 영역 */}
            <aside className="ppt-side-info">
              <Stack spacing="lg">
                <div className="ppt-card">
                  <div className="ppt-section-title">수주 기획 및 디자인 규정</div>
                  <div className="ppt-rules-box">
                    <ul className="ppt-rules-list">
                      <li>에듀올랩 그레이시 블루 (#F8FAFC) 캔버스</li>
                      <li>대기업 위탁/IR 규격 입체 섀도우 카드 매칭</li>
                      <li>AS-IS vs TO-BE 2단 설득 비교 카드 자동화</li>
                      <li>12자~22자 압축 명사형 종결어미 강제 통일</li>
                      <li>다크모드 및 시스템 이모지 사용 금지</li>
                    </ul>
                  </div>

                  <div className="ppt-section-title">생성 상태</div>
                  <div className="ppt-step-list">
                    <div className={cx("ppt-step", stage === PPT_PROCESS_STAGES.IDLE && "active")}>
                      <div className="ppt-step-icon">1</div>
                      <span>콘텐츠 및 이미지 정밀 분석</span>
                    </div>
                    <div className="ppt-step">
                      <div className="ppt-step-icon">2</div>
                      <span>디자인 자산 기반 구조 설계</span>
                    </div>
                    <div className="ppt-step">
                      <div className="ppt-step-icon">3</div>
                      <span>HTML 인라인 슬라이드 렌더링</span>
                    </div>
                  </div>
                </div>

                <div className="ppt-card">
                  <div className="ppt-section-title">HOW IT WORKS</div>
                  <div className="ppt-how-list">
                    <div className="ppt-how-step">
                      <div className="ppt-how-num">01</div>
                      <div>
                        <div className="ppt-how-text-title">멀티자료 분석</div>
                        <div className="ppt-how-text-desc">기획서와 교구 이미지를 통합 분석합니다.</div>
                      </div>
                    </div>
                    <div className="ppt-how-step">
                      <div className="ppt-how-num">02</div>
                      <div>
                        <div className="ppt-how-text-title">비전 매칭</div>
                        <div className="ppt-how-text-desc">이미지 기반으로 최적의 레이아웃을 배치합니다.</div>
                      </div>
                    </div>
                    <div className="ppt-how-step">
                      <div className="ppt-how-num">03</div>
                      <div>
                        <div className="ppt-how-text-title">독립형 HTML</div>
                        <div className="ppt-how-text-desc">별도 툴 없이 브라우저에서 즉시 프레젠테이션.</div>
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

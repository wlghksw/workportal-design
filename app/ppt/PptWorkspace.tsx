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
import { PptResultView } from "./PptResultView";
import { PptEditorView } from "./PptEditorView";
import { PptViewerView } from "./PptViewerView";
import {
  PPT_WORK_MODES,
  PPT_CATEGORIES,
  PPT_PROCESS_STAGES,
  PptProcessStage,
  createDefaultPptRequest,
  createDefaultPptUiState,
  PptGenerateRequest,
  PptSessionData,
  generatePpt,
  appendPpt,
  getPptSession,
} from "@/features/ppt";

/**
 * PPT 서비스 메인 작업 영역
 */
export function PptWorkspace() {
  const [stage, setStage] = useState<PptProcessStage>(PPT_PROCESS_STAGES.IDLE);
  const [uiState, setUiState] = useState(createDefaultPptUiState());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<PptSessionData | null>(null);

  const handleGenerate = async (data: PptGenerateRequest) => {
    if (stage === PPT_PROCESS_STAGES.UPLOADING || stage === PPT_PROCESS_STAGES.GENERATING) {
      return;
    }

    setErrorMessage(null);
    setStage(PPT_PROCESS_STAGES.UPLOADING);

    try {
      // 1. 생성 요청 (신규 또는 병합)
      const res = data.mode === "new"
        ? await generatePpt(data)
        : await appendPpt(data);

      setStage(PPT_PROCESS_STAGES.GENERATING);

      // 2. 세션 정보 조회
      const session = await getPptSession(res.session_id);

      setSessionData(session);
      setUiState(prev => ({
        ...prev,
        workMode: data.mode,
        category: data.category,
      }));
      setStage(PPT_PROCESS_STAGES.SUCCESS);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "PPT 생성 중 오류가 발생했습니다.";
      setErrorMessage(msg);
      setStage(PPT_PROCESS_STAGES.ERROR);
    }
  };

  const handleReset = () => {
    setStage(PPT_PROCESS_STAGES.IDLE);
    setSessionData(null);
    setErrorMessage(null);
    setUiState(createDefaultPptUiState());
  };

  const handleStartEditor = () => {
    setStage(PPT_PROCESS_STAGES.EDITING);
  };

  const handleStartViewer = () => {
    setStage(PPT_PROCESS_STAGES.PREVIEW);
  };

  const handleUiStateChange = (updates: Partial<typeof uiState>) => {
    setUiState(prev => ({ ...prev, ...updates }));
  };

  const isProcessing = stage === PPT_PROCESS_STAGES.UPLOADING || stage === PPT_PROCESS_STAGES.GENERATING;

  // 뷰어 모드 (전체화면 오버레이 느낌)
  if (stage === PPT_PROCESS_STAGES.PREVIEW && sessionData) {
    return <PptViewerView data={sessionData} onClose={() => setStage(PPT_PROCESS_STAGES.EDITING)} />;
  }

  // 에디터 모드 (3-Pane 레이아웃)
  if (stage === PPT_PROCESS_STAGES.EDITING && sessionData) {
    return (
      <PptEditorView
        data={sessionData}
        uiState={uiState}
        onUiStateChange={handleUiStateChange}
      />
    );
  }
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
            <span className="brand__sub">PPT·제안서</span>
          </Link>
        }
        actions={
          <Link href="/" className="topbar__btn">워크포탈</Link>
        }
      />

      <Page>
        <div className="ppt-app">
          <h1 className="sr-only">PPT·제안서 자동 생성 서비스</h1>

          <div className="ppt-grid">
            {/* 왼쪽: 입력 또는 결과 영역 */}
            <main className="ppt-main-content">
              <Stack spacing="lg">
                {errorMessage && (
                  <div className="alert alert--error" role="alert">
                    {errorMessage}
                  </div>
                )}

                {stage === PPT_PROCESS_STAGES.SUCCESS && sessionData ? (
                  <PptResultView
                    data={sessionData}
                    onReset={handleReset}
                    onEdit={handleStartEditor}
                    onView={handleStartViewer}
                  />
                ) : (
                  <PptForm
                    onSubmit={handleGenerate}
                    isLoading={isProcessing}
                  />
                )}

                {/* 생성 중 프로그레스 플레이스홀더 */}
                {isProcessing && (
                  <div className="ppt-card" aria-busy="true" role="status">
                    <Stack spacing="md">
                      <h2 className="ppt-section-title">
                        {stage === PPT_PROCESS_STAGES.UPLOADING ? "파일 업로드 중..." : "AI 슬라이드 생성 중..."}
                      </h2>
                      <div className="progress-bar-bg">
                        <div className="progress-bar progress-bar--loading"></div>
                      </div>
                      <p className="ppt-progress-hint">
                        최대 1~2분이 소요될 수 있습니다. 브라우저를 닫지 마세요.
                      </p>
                    </Stack>
                  </div>
                )}
              </Stack>
            </main>

            {/* 오른쪽: 정보 및 상태 영역 */}
            <aside className="ppt-side-info" aria-label="서비스 정보 및 가이드">
              <Stack spacing="lg">
                <section className="ppt-card">
                  <h2 className="ppt-section-title">수주 기획 및 디자인 규정</h2>
                  <div className="ppt-rules-box">
                    <ul className="ppt-rules-list">
                      <li>에듀올랩 그레이시 블루 (#F8FAFC) 캔버스</li>
                      <li>대기업 위탁/IR 규격 입체 섀도우 카드 매칭</li>
                      <li>AS-IS vs TO-BE 2단 설득 비교 카드 자동화</li>
                      <li>12자~22자 압축 명사형 종결어미 강제 통일</li>
                      <li>다크모드 및 시스템 이모지 사용 금지</li>
                    </ul>
                  </div>

                  <h2 className="ppt-section-title">생성 상태</h2>
                  <nav className="ppt-step-list" aria-label="진행 단계">
                    <div className={cx(
                      "ppt-step",
                      stage === PPT_PROCESS_STAGES.IDLE && "active",
                      (stage !== PPT_PROCESS_STAGES.IDLE && stage !== PPT_PROCESS_STAGES.ERROR) && "done"
                    )}>
                      <div className="ppt-step-icon">1</div>
                      <span>콘텐츠 및 이미지 정밀 분석</span>
                    </div>
                    <div className={cx(
                      "ppt-step",
                      stage === PPT_PROCESS_STAGES.GENERATING && "active",
                      stage === PPT_PROCESS_STAGES.SUCCESS && "done"
                    )}>
                      <div className="ppt-step-icon">2</div>
                      <span>디자인 자산 기반 구조 설계</span>
                    </div>
                    <div className={cx(
                      "ppt-step",
                      stage === PPT_PROCESS_STAGES.SUCCESS && "active done"
                    )}>
                      <div className="ppt-step-icon">3</div>
                      <span>HTML 인라인 슬라이드 렌더링</span>
                    </div>
                  </nav>
                </section>

                <section className="ppt-card">
                  <h2 className="ppt-section-title">HOW IT WORKS</h2>
                  <div className="ppt-how-list">
                    <div className="ppt-how-step">
                      <div className="ppt-how-num" aria-hidden="true">01</div>
                      <div>
                        <h3 className="ppt-how-text-title">멀티자료 분석</h3>
                        <p className="ppt-how-text-desc">기획서와 교구 이미지를 통합 분석합니다.</p>
                      </div>
                    </div>
                    <div className="ppt-how-step">
                      <div className="ppt-how-num" aria-hidden="true">02</div>
                      <div>
                        <h3 className="ppt-how-text-title">비전 매칭</h3>
                        <p className="ppt-how-text-desc">이미지 기반으로 최적의 레이아웃을 배치합니다.</p>
                      </div>
                    </div>
                    <div className="ppt-how-step">
                      <div className="ppt-how-num" aria-hidden="true">03</div>
                      <div>
                        <h3 className="ppt-how-text-title">독립형 HTML</h3>
                        <p className="ppt-how-text-desc">별도 툴 없이 브라우저에서 즉시 프레젠테이션.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </Stack>
            </aside>
          </div>
        </div>
      </Page>
    </>
  );
}

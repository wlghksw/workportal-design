"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PortalHeader,
  Page,
  Stack,
  Cluster,
  Card,
  Button,
  Badge,
  cx
} from "@/components";
import {
  MeetingTabType,
  MEETING_TABS,
  MeetingMeta,
  MeetingFile,
  MeetingResult,
  createDefaultMeetingMeta,
  MeetingProcessStage,
  MEETING_PROCESS_STAGES
} from "@/features/meeting";
import { MeetingForm } from "./MeetingForm";
import { MeetingUploadZone } from "./MeetingUploadZone";
import { MeetingResultView } from "./MeetingResultView";

export function MeetingWorkspace() {
  const [activeTab, setActiveTab] = useState<MeetingTabType>("record");
  const [meta, setMeta] = useState<MeetingMeta>(createDefaultMeetingMeta());
  const [files, setFiles] = useState<MeetingFile[]>([]);

  const [stage, setStage] = useState<MeetingProcessStage>(MEETING_PROCESS_STAGES.IDLE);
  const [progress, setProgress] = useState({ percent: 0, text: "준비 중..." });
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMetaChange = <K extends keyof MeetingMeta>(field: K, value: MeetingMeta[K]) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };

  const handleFilesAdd = (newFiles: File[]) => {
    setErrorMessage("");
    const maxMb = 1024;

    const validFiles: MeetingFile[] = [];
    for (const f of newFiles) {
      if (f.size === 0) {
        setErrorMessage(`오류: "${f.name}" 파일이 비어 있습니다.`);
        continue;
      }
      if (f.size > maxMb * 1024 * 1024) {
        setErrorMessage(`오류: "${f.name}" 용량이 너무 큽니다. (최대 1GB)`);
        continue;
      }
      validFiles.push({
        id: Math.random().toString(36).slice(2) + Date.now(),
        name: f.name,
        size: f.size,
        type: f.type,
        file: f
      });
    }

    setFiles(prev => [...prev, ...validFiles]);
    if (stage === MEETING_PROCESS_STAGES.IDLE && validFiles.length > 0) {
      setStage(MEETING_PROCESS_STAGES.INPUT);
    }
  };

  const handleFileRemove = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleFileMove = (id: string, direction: number) => {
    setFiles(prev => {
      const idx = prev.findIndex(f => f.id === id);
      if (idx === -1) return prev;
      const nextIdx = idx + direction;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;

      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(nextIdx, 0, moved);
      return next;
    });
  };

  const isValid = useMemo(() => {
    return files.length > 0 && meta.title.trim().length > 0;
  }, [files, meta.title]);

  const handleSubmit = async () => {
    if (!isValid || stage === MEETING_PROCESS_STAGES.PROCESSING) return;

    setErrorMessage("");
    setStage(MEETING_PROCESS_STAGES.PROCESSING);
    setProgress({ percent: 5, text: "파일 분석을 시작합니다..." });

    // API logic will be implemented in the next phase
  };

  const handleCopyResult = () => {
    // Copy logic will be implemented in the next phase
  };
  const isProcessing = stage === MEETING_PROCESS_STAGES.PROCESSING || stage === MEETING_PROCESS_STAGES.UPLOADING;

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
              <span className="text-title-sm text-default">회의록 자동화</span>
            </Cluster>
          </Link>
        }
      >
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/" className="site-nav__item tab">
            워크포탈 홈
          </Link>
          <Link href="/guide?service=meeting" className="site-nav__item tab">
            이용 가이드
          </Link>
        </nav>
      </PortalHeader>

      <Page>
        <div className="portal-layout">
          {/* 사이드바: 최근 회의 목록 */}
          <aside className="portal-layout__side">
            <Card variant="default" className="meeting-sidebar">
              <Card.Header className="meeting-sidebar__header">
                <Card.Title className="text-caption font-semibold uppercase">최근 회의</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="meeting-history-empty">
                  <p className="text-caption text-muted">저장된 기록이 없습니다.</p>
                </div>
              </Card.Body>
            </Card>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="portal-layout__main">
            <Stack spacing="lg">
              {errorMessage && (
                <div className="alert alert-error" role="alert">
                  {errorMessage}
                </div>
              )}

              {/* 메타 정보 입력 */}
              <Card variant="default">
                <Card.Body>
                  <MeetingForm data={meta} onChange={handleMetaChange} disabled={isProcessing} />
                </Card.Body>
              </Card>

              {/* 입력 방식 탭 */}
              <Stack spacing="md">
                <nav className="tabs" aria-label="입력 방식 선택">
                  {MEETING_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={cx("tab", activeTab === tab.id && "active")}
                      onClick={() => setActiveTab(tab.id)}
                      disabled={isProcessing}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </nav>

                <Card variant="default" className="meeting-input-zone">
                  <Card.Body>
                    {activeTab === "upload" || activeTab === "record" ? (
                      <MeetingUploadZone
                        files={files}
                        onFilesAdd={handleFilesAdd}
                        onFileRemove={handleFileRemove}
                        onFileMove={handleFileMove}
                        onValidationError={setErrorMessage}
                        disabled={isProcessing}
                      />
                    ) : (
                      <div className="meeting-input-placeholder">
                        <p>⚡ 실시간으로 전사 및 요약을 확인합니다.</p>
                        <p className="text-caption mt-2">실시간 모드는 추후 지원 예정입니다.</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Stack>

              {/* 액션 버튼 */}
              <Button
                variant="primary"
                fullWidth
                size="lg"
                disabled={!isValid || isProcessing}
                onClick={handleSubmit}
              >
                {isProcessing ? "처리 중..." : `회의록 생성 ${meta.postToTeams ? "& Teams 공유" : ""}${files.length > 1 ? ` (${files.length}개 파일)` : ""}`}
              </Button>

              {/* 진행 상태 */}
              {isProcessing && (
                <div className="meeting-progress-wrap">
                  <Card variant="soft">
                    <Card.Body aria-busy="true">
                      <Stack spacing="sm">
                        <div className="progress-bar-bg">
                          <div className="progress-bar progress-bar--loading"></div>
                        </div>
                        <p className="text-caption text-center">{progress.text}</p>
                      </Stack>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {/* 결과 영역 */}
              {stage === MEETING_PROCESS_STAGES.SUCCESS && result && (
                <MeetingResultView
                  result={result}
                  meta={meta}
                  onCopy={handleCopyResult}
                />
              )}
            </Stack>
          </main>
        </div>
      </Page>
    </>
  );
}

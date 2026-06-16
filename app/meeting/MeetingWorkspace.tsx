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
  MEETING_PROCESS_STAGES,
  uploadMeetingChunk,
  createMeetingJob,
  getMeetingJobStatus
} from "@/features/meeting";
import { MeetingForm } from "./MeetingForm";
import { MeetingUploadZone } from "./MeetingUploadZone";
import { MeetingRecorder } from "./MeetingRecorder";
import { MeetingResultView } from "./MeetingResultView";

const CHUNK_SIZE = 500 * 1024;
const MAX_POLLING_ATTEMPTS = 90; // 2초 간격 기준 약 3분

export function MeetingWorkspace() {
  const [activeTab, setActiveTab] = useState<MeetingTabType>("record");
  const [meta, setMeta] = useState<MeetingMeta>(createDefaultMeetingMeta());
  const [files, setFiles] = useState<MeetingFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const [stage, setStage] = useState<MeetingProcessStage>(MEETING_PROCESS_STAGES.IDLE);
  const [progress, setProgress] = useState({ percent: 0, text: "준비 중..." });
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMetaChange = <K extends keyof MeetingMeta>(field: K, value: MeetingMeta[K]) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };

  const uploadFileInChunks = async (meetingFile: MeetingFile, onFileProgress: (done: number, total: number) => void) => {
    const { file } = meetingFile;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)).replace(/-/g, "");
    const ext = (file.name.split(".").pop() || "bin").replace(/[^a-zA-Z0-9]/g, "");

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * CHUNK_SIZE, Math.min((i + 1) * CHUNK_SIZE, file.size));
      await uploadMeetingChunk({
        uploadId,
        chunkIndex: i,
        totalChunks,
        ext,
        chunk
      });
      onFileProgress(i + 1, totalChunks);
    }
    return uploadId;
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
    if (!isValid || stage === MEETING_PROCESS_STAGES.PROCESSING || stage === MEETING_PROCESS_STAGES.UPLOADING) return;

    setErrorMessage("");
    setResult(null);
    setStage(MEETING_PROCESS_STAGES.UPLOADING);
    setProgress({ percent: 0, text: "파일 업로드를 시작합니다..." });

    try {
      const uploadIds: string[] = [];
      const totalFiles = files.length;

      // 1. Chunked Upload
      for (let i = 0; i < totalFiles; i++) {
        const uid = await uploadFileInChunks(files[i], (done, total) => {
          const fileProgress = Math.round(((i + done / total) / totalFiles) * 100);
          setProgress({
            percent: fileProgress,
            text: `파일 업로드 중... (${i + 1}/${totalFiles})`
          });
        });
        uploadIds.push(uid);
      }

      // 2. Create Job
      setStage(MEETING_PROCESS_STAGES.PROCESSING);
      setProgress({ percent: 0, text: "회의록 분석을 요청합니다..." });

      const jobResp = await createMeetingJob({
        ...meta,
        uploadIds
      });

      if (!jobResp.jobId) throw new Error(jobResp.error || "작업 요청 실패");
      const { jobId } = jobResp;

      // 3. Polling
      let isDone = false;
      let attempts = 0;
      while (!isDone) {
        attempts++;
        if (attempts >= MAX_POLLING_ATTEMPTS) {
          throw new Error("처리 시간이 초과되었습니다. 잠시 후 히스토리에서 확인해 주세요.");
        }

        await new Promise(r => setTimeout(r, 2000));
        const status = await getMeetingJobStatus(jobId);

        if (status.status === "completed") {
          isDone = true;
          setStage(MEETING_PROCESS_STAGES.SUCCESS);
          setResult({
            noteText: status.result?.noteText || "회의록 내용이 없습니다.",
            qualityWarnings: status.result?.qualityWarnings,
            downloadUrl: undefined // To be implemented if needed
          });
        } else if (status.status === "failed") {
          throw new Error(status.error || "회의록 생성 중 오류가 발생했습니다.");
        } else {
          // progress text updates
          let stageText = "분석 중...";
          if (status.progress?.stage === "stt") stageText = "음성 텍스트 변환 중...";
          else if (status.progress?.stage === "summarize") stageText = "AI 요약 중...";
          else if (status.progress?.stage === "teams") stageText = "Teams 공유 중...";

          const currentPct = status.progress?.total
            ? Math.round(((status.progress.done || 0) / status.progress.total) * 100)
            : 0;

          setProgress({
            percent: currentPct,
            text: `${stageText}${currentPct > 0 ? ` (${currentPct}%)` : ""}`
          });
        }
      }

    } catch (err: unknown) {
      setStage(MEETING_PROCESS_STAGES.ERROR);
      const msg = err instanceof Error ? err.message : "오류가 발생했습니다.";
      setErrorMessage(msg);
    }
  };

  const handleReset = () => {
    if (stage === MEETING_PROCESS_STAGES.PROCESSING || stage === MEETING_PROCESS_STAGES.UPLOADING) return;
    if (!window.confirm("현재 회의 내용을 초기화할까요?\n(결과가 저장되지 않았으면 사라집니다.)")) return;

    setStage(MEETING_PROCESS_STAGES.IDLE);
    setResult(null);
    setFiles([]);
    setErrorMessage("");
    setProgress({ percent: 0, text: "준비 중..." });
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
              <span className="text-title-sm text-body">회의록 자동화</span>
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
        <Stack spacing="lg">
          <header className="page-header">
            <h1 className="text-title-lg">회의록 자동화</h1>
            <p className="text-subtitle">음성 녹음 및 파일을 분석하여 회의록 요약문을 자동 생성하고 Teams에 공유합니다.</p>
          </header>

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

              {stage === MEETING_PROCESS_STAGES.SUCCESS && (
                <div className="alert alert-success" role="status">
                  회의록 생성이 완료되었습니다. 아래에서 내용을 확인하세요.
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
                      disabled={isProcessing || isRecording}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </nav>

                <Card variant="default" className="meeting-input-zone">
                  <Card.Body>
                    {activeTab === "record" ? (
                      <MeetingRecorder
                        onFileAdd={(f) => handleFilesAdd([f])}
                        onValidationError={setErrorMessage}
                        onRecordingStateChange={setIsRecording}
                        disabled={isProcessing}
                      />
                    ) : activeTab === "upload" ? (
                      <MeetingUploadZone
                        files={files}
                        onFilesAdd={handleFilesAdd}
                        onFileRemove={handleFileRemove}
                        onFileMove={handleFileMove}
                        onValidationError={setErrorMessage}
                        disabled={isProcessing || isRecording}
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
                disabled={!isValid || isProcessing || isRecording}
                onClick={handleSubmit}
              >
                {isProcessing ? "처리 중..." : isRecording ? "녹음 중에는 생성할 수 없습니다" : `회의록 생성 ${meta.postToTeams ? "& Teams 공유" : ""}${files.length > 1 ? ` (${files.length}개 파일)` : ""}`}
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
                  onReset={handleReset}
                />
              )}
            </Stack>
          </main>
        </div>
      </Stack>
    </Page>
  </>
  );
}

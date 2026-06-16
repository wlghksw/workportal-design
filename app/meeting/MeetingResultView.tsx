"use client";

import { useState, useEffect } from "react";
import { MeetingResult, MeetingMeta } from "@/features/meeting";
import { Card, Stack, Cluster, Badge, Button, Grid } from "@/components";

interface MeetingResultViewProps {
  result: MeetingResult;
  meta: MeetingMeta;
  onReset: () => void;
}

export function MeetingResultView({ result, meta, onReset }: MeetingResultViewProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCopy = async () => {
    const parts = [];
    parts.push(`[회의록] ${meta.title || "제목 없음"}`);
    parts.push(`일시: ${meta.meetingDate || "—"}`);
    parts.push(`장소: ${meta.location || "—"}`);
    parts.push(`참석자: ${meta.participants || "—"}`);
    parts.push("");

    if (result.summary) parts.push(`[요약]\n${result.summary}\n`);
    if (result.agenda) parts.push(`[안건]\n${result.agenda}\n`);
    if (result.done) parts.push(`[결정 사항]\n${result.done}\n`);
    if (result.willDo) parts.push(`[다음 액션]\n${result.willDo}\n`);
    if (result.openQuestions) parts.push(`[열린 질문]\n${result.openQuestions}\n`);

    parts.push(`[전체 기록]\n${result.noteText || "내용 없음"}`);

    const textToCopy = parts.join("\n").trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus("success");
    } catch (err) {
      setCopyStatus("error");
    }
  };

  useEffect(() => {
    if (copyStatus !== "idle") {
      const timer = setTimeout(() => setCopyStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  return (
    <section className="meeting-result-wrap" aria-labelledby="result-title">
      <Stack spacing="lg">
        <Card variant="elevated">
          <Card.Header>
            <Cluster className="cluster-between">
              <Card.Title id="result-title">자동 생성된 회의록</Card.Title>
              <Cluster className="gap-sm">
                {meta.postToTeams && (
                  <Badge variant="success" soft>✅ Teams 공유됨</Badge>
                )}
                {result.downloadUrl && result.downloadUrl !== "#" && (
                  <a
                    href={result.downloadUrl}
                    download
                    className="btn btn--secondary btn--sm text-decoration-none text-inherit"
                  >
                    다운로드
                  </a>
                )}
                <Button
                  variant={copyStatus === "success" ? "primary" : "secondary"}
                  size="sm"
                  onClick={handleCopy}
                  aria-live="polite"
                >
                  {copyStatus === "success" ? "✅ 복사 완료!" : copyStatus === "error" ? "❌ 복사 실패" : "복사하기"}
                </Button>

                <Button variant="ghost" size="sm" onClick={onReset}>
                  초기화
                </Button>
              </Cluster>
            </Cluster>
          </Card.Header>
          <Card.Body>
            <Stack spacing="md">
              {/* 품질 경고 */}
              {result.qualityWarnings && result.qualityWarnings.length > 0 && (
                <div className="quality-warning-box" role="alert">
                  <strong>⚠️ 품질 경고:</strong>
                  <ul className="preview-url-list mt-2">
                    {result.qualityWarnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 회의 정보 요약 */}
              <div className="meeting-result-meta">
                <div className="result-meta-item">
                  <span className="result-meta-label">회의 일시</span>
                  <span className="result-meta-value">{meta.meetingDate || "—"}</span>
                </div>
                <div className="result-meta-item">
                  <span className="result-meta-label">장소</span>
                  <span className="result-meta-value">{meta.location || "—"}</span>
                </div>
                <div className="result-meta-item">
                  <span className="result-meta-label">참석자</span>
                  <span className="result-meta-value">{meta.participants || "—"}</span>
                </div>
                <div className="result-meta-item">
                  <span className="result-meta-label">공유 채널</span>
                  <span className="result-meta-value">{meta.team || "—"}</span>
                </div>
              </div>

              {/* 회의록 본문 */}
              <Stack spacing="lg">
                {result.summary && (
                  <div className="result-section">
                    <h4 className="text-body-sm font-bold mb-2">📋 요약</h4>
                    <div className="meeting-result-content">{result.summary}</div>
                  </div>
                )}
                {result.agenda && (
                  <div className="result-section">
                    <h4 className="text-body-sm font-bold mb-2">💡 안건</h4>
                    <div className="meeting-result-content">{result.agenda}</div>
                  </div>
                )}
                {(result.done || result.willDo) && (
                  <Grid cols={2}>
                    {result.done && (
                      <div className="result-section">
                        <h4 className="text-body-sm font-bold mb-2">✅ 결정 사항</h4>
                        <div className="meeting-result-content">{result.done}</div>
                      </div>
                    )}
                    {result.willDo && (
                      <div className="result-section">
                        <h4 className="text-body-sm font-bold mb-2">🚀 다음 액션</h4>
                        <div className="meeting-result-content">{result.willDo}</div>
                      </div>
                    )}
                  </Grid>
                )}
                {result.openQuestions && (
                  <div className="result-section">
                    <h4 className="text-body-sm font-bold mb-2">❓ 열린 질문</h4>
                    <div className="meeting-result-content">{result.openQuestions}</div>
                  </div>
                )}
                <div className="result-section">
                  <h4 className="text-body-sm font-bold mb-2">📝 전체 전사/기록</h4>
                  <div className="meeting-result-content" tabIndex={0} aria-label="회의록 본문">
                    {result.noteText || "회의록 내용이 없습니다."}
                  </div>
                </div>
              </Stack>
            </Stack>
          </Card.Body>
        </Card>
      </Stack>
    </section>
  );
}

"use client";

import { MeetingResult, MeetingMeta } from "@/features/meeting";
import { Card, Stack, Cluster, Badge, Button } from "@/components";

interface MeetingResultViewProps {
  result: MeetingResult;
  meta: MeetingMeta;
  onCopy: () => void;
}

export function MeetingResultView({ result, meta, onCopy }: MeetingResultViewProps) {
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
                <Button variant="secondary" size="sm" onClick={onCopy} disabled>
                  복사하기
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
              <div className="meeting-result-content" tabIndex={0} aria-label="회의록 본문">
                {result.noteText || "회의록 내용이 없습니다."}
              </div>
            </Stack>
          </Card.Body>
        </Card>
      </Stack>
    </section>
  );
}

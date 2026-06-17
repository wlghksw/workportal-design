"use client";

import { PptSessionData, getPptDownloadUrl } from "@/features/ppt";
import { Stack, Button } from "@/components";

interface PptResultViewProps {
  data: PptSessionData;
  onReset: () => void;
  onEdit: () => void;
  onView: () => void;
}

/**
 * PPT 생성 결과 미리보기 및 다운로드 영역
 */
export function PptResultView({ data, onReset, onEdit, onView }: PptResultViewProps) {
  const isReport = data.category === "report";
  const slideCount = data.slides_data?.slides.length || 0;

  const handleReset = () => {
    if (window.confirm("초기화하시겠습니까? 현재 생성된 결과는 저장되지 않은 경우 사라질 수 있습니다.")) {
      onReset();
    }
  };

  const pptxUrl = getPptDownloadUrl(data.session_id, "pptx");
  const premiumPptxUrl = getPptDownloadUrl(data.session_id, "premium-pptx");
  const docxUrl = getPptDownloadUrl(data.session_id, "docx");

  return (
    <div className="ppt-result-wrap" role="status" aria-live="polite">
      <Stack spacing="lg">
        <div className="ppt-card">
          <div className="ppt-section-title">
            ✨ {isReport ? "보고서 생성 완료" : "HTML 슬라이드 생성 완료"}
          </div>

          <div className="ppt-result-meta">
            <div className="ppt-result-stat">
              <span className="label">유형</span>
              <span className="value">{isReport ? "서면 보고서" : "B2B 제안서"}</span>
            </div>
            {!isReport && (
              <div className="ppt-result-stat">
                <span className="label">슬라이드</span>
                <span className="value">{slideCount}장</span>
              </div>
            )}
          </div>

          <div className="ppt-preview-canvas">
            <div className="ppt-preview-placeholder">
              {/* 실제 iframe 연동은 에디터 구현 단계에서 진행 */}
              <div>
                <div className="ppt-preview-title">실시간 미리보기 캔버스</div>
                <div className="ppt-preview-desc">
                  에디터 모드에서 내용을 수정하고<br />
                  실시간으로 반영된 결과를 확인할 수 있습니다.
                </div>
              </div>
            </div>
          </div>

          <div className="ppt-result-actions">
            <div className="ppt-result-actions-inner">
              <Button variant="ghost" onClick={handleReset}>
                초기화
              </Button>
              <div className="ppt-result-actions-group">
                <Button variant="secondary" onClick={onView}>
                  발표자 모드
                </Button>
                <Button variant="secondary" onClick={onEdit}>
                  에디터 열기
                </Button>
                {isReport ? (
                  <a href={docxUrl} download className="btn btn--primary text-decoration-none">
                    DOCX 다운로드
                  </a>
                ) : (
                  <>
                    <a href={pptxUrl} download className="btn btn--secondary text-decoration-none">
                      PPTX
                    </a>
                    <a href={premiumPptxUrl} download className="btn btn--primary text-decoration-none">
                      프리미엄 PPTX
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 결과 분석 요약 (선택 사항) */}
        <div className="ppt-card">
          <div className="ppt-section-title">생성 리포트</div>
          <div className="ppt-report-box">
            <div className="ppt-report-desc">
              AI가 분석한 핵심 키워드와 디자인 전략이 여기에 표시됩니다.
            </div>
          </div>
        </div>
      </Stack>
    </div>
  );
}

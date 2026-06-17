"use client";

import { PptSessionData, getPptDownloadUrl } from "@/features/ppt";

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

  const handleReset = () => {
    if (window.confirm("초기화하시겠습니까? 현재 생성된 결과는 저장되지 않은 경우 사라질 수 있습니다.")) {
      onReset();
    }
  };

  const pptxUrl = getPptDownloadUrl(data.session_id, "pptx");
  const premiumPptxUrl = getPptDownloadUrl(data.session_id, "premium-pptx");
  const docxUrl = getPptDownloadUrl(data.session_id, "docx");

  return (
    <div className="ppt-result-panel" role="status" aria-live="polite">
      <div className="ppt-success-icon" aria-hidden="true">🎉</div>
      <h2 className="ppt-success-text">제안서 생성이 완료되었습니다!</h2>

      <nav className="ppt-btn-group" aria-label="결과 활용 메뉴">
        <button type="button" className="btn-download" onClick={onView}>
          웹 슬라이드 열기 🚀
        </button>
        <button type="button" className="btn-download btn-download--secondary" onClick={onEdit}>
          에디터 열기
        </button>
        <button type="button" className="btn-download btn-download--reset" onClick={handleReset}>
          초기화
        </button>
      </nav>

      <div className="ppt-btn-group">
        {isReport ? (
          <a href={docxUrl} download className="btn-download btn-download--docx" aria-label="보고서 DOCX 파일 다운로드">
            DOCX 다운로드
          </a>
        ) : (
          <>
            <a href={pptxUrl} download className="btn-download btn-download--gray" aria-label="기본 PPTX 파일 다운로드">
              PPTX
            </a>
            <a href={premiumPptxUrl} download className="btn-download btn-download--premium" aria-label="고품질 프리미엄 PPTX 파일 다운로드">
              프리미엄 PPTX ⭐
            </a>
          </>
        )}
      </div>
    </div>
  );
}

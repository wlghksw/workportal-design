"use client";

import { PptSessionData } from "@/features/ppt";
import { Button, Stack } from "@/components";

interface PptViewerViewProps {
  data: PptSessionData;
  onClose: () => void;
}

/**
 * PPT 슬라이드 전체화면 뷰어 컴포넌트
 */
export function PptViewerView({ data, onClose }: PptViewerViewProps) {
  const slides = data.slides_data?.slides || [];

  return (
    <main className="ppt-viewer" aria-label="프레젠테이션 모드">
      <nav className="ppt-viewer-controls" aria-label="뷰어 도구">
        <Button variant="ghost" size="sm" disabled aria-label="PDF로 저장 (준비 중)">
          📥 PDF 저장 (준비 중)
        </Button>
        <Button variant="primary" size="sm" onClick={onClose} aria-label="프레젠테이션 종료">
          닫기
        </Button>
      </nav>

      <Stack spacing="lg" className="ppt-slides-list" aria-label="슬라이드 목록">
        {slides.map((slide, idx) => (
          <article key={idx} className="ppt-slide-view" aria-label={`${idx + 1}번 슬라이드`}>
            <div className="ppt-slide-padding">
              <div className="ppt-slide-header">
                <div className="ppt-slide-num" aria-hidden="true">{idx + 1}</div>
                <div>
                  <h2 className="ppt-slide-title">
                    {slide.title}
                  </h2>
                  <div className="ppt-slide-subtitle">{slide.subtitle}</div>
                </div>
              </div>

              <ul className="ppt-slide-body">
                {slide.content?.main_points?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="ppt-slide-footer" aria-hidden="true">
              {idx + 1} / {slides.length}
            </div>
          </article>
        ))}
      </Stack>
    </main>
  );
}

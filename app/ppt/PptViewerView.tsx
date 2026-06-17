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
    <div className="ppt-viewer">
      <div className="ppt-viewer-controls">
        <Button variant="ghost" size="sm" disabled>
          📥 PDF 저장 (준비 중)
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          닫기
        </Button>
      </div>

      <Stack spacing="lg" className="ppt-slides-list">
        {slides.map((slide, idx) => (
          <section key={idx} className="ppt-slide-view">
            <div className="ppt-slide-padding">
              <div className="ppt-slide-header">
                <div className="ppt-slide-num">{idx + 1}</div>
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

            <div className="ppt-slide-footer">
              {idx + 1} / {slides.length}
            </div>
          </section>
        ))}
      </Stack>
    </div>
  );
}

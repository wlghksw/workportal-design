"use client";


import {
  EbookSceneImage,
  EbookScript,
  getEbookZipDownloadUrl,
} from "@/features/ebook";

type EbookResultViewProps = {
  images: EbookSceneImage[];
  script: EbookScript;
  onScriptChange: (script: EbookScript) => void;
};

export function EbookResultView({
  images,
  script,
  onScriptChange,
}: EbookResultViewProps) {
  const handleScriptTextChange = (index: number, value: string) => {
    const newScript = [...script];
    newScript[index] = value;
    onScriptChange(newScript);
  };

  return (
    <section className="ebook-results-wrap" role="status" aria-live="polite">
      <div className="ebook-results-card">
        <div className="ebook-results-header">
          <div className="ebook-results-title">✨ AI 동화 편집기 (1024px HQ)</div>
          <div className="ebook-btn-row">
            <a
              href={`data:application/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(script, null, 2)
              )}`}
              download="ebook_script.json"
              className="ebook-btn-action ebook-btn-copy text-decoration-none"
            >
              📝 수정된 대본 저장
            </a>
            <a
              href={getEbookZipDownloadUrl()}
              className="ebook-btn-action ebook-btn-dalle text-decoration-none"
            >
              📦 이미지 ZIP 다운로드
            </a>
          </div>
        </div>
        <p className="ebook-results-desc">
          각 장면의 대본 텍스트를 직접 수정할 수 있습니다. 수정을 완료한 후{" "}
          <strong>[수정된 대본 저장]</strong> 버튼을 누르면 JSON 파일로
          내보내집니다.
        </p>

        <div className="ebook-results-grid">
          {images.map((image, index) => (
            <div key={image.index} className="ebook-scene-card">
              <div className="ebook-scene-img-wrap">
                <span className="ebook-scene-badge">{image.index}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.data}
                  alt={`Scene ${image.index}`}
                  className="ebook-scene-img"
                  loading="lazy"
                />
              </div>
              <div className="ebook-scene-body">
                <label className="ebook-scene-label" htmlFor={`ebook-scene-script-${image.index}`}>
                  📝 대본 텍스트
                </label>
                <textarea
                  id={`ebook-scene-script-${image.index}`}
                  className="ebook-scene-textarea"
                  value={script[index] || ""}
                  onChange={(e) => handleScriptTextChange(index, e.target.value)}
                  aria-label={`Scene ${image.index} script`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

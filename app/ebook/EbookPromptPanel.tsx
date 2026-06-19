"use client";

import { useRef, useState } from "react";
import { Stack, cx } from "@/components";
import {
  EbookLayoutMode,
  EBOOK_LAYOUT_MODES,
  reportEbookActivity
} from "@/features/ebook";

interface EbookPromptPanelProps {
  scriptPrompt: string;
  imagePrompt: string;
  jsonScript: string;
  onJsonScriptChange: (value: string) => void;
  layoutMode: EbookLayoutMode;
  onLayoutModeChange: (mode: EbookLayoutMode) => void;
  onFileUpload: (file: File) => void;
  onGenerateScript: () => void;
  onGenerateImages: () => void;
  onSliceImage: () => void;
  selectedFileName?: string;
  isLoading: boolean;
}

export function EbookPromptPanel({
  scriptPrompt,
  imagePrompt,
  jsonScript,
  onJsonScriptChange,
  layoutMode,
  onLayoutModeChange,
  onFileUpload,
  onGenerateScript,
  onGenerateImages,
  onSliceImage,
  selectedFileName,
  isLoading
}: EbookPromptPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  const handleCopyPrompt = async (text: string, label: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`${label} 복사 완료!`);
      reportEbookActivity("prompt_copy", label, text.slice(0, 100));
    } catch (err) {
      setCopyStatus("복사 실패");
    }
  };

  return (
    <Stack spacing="lg">
      {/* 프롬프트 출력 & 복사 컨테이너 */}
      <fieldset className="ebook-form-group">
        <legend className="ebook-section-title">스튜디오 매직 프롬프트 빌더</legend>
        <div className="ebook-prompt-container">
          <div className="ebook-field">
            <div className="ebook-prompt-header">📝 1. 대본 생성 프롬프트</div>
            <div className="ebook-prompt-box" aria-label="대본 생성 프롬프트">{scriptPrompt || "프롬프트를 로드하는 중..."}</div>
            <div className="ebook-btn-row">
              <button
                type="button"
                className="ebook-btn-action ebook-btn-copy"
                disabled={isLoading || !scriptPrompt}
                onClick={() => handleCopyPrompt(scriptPrompt, "대본 프롬프트")}
              >✨ 대본 프롬프트 복사</button>
              <button
                type="button"
                className="ebook-btn-action ebook-btn-script"
                disabled={isLoading || !scriptPrompt}
                onClick={onGenerateScript}
              >📝 AI 대본 즉시 생성</button>
            </div>
          </div>
          <div className="ebook-field">
            <div className="ebook-prompt-header">🎨 2. 그림 생성 프롬프트</div>
            <div className="ebook-prompt-box" aria-label="그림 생성 프롬프트">{imagePrompt || "프롬프트를 로드하는 중..."}</div>
            <div className="ebook-btn-row">
              <button
                type="button"
                className="ebook-btn-action ebook-btn-copy"
                disabled={isLoading || !imagePrompt}
                onClick={() => handleCopyPrompt(imagePrompt, "그림 프롬프트")}
              >✨ 그림 프롬프트 복사</button>
              <button
                type="button"
                className="ebook-btn-action ebook-btn-dalle"
                disabled={isLoading || !imagePrompt}
                onClick={onGenerateImages}
              >🎨 AI 이미지 즉시 생성</button>
            </div>
          </div>
        </div>
        {copyStatus && <p className="text-caption text-center mt-2" role="status">{copyStatus}</p>}
      </fieldset>

      {/* ChatGPT 안내 가이드 및 링크 */}
      <section className="ebook-guide-box">
        <strong className="ebook-guide-title">💡 사용 방법 & ChatGPT 바로가기:</strong>
        <ol className="ebook-guide-list">
          <li>복사한 <strong>1. 대본 프롬프트</strong>를 <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="ebook-guide-link">ChatGPT 웹사이트 🚀</a>에 붙여넣어 <strong>16장면의 JSON 대본 텍스트</strong>를 얻으세요.</li>
          <li>복사한 <strong>2. 그림 프롬프트</strong>를 붙여넣어 글씨와 테두리가 없는 맑은 <strong>16칸(4x4) 일러스트 그리드 이미지</strong>를 생성하여 얻으세요.</li>
        </ol>
      </section>

      {/* 스토리 대본 JSON 입력 */}
      <div className="ebook-form-group">
        <label className="ebook-section-title" htmlFor="jsonInput">
          생성된 대본 <span className="ebook-opt-text">생성된 대본 미리보기입니다.</span>
        </label>
        <textarea
          id="jsonInput"
          className="ebook-json-textarea"
          placeholder='[\n  "Once upon a time...",\n  "..."\n]'
          value={jsonScript}
          onChange={(e) => onJsonScriptChange(e.target.value)}
          disabled={isLoading}
        ></textarea>
      </div>

      {/* 레이아웃 모드 및 파일 업로드 드롭존 */}
      <fieldset className="ebook-form-group">
        <legend className="ebook-section-title">
          <span className="ebook-required-dot"></span>레이아웃 모드 및 업로드
        </legend>
        <div className="ebook-mode-selector" role="radiogroup" aria-label="레이아웃 모드 선택">
          {EBOOK_LAYOUT_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={cx("ebook-mode-btn", layoutMode === mode.id && "active")}
              onClick={() => onLayoutModeChange(mode.id)}
              aria-pressed={layoutMode === mode.id}
              disabled={isLoading}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="ebook-upload-wrap">
          <div
            className="ebook-drop-zone"
            onClick={() => !isLoading && fileInputRef.current?.click()}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={isLoading ? -1 : 0}
            aria-label="생성된 16칸 이미지 선택 (클릭하거나 Enter/Space)"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              hidden
            />
            <div className="ebook-drop-icon" aria-hidden="true">📂</div>
            <div className="ebook-drop-main">
              {selectedFileName || "생성된 16칸 이미지를 선택하거나 끌어다 놓으세요"}
            </div>
            <div className="ebook-drop-sub">
              {selectedFileName ? "파일이 선택되었습니다." : "자동으로 텍스트 합성 및 1024px HQ 분할이 적용됩니다"}
            </div>
          </div>

          {selectedFileName && (
            <div className="ebook-btn-row">
              <button
                type="button"
                className="ebook-btn-action ebook-btn-script"
                onClick={onSliceImage}
                disabled={isLoading}
              >
                ✂️ 이미지 분할 실행 (16분할)
              </button>
            </div>
          )}
        </div>
      </fieldset>
    </Stack>
  );
}

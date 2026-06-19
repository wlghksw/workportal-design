"use client";

import { useState, useMemo } from "react";
import { Stack, Button, Cluster, cx } from "@/components";
import {
  EbookGenerationMode,
  EbookEnglishLevel,
  EbookApiSettings,
  EBOOK_GENERATION_MODES,
  EBOOK_ENGLISH_LEVELS,
} from "@/features/ebook";

interface EbookFormProps {
  isLoading: boolean;
  onSubmit: (data: {
    mode: EbookGenerationMode;
    title: string;
    fullStory: string;
    level: EbookEnglishLevel;
    apiSettings: EbookApiSettings;
  }) => void;
}

export function EbookForm({ isLoading, onSubmit }: EbookFormProps) {
  const [apiVisible, setApiSettingsVisible] = useState(false);
  const [mode, setMode] = useState<EbookGenerationMode>("title");
  const [title, setTitle] = useState("");
  const [fullStory, setFullStory] = useState("");
  const [level, setLevel] = useState<EbookEnglishLevel>("Kindergarten");
  const [apiSettings, setApiSettings] = useState<EbookApiSettings>({
    apiKey: "",
    imageModel: "gpt-image-2",
    chatModel: "gpt-4o-mini",
  });

  const isFormValid = useMemo(() => {
    if (mode === "title") {
      return title.trim() !== "";
    } else {
      return title.trim() !== "" && fullStory.trim() !== "";
    }
  }, [mode, title, fullStory]);

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit({ mode, title, fullStory, level, apiSettings });
  };

  return (
    <Stack spacing="lg">
      {/* 🔑 OpenAI API 설정 */}
      <section className="ebook-api-settings">
        <button
          type="button"
          className="ebook-api-toggle"
          onClick={() => setApiSettingsVisible(!apiVisible)}
          aria-expanded={apiVisible}
          aria-controls="api-settings-body"
        >
          <div className="ebook-api-toggle-title">
            <span className="ebook-required-dot"></span>🔑 OpenAI API 설정
          </div>
          <span className="ebook-api-toggle-icon" aria-hidden="true">{apiVisible ? "▲" : "▼"}</span>
        </button>
        {apiVisible && (
          <div id="api-settings-body" className="ebook-api-body">
            <div className="ebook-field">
              <label htmlFor="apiKey">🔑 OpenAI API Key</label>
              <input
                id="apiKey"
                type="password"
                className="ebook-input ebook-input--mono"
                placeholder="sk-proj-... (백엔드 환경변수 설정 시 생략 가능)"
                value={apiSettings.apiKey}
                onChange={(e) => setApiSettings({ ...apiSettings, apiKey: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="ebook-field">
              <label htmlFor="imageModel">🤖 이미지 모델 (DALL-E Model)</label>
              <input
                id="imageModel"
                type="text"
                className="ebook-input ebook-input--mono"
                value={apiSettings.imageModel}
                onChange={(e) => setApiSettings({ ...apiSettings, imageModel: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="ebook-field">
              <label htmlFor="chatModel">💬 대본 모델 (GPT/Chat Model)</label>
              <input
                id="chatModel"
                type="text"
                className="ebook-input ebook-input--mono"
                value={apiSettings.chatModel}
                onChange={(e) => setApiSettings({ ...apiSettings, chatModel: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <p className="ebook-api-hint">
              * 입력한 설정은 본인의 웹 브라우저(localStorage)에 임시 보관됩니다.
            </p>
          </div>
        )}
      </section>

      {/* 생성 방식 선택 */}
      <fieldset className="ebook-form-group">
        <legend className="ebook-section-title">
          <span className="ebook-required-dot"></span>생성 방식 선택
        </legend>
        <div className="ebook-mode-grid">
          {EBOOK_GENERATION_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={cx("ebook-mode-card", mode === m.id && "active")}
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              disabled={isLoading}
            >
              <span className="ebook-mode-icon" aria-hidden="true">{m.icon}</span>
              <span className="ebook-mode-label">{m.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* 동화 제목 입력 */}
      <div className="ebook-form-group">
        <label className="ebook-section-title" htmlFor="ebookTitle">
          <span className="ebook-required-dot"></span>동화 제목 (Title)
        </label>
        <input
          id="ebookTitle"
          type="text"
          className="ebook-input"
          placeholder="예: 엄지공주의 모험 (Thumbelina's Adventure)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      {/* 완성된 동화 텍스트 입력 (스토리 전용) */}
      {mode === "story" && (
        <div className="ebook-form-group">
          <label className="ebook-section-title" htmlFor="ebookFullStory">
            <span className="ebook-required-dot"></span>완성된 동화 텍스트 (Full Story Text)
          </label>
          <textarea
            id="ebookFullStory"
            className="ebook-textarea"
            placeholder="준비된 동화 텍스트 전체를 입력해 주세요."
            value={fullStory}
            onChange={(e) => setFullStory(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      )}

      {/* 영어 난이도 */}
      <fieldset className="ebook-form-group">
        <legend className="ebook-section-title">
          <span className="ebook-required-dot"></span>영어 난이도 (English Level)
        </legend>
        <div className="ebook-level-grid">
          {EBOOK_ENGLISH_LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={cx("ebook-level-card", level === l.id && "active")}
              onClick={() => setLevel(l.id)}
              aria-pressed={level === l.id}
              disabled={isLoading}
            >
              {l.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!isFormValid || isLoading}
        onClick={handleSubmit}
      >
        프롬프트 빌드 및 대본 준비
      </Button>
    </Stack>
  );
}

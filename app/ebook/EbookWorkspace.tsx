"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PortalHeader,
  Page,
  Stack,
  cx,
} from "@/components";
import {
  EbookGenerationMode,
  EbookEnglishLevel,
  EbookApiSettings,
  EbookLayoutMode,
  EBOOK_GUIDE_RULES,
  createDefaultEbookUiState,
  createDefaultEbookApiSettings,
  buildEbookPrompt,
  generateEbookScript,
  generateFairytaleImages,
  sliceEbookImage,
  reportEbookActivity,
} from "@/features/ebook";
import { EbookForm } from "./EbookForm";
import { EbookPromptPanel } from "./EbookPromptPanel";

/**
 * E-book 서비스 메인 작업 영역
 */
export function EbookWorkspace() {
  const [uiState, setUiState] = useState(createDefaultEbookUiState());
  const [apiSettings, setApiSettings] = useState(createDefaultEbookApiSettings());

  const handleFormSubmit = async (data: {
    mode: EbookGenerationMode;
    title: string;
    fullStory: string;
    level: EbookEnglishLevel;
    apiSettings: EbookApiSettings;
  }) => {
    if (uiState.isProcessing) return;

    setApiSettings(data.apiSettings);
    setUiState(prev => ({
      ...prev,
      title: data.title,
      fullStory: data.fullStory,
      currentLevel: data.level,
      generationMode: data.mode,
      isProcessing: true,
      processingText: "프롬프트를 빌드하고 있습니다...",
      errorMessage: null
    }));

    try {
      const res = await buildEbookPrompt({
        title: data.title,
        level: data.level,
        full_story: data.fullStory
      });

      setUiState(prev => ({
        ...prev,
        scriptPrompt: res.script_prompt,
        imagePrompt: res.image_prompt,
        isProcessing: false,
        processingText: ""
      }));
    } catch (err: unknown) {
      setUiState(prev => ({
        ...prev,
        isProcessing: false,
        processingText: "",
        errorMessage: err instanceof Error ? err.message : "프롬프트 생성에 실패했습니다."
      }));
    }
  };

  const handleGenerateScript = async () => {
    if (uiState.isProcessing || !uiState.scriptPrompt) return;

    setUiState(prev => ({
      ...prev,
      isProcessing: true,
      processingText: "ChatGPT가 대본을 집필하고 있습니다...",
      errorMessage: null,
      currentStep: 1
    }));

    try {
      const script = await generateEbookScript({
        script_prompt: uiState.scriptPrompt,
        api_key: apiSettings.apiKey,
        model: apiSettings.chatModel
      });

      setUiState(prev => ({
        ...prev,
        script,
        jsonScriptText: JSON.stringify(script, null, 2),
        isProcessing: false,
        processingText: ""
      }));

      reportEbookActivity("script_generate", "AI 대본 자동 생성", uiState.title);
    } catch (err: unknown) {
      setUiState(prev => ({
        ...prev,
        isProcessing: false,
        processingText: "",
        errorMessage: err instanceof Error ? err.message : "대본 생성에 실패했습니다."
      }));
    }
  };

  const handleGenerateImages = async () => {
    if (uiState.isProcessing || !uiState.imagePrompt) return;

    setUiState(prev => ({
      ...prev,
      isProcessing: true,
      processingText: "미술관에서 16칸 그림을 그리고 있습니다...",
      errorMessage: null,
      currentStep: 1
    }));

    try {
      const res = await generateFairytaleImages({
        image_prompt: uiState.imagePrompt,
        api_key: apiSettings.apiKey,
        model: apiSettings.imageModel,
        story_script: uiState.jsonScriptText,
        mode: uiState.layoutMode
      });

      setUiState(prev => ({
        ...prev,
        images: res.images,
        isProcessing: false,
        processingText: "",
        currentStep: 3,
        showResults: true
      }));

      reportEbookActivity("image_generate", "동화 이미지 DALL-E 생성", uiState.title);
    } catch (err: unknown) {
      setUiState(prev => ({
        ...prev,
        isProcessing: false,
        processingText: "",
        errorMessage: err instanceof Error ? err.message : "이미지 생성에 실패했습니다."
      }));
    }
  };

  const handleSliceImage = async () => {
    if (uiState.isProcessing || !uiState.selectedFile) return;

    setUiState(prev => ({
      ...prev,
      isProcessing: true,
      processingText: "이미지를 분할하고 정밀 크롭하는 중...",
      errorMessage: null,
      currentStep: 2
    }));

    try {
      const res = await sliceEbookImage({
        file: uiState.selectedFile,
        story_script: uiState.jsonScriptText,
        mode: uiState.layoutMode
      });

      setUiState(prev => ({
        ...prev,
        images: res.images,
        isProcessing: false,
        processingText: "",
        currentStep: 3,
        showResults: true
      }));

      reportEbookActivity("image_slice", "동화 이미지 분할", uiState.selectedFileName);
    } catch (err: unknown) {
      setUiState(prev => ({
        ...prev,
        isProcessing: false,
        processingText: "",
        errorMessage: err instanceof Error ? err.message : "이미지 분할에 실패했습니다."
      }));
    }
  };

  const handleJsonScriptChange = (value: string) => {
    setUiState(prev => ({ ...prev, jsonScriptText: value }));
  };

  const handleLayoutModeChange = (mode: EbookLayoutMode) => {
    setUiState(prev => ({ ...prev, layoutMode: mode }));
  };

  const handleFileUpload = (file: File) => {
    setUiState(prev => ({
      ...prev,
      selectedFileName: file.name,
      selectedFile: file
    }));
  };

  return (
    <>
      <PortalHeader
        logo={
          <Link href="/" className="brand text-decoration-none">
            <Image
              src="/shared/eduallab-logo.png"
              alt="에듀올랩"
              width={120}
              height={40}
              className="brand__logo"
            />
            <span className="brand__sub">e-book</span>
          </Link>
        }
        actions={
          <Link href="/" className="topbar__btn">워크포탈</Link>
        }
      />

      <Page>
        <div className="ebook-app">
          <h1 className="sr-only">E-book 동화책 자동 생성 서비스</h1>

          <div className="ebook-grid">
            {/* 왼쪽: 입력 영역 */}
            <main className="ebook-main-content">
              <Stack spacing="lg">
                {uiState.errorMessage && (
                  <div className="alert alert--error" role="alert">
                    {uiState.errorMessage}
                  </div>
                )}

                <EbookForm
                  isLoading={uiState.isProcessing}
                  onSubmit={handleFormSubmit}
                />

                <EbookPromptPanel
                  scriptPrompt={uiState.scriptPrompt}
                  imagePrompt={uiState.imagePrompt}
                  jsonScript={uiState.jsonScriptText || ""}
                  onJsonScriptChange={handleJsonScriptChange}
                  layoutMode={uiState.layoutMode}
                  onLayoutModeChange={handleLayoutModeChange}
                  onFileUpload={handleFileUpload}
                  onGenerateScript={handleGenerateScript}
                  onGenerateImages={handleGenerateImages}
                  onSliceImage={handleSliceImage}
                  selectedFileName={uiState.selectedFileName}
                  isLoading={uiState.isProcessing}
                />
              </Stack>
            </main>

            {/* 오른쪽: 정보 및 상태 영역 */}
            <aside className="ebook-side-info" aria-label="서비스 가이드 및 상태">
              <Stack spacing="lg">
                <div className="ebook-card">
                  <div className="ebook-section-title">AI 동화 제작 가이드</div>
                  <div className="ebook-rules-box">
                    <ul className="ebook-rules-list">
                      {EBOOK_GUIDE_RULES.map((rule, idx) => (
                        <li key={idx}>
                          <strong>{rule.title}</strong>: {rule.desc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="ebook-section-title">분할 및 변환 상태</div>
                  <nav className="ebook-step-list" aria-label="진행 단계">
                    <div className={cx("ebook-step", uiState.currentStep === 1 && "active")}>
                      <div className="ebook-step-icon">1</div>
                      <span>매직 프롬프트 실시간 빌드</span>
                    </div>
                    <div className={cx("ebook-step", uiState.currentStep === 2 && "active")}>
                      <div className="ebook-step-icon">2</div>
                      <span>4x4 이미지 그리드 검출 및 트리밍</span>
                    </div>
                    <div className={cx("ebook-step", uiState.currentStep === 3 && "active")}>
                      <div className="ebook-step-icon">3</div>
                      <span>1024px 고화질 슬라이스 및 보정</span>
                    </div>
                  </nav>
                </div>

                <div className="ebook-card">
                  <div className="ebook-section-title">HOW IT WORKS</div>
                  <div className="ebook-how-list">
                    <div className="ebook-how-step">
                      <div className="ebook-how-num">01</div>
                      <div>
                        <div className="ebook-how-text-title">스토리 앤 템플릿 빌드</div>
                        <div className="ebook-how-text-desc">스토리 텍스트 또는 제목을 통해 난이도별 최적화된 프롬프트를 만듭니다.</div>
                      </div>
                    </div>
                    <div className="ebook-how-step">
                      <div className="ebook-how-num">02</div>
                      <div>
                        <div className="ebook-how-text-title">DALL-E 그림 생성</div>
                        <div className="ebook-how-text-desc">그림 프롬프트를 사용하여 질감/테두리 없는 고품질 4x4 그리드 이미지를 얻습니다.</div>
                      </div>
                    </div>
                    <div className="ebook-how-step">
                      <div className="ebook-how-num">03</div>
                      <div>
                        <div className="ebook-how-text-title">16장 컷 분할 및 대본 병합</div>
                        <div className="ebook-how-text-desc">이미지와 JSON 대본을 업로드해 자막이 입혀진 아름다운 동화책을 완성합니다.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Stack>
            </aside>
          </div>
        </div>

        {/* 로딩 오버레이 */}
        {uiState.isProcessing && (
          <div className="loading-overlay" aria-busy="true">
            <div className="spinner"></div>
            <div className="loading-text">{uiState.processingText}</div>
          </div>
        )}
      </Page>
    </>
  );
}

"use client";

import { PptSessionData, PptUiState, PPT_EDITOR_TABS } from "@/features/ppt";
import { Stack, Button, cx } from "@/components";
import Image from "next/image";

interface PptEditorViewProps {
  data: PptSessionData;
  uiState: PptUiState;
  onUiStateChange: (state: Partial<PptUiState>) => void;
}

/**
 * PPT AI 에디터 컴포넌트 (3-Pane Layout)
 */
export function PptEditorView({ data, uiState, onUiStateChange }: PptEditorViewProps) {
  const slides = data.slides_data?.slides || [];
  const activeSlide = slides.find(s => s.page === uiState.activePage) || slides[0];

  const toggleSidebar = () => {
    onUiStateChange({ isSidebarCollapsed: !uiState.isSidebarCollapsed });
  };

  return (
    <div className="ppt-editor">
      <div className={cx("ppt-editor-container", uiState.isSidebarCollapsed && "collapsed")}>

        {/* PANE 1: EDIT TOOLBAR (Chat/Form) */}
        <section className="pane-chat" aria-labelledby="pane-edit-title">
          <div className="pane-title" id="pane-edit-title">
            <span>✨ AI 기획 어시스턴트</span>
            <div className="ppt-badge">{uiState.activePage} 페이지 편집 중</div>
          </div>

          <nav className="tabs-header" role="tablist" aria-label="편집 방식 선택">
            {PPT_EDITOR_TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={uiState.activeTab === tab.id}
                className={cx("tab-btn", uiState.activeTab === tab.id && "active")}
                onClick={() => onUiStateChange({ activeTab: tab.id })}
                type="button"
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>

          {uiState.activeTab === 'chat' ? (
            <>
              <div className="chat-messages" aria-live="polite">
                <div className="chat-bubble chat-bubble-ai">
                  안녕하세요! AI B2B 수주 기획 비서입니다. 변경 요구사항을 입력해 주세요.
                </div>
              </div>
              <div className="chat-input-area">
                <textarea
                  className="chat-textarea"
                  placeholder="AI에게 리디자인 명령어를 작성하세요..."
                  aria-label="AI 수정 요청 입력"
                />
                <div className="chat-send-row">
                  <Button variant="primary" size="sm">수정 요청 🚀</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="ppt-pane-form">
              <Stack spacing="md">
                <div className="field">
                  <label className="form-label" htmlFor="pptTitle">슬라이드 대제목</label>
                  <input id="pptTitle" type="text" className="form-input" defaultValue={activeSlide?.title} />
                </div>
                <div className="field">
                  <label className="form-label" htmlFor="pptSub">슬라이드 부제목</label>
                  <input id="pptSub" type="text" className="form-input" defaultValue={activeSlide?.subtitle} />
                </div>
                <Button variant="primary" fullWidth disabled>로컬 저장 (준비 중)</Button>
              </Stack>
            </div>
          )}
        </section>

        {/* PANE 2: IMAGE LIBRARY */}
        <section className="pane-library" aria-labelledby="pane-lib-title">
          <div className="pane-title" id="pane-lib-title">
            <span>📂 이미지 라이브러리</span>
          </div>
          <div className="library-grid" aria-label="사용 가능한 이미지 목록">
            {data.images.length > 0 ? (
              data.images.map((img, idx) => (
                <div key={idx} className="image-card">
                  <div className="image-card-img-wrap">
                    <Image
                      src={img.url || img.path || ""}
                      alt={img.tag}
                      fill
                      className="image-card-img"
                    />
                  </div>
                  <div className="image-card-info">
                    <div className="image-card-tag">[{img.tag}]</div>
                    <div className="image-card-desc">{img.description}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="ppt-progress-hint">이미지가 없습니다.</div>
            )}
          </div>
        </section>

        {/* PANE 3: PREVIEW CANVAS */}
        <section className="pane-preview" aria-label="실시간 슬라이드 미리보기">
          <div className="preview-header">
            <span className="preview-title">실시간 미리보기 캔버스</span>
            <div className="preview-controls">
              <Button variant="ghost" size="sm" onClick={toggleSidebar} aria-label={uiState.isSidebarCollapsed ? "편집 도구 열기" : "편집 도구 닫기"}>
                {uiState.isSidebarCollapsed ? "에디터 켜기" : "에디터 끄기"}
              </Button>
            </div>
          </div>

          <div className="ppt-canvas-wrapper">
            <div className="ppt-slide-canvas" role="img" aria-label={`${uiState.activePage}번 슬라이드 내용`}>
              <div className="ppt-canvas-inner">
                <div className="ppt-slide-header">
                  <div className="ppt-slide-num" aria-hidden="true">{uiState.activePage}</div>
                  <div>
                    <h2 className="ppt-slide-title">{activeSlide?.title}</h2>
                    <div className="ppt-slide-subtitle">{activeSlide?.subtitle}</div>
                  </div>
                </div>
                <ul className="ppt-slide-body-list">
                  {activeSlide?.content?.main_points?.map((p, i) => (
                    <li key={i} className="ppt-slide-body">{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <nav className="ppt-editor-footer" aria-label="슬라이드 이동">
            <Button
              variant="ghost"
              size="sm"
              disabled={uiState.activePage <= 1}
              onClick={() => onUiStateChange({ activePage: uiState.activePage - 1 })}
              aria-label="이전 슬라이드"
            >
              ◀ 이전
            </Button>
            <span className="ppt-nav-counter" aria-current="page">
              {uiState.activePage} / {slides.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={uiState.activePage >= slides.length}
              onClick={() => onUiStateChange({ activePage: uiState.activePage + 1 })}
              aria-label="다음 슬라이드"
            >
              다음 ▶
            </Button>
          </nav>
        </section>

      </div>
    </div>
  );
}

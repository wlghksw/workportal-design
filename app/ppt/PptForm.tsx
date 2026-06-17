"use client";

import { useState, useRef, useMemo, ChangeEvent } from "react";
import {
  Stack,
  Input,
  Button,
  cx,
} from "@/components";
import {
  PptWorkMode,
  PptCategory,
  PptTargetAudience,
  PptGenerateRequest,
  PptFile,
  PPT_WORK_MODES,
  PPT_CATEGORIES,
  PPT_EDITOR_CONFIG,
} from "@/features/ppt";

interface PptFormProps {
  onSubmit: (data: PptGenerateRequest) => void;
  isLoading: boolean;
}

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".xlsx", ".pptx", ".txt", ".jpg", ".jpeg", ".png"];

export function PptForm({ onSubmit, isLoading }: PptFormProps) {
  const [mode, setMode] = useState<PptWorkMode>("new");
  const [category, setCategory] = useState<PptCategory>("proposal");
  const [files, setFiles] = useState<PptFile[]>([]);
  const [basePptx, setBasePptx] = useState<PptFile | null>(null);
  const [targetAudience, setTargetAudience] = useState<PptTargetAudience>("");
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseFileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `지원하지 않는 파일 형식입니다: ${ext}`;
    }
    if (file.size > PPT_EDITOR_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `파일 크기가 너무 큽니다 (최대 ${PPT_EDITOR_CONFIG.MAX_FILE_SIZE_MB}MB)`;
    }
    return null;
  };

  const handleFilesAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const validPptFiles: PptFile[] = [];
    const newErrors: string[] = [];

    newFiles.forEach((f) => {
      const error = validateFile(f);
      if (error) {
        newErrors.push(error);
      } else {
        validPptFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          name: f.name,
          size: f.size,
          type: f.type,
          file: f,
        });
      }
    });

    if (newErrors.length > 0) {
      setErrors((prev) => ({ ...prev, files: newErrors[0] }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.files;
        return next;
      });
      setFiles((prev) => [...prev, ...validPptFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBaseFileAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (ext !== ".pptx") {
      setErrors((prev) => ({ ...prev, basePptx: "기존 PPTX 파일만 업로드 가능합니다." }));
      return;
    }

    const error = validateFile(f);
    if (error) {
      setErrors((prev) => ({ ...prev, basePptx: error }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.basePptx;
        return next;
      });
      setBasePptx({
        id: "base-pptx",
        name: f.name,
        size: f.size,
        type: f.type,
        file: f,
      });
    }
    if (baseFileInputRef.current) baseFileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const removeBaseFile = () => {
    setBasePptx(null);
  };

  const isValid = useMemo(() => {
    if (mode === "new") {
      return files.length > 0;
    } else {
      return basePptx !== null && files.length > 0;
    }
  }, [mode, files, basePptx]);

  const handleKeyDown = (e: React.KeyboardEvent, ref: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      ref.current?.click();
    }
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      mode,
      category,
      files,
      basePptx: basePptx || undefined,
      instructions,
      targetAudience,
    });
  };

  return (
    <div className="ppt-card input-side">
      {/* 작업 모드 */}
      <fieldset className="ppt-form-group">
        <legend className="ppt-section-title">
          <span className="ppt-required-dot"></span>작업 모드
        </legend>
        <div className="ppt-category-grid">
          {PPT_WORK_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={cx("ppt-category-card", mode === m.id && "active")}
              onClick={() => setMode(m.id)}
              disabled={isLoading}
              aria-pressed={mode === m.id}
            >
              <span className="ppt-cat-icon" aria-hidden="true">{m.icon}</span>
              <div className="ppt-cat-body">
                <div className="ppt-cat-title">{m.label}</div>
              </div>
            </button>
          ))}
        </div>
      </fieldset>

      {/* 제안서 유형 (신규 모드일 때만) */}
      {mode === "new" && (
        <fieldset className="ppt-form-group">
          <legend className="ppt-section-title">
            <span className="ppt-required-dot"></span>제안서 유형
          </legend>
          <div className="ppt-category-grid">
            {PPT_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={cx("ppt-category-card", category === c.id && "active")}
                onClick={() => setCategory(c.id)}
                disabled={isLoading}
                aria-pressed={category === c.id}
              >
                <span className="ppt-cat-icon" aria-hidden="true">{c.icon}</span>
                <div className="ppt-cat-body">
                  <div className="ppt-cat-title">{c.label}</div>
                </div>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* 기존 PPT 업로드 (병합 모드일 때만) */}
      {mode === "append" && (
        <div className="ppt-form-group">
          <h3 className="ppt-section-title">
            <span className="ppt-required-dot"></span>기존 완성 PPTX 업로드
          </h3>
          {!basePptx ? (
            <div
              className="ppt-drop-zone"
              onClick={() => !isLoading && baseFileInputRef.current?.click()}
              onKeyDown={(e) => handleKeyDown(e, baseFileInputRef)}
              role="button"
              tabIndex={isLoading ? -1 : 0}
              aria-label="기존 PPTX 파일 선택 (클릭하거나 Enter/Space)"
            >
              <input
                type="file"
                ref={baseFileInputRef}
                onChange={handleBaseFileAdd}
                accept=".pptx"
                hidden
              />
              <div className="ppt-drop-icon" aria-hidden="true">📊</div>
              <div className="ppt-drop-text-main">기존 PPTX 파일을 업로드하세요</div>
              <div className="ppt-drop-text-sub">확장자 .pptx 파일만 지원</div>
            </div>
          ) : (
            <div className="ppt-file-selected">
              <div className="ppt-file-item">
                <span className="ppt-file-name">📊 {basePptx.name}</span>
                <button
                  type="button"
                  className="ppt-file-remove"
                  onClick={removeBaseFile}
                  disabled={isLoading}
                  aria-label={`${basePptx.name} 파일 삭제`}
                >✕</button>
              </div>
            </div>
          )}
          {errors.basePptx && <p className="field__error" role="alert">{errors.basePptx}</p>}
        </div>
      )}

      {/* 파일 업로드 */}
      <div className="ppt-form-group">
        <h3 className="ppt-section-title">
          <span className="ppt-required-dot"></span>
          {mode === "new" ? "파일 업로드" : "추가할 원천 내용 문서들 업로드"}
        </h3>
        <div
          className="ppt-drop-zone"
          onClick={() => !isLoading && fileInputRef.current?.click()}
          onKeyDown={(e) => handleKeyDown(e, fileInputRef)}
          role="button"
          tabIndex={isLoading ? -1 : 0}
          aria-label="문서 및 이미지 파일 선택 (클릭하거나 Enter/Space)"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesAdd}
            multiple
            hidden
          />
          <div className="ppt-drop-icon" aria-hidden="true">📂</div>
          <div className="ppt-drop-text-main">문서 및 이미지를 드래그하세요</div>
          <div className="ppt-drop-text-sub">{files.length > 0 ? `${files.length}개 파일 선택됨` : "PDF, DOCX, XLSX, JPG 지원"}</div>
        </div>

        {files.length > 0 && (
          <div className="ppt-file-selected">
            {files.map((f) => (
              <div key={f.id} className="ppt-file-item">
                <span className="ppt-file-name">📄 {f.name}</span>
                <button
                  type="button"
                  className="ppt-file-remove"
                  onClick={() => removeFile(f.id)}
                  disabled={isLoading}
                  aria-label={`${f.name} 파일 삭제`}
                >✕</button>
              </div>
            ))}
          </div>
        )}
        {errors.files && <p className="field__error" role="alert">{errors.files}</p>}
      </div>

      {/* 대상 고객군 */}
      <div className="ppt-form-group">
        <label className="ppt-section-title" htmlFor="targetAudience">
          대상 고객군 <span className="ppt-opt-text">(선택)</span>
        </label>
        <select
          id="targetAudience"
          className="ppt-select"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value as PptTargetAudience)}
          disabled={isLoading}
        >
          <option value="">-- 선택 안 함 (문서에서 자동 감지) --</option>
          <option value="학교">학교 · 교육청</option>
          <option value="방과후">방과후 · 늘봄학교</option>
          <option value="돌봄">돌봄센터 · 지역아동센터</option>
          <option value="지자체">지자체 · 공공기관</option>
          <option value="학부모">학부모</option>
          <option value="교육업체">교육업체 파트너</option>
          <option value="투자">투자 · 사업계획</option>
        </select>
      </div>

      {/* 추가 지시사항 */}
      <div className="ppt-form-group">
        <label className="ppt-section-title" htmlFor="instructions">추가 지시사항</label>
        <textarea
          id="instructions"
          className="chat-textarea"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="예: '데이터 위주로 구성해줘', '파스텔 톤 강조'"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <button
        className="btn-generate"
        id="btn-generate"
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
      >
        {isLoading ? "분석 및 생성 중..." : mode === "append" ? "기존 PPT에 이어서 추가 생성" : category === "report" ? "공식 서면 보고서 생성" : "HTML 슬라이드 생성"}
      </button>
    </div>
  );
}

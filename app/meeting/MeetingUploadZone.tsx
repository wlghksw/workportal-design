"use client";

import { useRef, useState } from "react";
import { MeetingFile } from "@/features/meeting";
import { Stack, Card, cx } from "@/components";

interface MeetingUploadZoneProps {
  files: MeetingFile[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (id: string) => void;
  onFileMove: (id: string, direction: number) => void;
  onValidationError?: (message: string) => void;
  disabled?: boolean;
}

const ALLOWED_EXTENSIONS = ["m4a", "mp3", "wav", "webm", "mp4", "aac", "ogg"];

export function MeetingUploadZone({
  files,
  onFilesAdd,
  onFileRemove,
  onFileMove,
  onValidationError,
  disabled
}: MeetingUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);

  const validateFiles = (fileList: FileList | File[]): File[] => {
    const valid: File[] = [];
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
      const isValidMime = file.type.startsWith("audio/") || file.type.startsWith("video/mp4");

      if (!isValidExt && !isValidMime) {
        onValidationError?.(`오류: "${file.name}"은 지원하지 않는 파일 형식입니다.`);
        continue;
      }
      valid.push(file);
    }
    return valid;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) {
      const valid = validateFiles(e.dataTransfer.files);
      if (valid.length > 0) onFilesAdd(valid);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const valid = validateFiles(e.target.files);
      if (valid.length > 0) onFilesAdd(valid);
    }
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const formatBytes = (n: number) => {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <Stack spacing="md">
      <div
        className={cx("drop-zone", isOver && "drop-zone--over")}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="녹음 파일 선택"
      >
        <div className="drop-icon">📁</div>
        <div className="drop-text">녹음 파일을 여기 끌어다 놓거나 클릭하세요</div>
        <div className="drop-hint">m4a · mp3 · wav 등 최대 1GB · 여러 파일 가능</div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*,video/mp4"
          multiple
          hidden
        />
      </div>

      {files.length > 0 && (
        <Card variant="soft" className="files-section">
          <Card.Header>
            <Card.Title className="text-body-sm font-semibold">첨부된 녹음 파일</Card.Title>
            <Card.Description>순서대로 하나의 회의로 처리합니다.</Card.Description>
          </Card.Header>
          <Card.Body>
            <div className="file-list">
              {files.map((f, i) => (
                <div key={f.id} className="file-row">
                  <div className="idx">{String(i + 1).padStart(2, '0')}</div>
                  <div className="meta">
                    <div className="name">{f.name}</div>
                    <div className="size">{formatBytes(f.size)}</div>
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => onFileMove(f.id, -1)}
                      disabled={disabled || i === 0}
                      title="위로"
                    >↑</button>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => onFileMove(f.id, 1)}
                      disabled={disabled || i === files.length - 1}
                      title="아래로"
                    >↓</button>
                    <button
                      type="button"
                      className="icon-btn danger"
                      onClick={() => onFileRemove(f.id)}
                      disabled={disabled}
                      title="삭제"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </Stack>
  );
}

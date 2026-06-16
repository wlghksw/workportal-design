"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Stack, Button, cx, Cluster } from "@/components";

interface MeetingRecorderProps {
  onFileAdd: (file: File) => void;
  onValidationError: (message: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  disabled?: boolean;
}

export function MeetingRecorder({
  onFileAdd,
  onValidationError,
  onRecordingStateChange,
  disabled
}: MeetingRecorderProps) {
  const [recState, setRecState] = useState<"idle" | "recording" | "paused">("idle");
  const [elapsedMs, setElapsedMs] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecState("idle");
    onRecordingStateChange?.(false);
  }, [onRecordingStateChange]);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("브라우저가 마이크 녹음을 지원하지 않습니다.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg"].find(m => MediaRecorder.isTypeSupported(m)) || "";
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (finalBlob.size > 0) {
          const now = new Date();
          const timestamp = now.toISOString().replace(/[:.]/g, "").slice(0, 15);
          const ext = recorder.mimeType.includes("ogg") ? "ogg" : "webm";
          const file = new File([finalBlob], `meeting-recording-${timestamp}.${ext}`, { type: finalBlob.type });
          onFileAdd(file);
        } else {
          onValidationError("녹음된 데이터가 없습니다. 마이크 설정을 확인해주세요.");
        }
        setElapsedMs(0);
      };

      recorder.start(1000);
      setRecState("recording");
      startTimeRef.current = Date.now();
      onRecordingStateChange?.(true);

      timerRef.current = setInterval(() => {
        setElapsedMs(prev => prev + 1000);
      }, 1000);

    } catch (err: any) {
      onValidationError(err.message || "마이크 접근 중 오류가 발생했습니다.");
      setRecState("idle");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setRecState("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setRecState("recording");
      timerRef.current = setInterval(() => {
        setElapsedMs(prev => prev + 1000);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="record-zone">
      <Stack spacing="md">
        <div className="rec-timer-wrap">
          <div className="rec-timer" aria-live="polite">
            {formatTime(elapsedMs)}
          </div>
          <div className="rec-status-text" role="status">
            {recState === "recording" ? "🔴 녹음 중" : recState === "paused" ? "⏸ 일시정지" : "준비 완료"}
          </div>
        </div>

        <Cluster className="cluster-center gap-md">
          {recState === "idle" ? (
            <button
              type="button"
              className="rec-btn-main"
              onClick={startRecording}
              disabled={disabled}
              aria-label="녹음 시작"
            >
              🎙️
            </button>
          ) : (
            <>
              <button
                type="button"
                className={cx("rec-btn-main", recState === "recording" && "rec-btn-main--recording")}
                onClick={recState === "recording" ? pauseRecording : resumeRecording}
                disabled={disabled}
                aria-label={recState === "recording" ? "녹음 일시정지" : "녹음 재개"}
              >
                {recState === "recording" ? "⏸" : "▶"}
              </button>
              <Button
                variant="danger"
                onClick={stopRecording}
                disabled={disabled}
                aria-label="녹음 중지 및 저장"
              >
                ⏹ 중지 및 저장
              </Button>
            </>
          )}
        </Cluster>

        <p className="drop-hint">
          {recState === "idle"
            ? "🎙️ 버튼을 눌러 녹음을 시작하세요."
            : "중지 버튼을 누르면 녹음이 종료되고 파일 목록에 추가됩니다."}
        </p>
      </Stack>
    </div>
  );
}

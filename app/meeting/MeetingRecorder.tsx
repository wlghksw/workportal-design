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

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "마이크 접근 중 오류가 발생했습니다.";
      onValidationError(msg);
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
    <div className={cx("meeting-record-zone", recState === "recording" && "recording", recState === "paused" && "paused")}>
      <Stack spacing="md" className="cluster-center">
        <div className="rec-controls">
          {recState === "idle" ? (
            <button
              type="button"
              className="meeting-rec-btn"
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
                className={cx("meeting-rec-btn", recState === "paused" && "meeting-rec-btn--pause")}
                onClick={recState === "recording" ? pauseRecording : resumeRecording}
                disabled={disabled}
                aria-label={recState === "recording" ? "녹음 일시정지" : "녹음 재개"}
              >
                {recState === "recording" ? "⏸" : "▶"}
              </button>
              <button
                type="button"
                className="meeting-rec-btn meeting-rec-btn--finish"
                onClick={stopRecording}
                disabled={disabled}
                aria-label="녹음 중지 및 저장"
              >
                ⏹
              </button>
            </>
          )}
        </div>

        <div className="rec-hint">
          {recState === "idle"
            ? "🎙️ 눌러 녹음 · ⏸ 일시정지 · ⏹ 종료 후 파일로 저장"
            : recState === "recording"
              ? "녹음 중 — ⏸ 잠깐 멈춤 · ⏹ 끝내고 파일로 저장"
              : "일시정지 — ▶ 이어서 녹음 · ⏹ 끝내고 파일로 저장"}
        </div>

        <div className="meeting-waveform">
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
          <div className="meeting-wave-bar"></div>
        </div>

        <Cluster className="cluster-center gap-sm">
          <div className={cx("rec-dot", (recState === "recording") && "show")}></div>
          <div className="rec-time" aria-live="polite">
            {formatTime(elapsedMs)}
          </div>
        </Cluster>

        <div className="annotation">녹음 시 브라우저에서 마이크 허용을 눌러주세요.</div>
      </Stack>
    </div>
  );
}

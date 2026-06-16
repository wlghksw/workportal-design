import { MeetingTabType, MeetingMeta } from "../types/meeting.types";

/**
 * 회의록 처리 단계 정의
 */
export const MEETING_PROCESS_STAGES = {
  IDLE: "idle",           // 초기 상태
  INPUT: "input",         // 정보 입력 중
  UPLOADING: "uploading", // 오디오 파일 업로드 중
  PROCESSING: "processing", // 서버에서 STT/AI 처리 중
  SUCCESS: "success",     // 처리 완료
  ERROR: "error",         // 오류 발생
} as const;

export type MeetingProcessStage = typeof MEETING_PROCESS_STAGES[keyof typeof MEETING_PROCESS_STAGES];

/**
 * 기본 메타 정보 생성 함수
 * 호출 시점의 날짜를 기본값으로 사용
 */
export function createDefaultMeetingMeta(): MeetingMeta {
  return {
    title: "",
    participants: "",
    team: "일반업무",
    meetingDate: new Date().toISOString().split("T")[0],
    location: "",
    postToTeams: true,
  };
}

/**
 * 탭 기본 설정
 */
export const MEETING_TABS: { id: MeetingTabType; label: string; icon: string }[] = [
  { id: "record", label: "직접 녹음", icon: "🎙️" },
  { id: "upload", label: "파일 업로드", icon: "📁" },
  { id: "live", label: "실시간 회의록", icon: "⚡" },
];

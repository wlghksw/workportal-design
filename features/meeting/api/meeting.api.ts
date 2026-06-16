import {
  MeetingUploadChunkRequest,
  MeetingJobResponse,
  MeetingCreateJobRequest,
  MeetingJobStatusResponse,
  MeetingLiveStartRequest,
  MeetingLiveStartResponse,
  MeetingLiveChunkResponse,
  MeetingLiveRefreshResponse,
  MeetingLiveFinalizeResponse,
  MeetingLiveAskRequest,
  MeetingLiveAskResponse,
} from "../types/meeting.types";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

/**
 * 에듀올랩 공통 API 호출 (자격 증명 포함)
 */
async function meetingFetch(url: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    credentials: "include", // 레거시 apiFetch 및 reportFeatureUse와 동일하게 설정
    ...opts,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.detail || `요청 실패 (${res.status})`);
  }

  return res.json();
}

/**
 * 오디오 파일 청크 업로드 (FormData 사용)
 */
export async function uploadMeetingChunk(
  data: MeetingUploadChunkRequest
): Promise<{ uploadId: string }> {
  const fd = new FormData();
  fd.append("uploadId", data.uploadId);
  fd.append("chunkIndex", String(data.chunkIndex));
  fd.append("totalChunks", String(data.totalChunks));
  fd.append("ext", data.ext);
  fd.append("chunk", data.chunk, "chunk");

  const res = await fetch(`${API_BASE}/meeting-notes/upload-chunk`, {
    method: "POST",
    credentials: "include",
    body: fd,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail = data.detail;
    const msg = data.error || (typeof detail === "string" ? detail : detail?.message) || `청크 업로드 실패 (${res.status})`;
    throw new Error(msg);
  }

  return { uploadId: data.uploadId };
}

/**
 * 회의록 생성 작업(Job) 요청
 */
export async function createMeetingJob(
  data: MeetingCreateJobRequest
): Promise<MeetingJobResponse> {
  const fd = new FormData();
  data.uploadIds.forEach((uid) => fd.append("uploadIds[]", uid));
  if (data.title) fd.append("title", data.title);
  if (data.participants) fd.append("participants", data.participants);
  if (data.team) fd.append("team", data.team);
  if (data.meetingDate) fd.append("meetingDate", data.meetingDate);
  if (data.location) fd.append("location", data.location);
  fd.append("postToTeams", data.postToTeams ? "1" : "0");

  return meetingFetch("/meeting-notes/jobs", {
    method: "POST",
    body: fd,
  });
}

/**
 * 작업 진행 상태 조회 (Polling용)
 */
export async function getMeetingJobStatus(
  jobId: string
): Promise<MeetingJobStatusResponse> {
  return meetingFetch(`/meeting-notes/jobs/${jobId}`);
}

// --- 실시간 회의록 (Live) API ---

export async function startMeetingLive(
  data: MeetingLiveStartRequest
): Promise<MeetingLiveStartResponse> {
  return meetingFetch("/meeting-notes/live/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function sendMeetingLiveChunk(
  sessionId: string,
  audio: Blob
): Promise<MeetingLiveChunkResponse> {
  const fd = new FormData();
  fd.append("sessionId", sessionId);
  fd.append("audio", audio, `live-${Date.now()}.webm`);

  return meetingFetch("/meeting-notes/live/chunk", {
    method: "POST",
    body: fd,
  });
}

export async function refreshMeetingLive(
  sessionId: string
): Promise<MeetingLiveRefreshResponse> {
  return meetingFetch(`/meeting-notes/live/${encodeURIComponent(sessionId)}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}

export async function finalizeMeetingLive(
  sessionId: string
): Promise<MeetingLiveFinalizeResponse> {
  return meetingFetch(`/meeting-notes/live/${encodeURIComponent(sessionId)}/finalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}

export async function askMeetingLive(
  sessionId: string,
  prompt: string
): Promise<MeetingLiveAskResponse> {
  return meetingFetch(`/meeting-notes/live/${encodeURIComponent(sessionId)}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
}

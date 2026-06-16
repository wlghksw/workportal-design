/**
 * Meeting Service Domain Types
 * Extracted from legacy `services/meeting/ui-page.html`
 */

export type MeetingTabType = 'record' | 'live' | 'upload';

export interface MeetingMeta {
  title: string;
  participants: string;
  team: string;
  meetingDate: string;
  location: string;
  postToTeams: boolean;
}

export interface MeetingFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface MeetingHistoryItem extends MeetingMeta {
  id: string;
  noteText: string;
  duration: string;
  createdAt: number;
}

// --- API Request & Response Types ---

export interface MeetingUploadChunkRequest {
  uploadId: string;
  chunkIndex: number;
  totalChunks: number;
  ext: string;
  chunk: Blob;
}

export interface MeetingCreateJobRequest extends MeetingMeta {
  uploadIds: string[];
}

export interface MeetingJobResponse {
  jobId: string;
  error?: string;
}

export type MeetingJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface MeetingJobStatusResponse {
  status: MeetingJobStatus;
  progress?: {
    stage: 'chunked' | 'stt' | 'summarize' | 'teams';
    done?: number;
    total?: number;
  };
  result?: {
    noteText: string;
    qualityWarnings?: string[];
    chunks?: number;
    chunkSeconds?: number;
  };
  error?: string;
}

// --- Live Session Types ---

export interface MeetingLiveStartRequest {
  locale: string; // e.g., 'ko-KR'
  title: string;
  participants: string;
  meetingDate: string;
  location: string;
}

export interface MeetingLiveStartResponse {
  sessionId: string;
  error?: string;
}

export interface MeetingLiveDraft {
  summary?: string;
  done?: string;
  willDo?: string;
  openQuestions?: string;
  agenda?: string;
  noteText?: string;
}

export interface MeetingLiveRefreshResponse {
  draft: MeetingLiveDraft;
  error?: string;
}

export interface MeetingLiveFinalizeResponse {
  result: MeetingLiveDraft; // Uses same structure as draft but as 'result' key
  error?: string;
}

export interface MeetingLiveChunkResponse {
  segmentText: string;
  transcriptChars: number;
  draft?: MeetingLiveDraft;
  error?: string;
}

export interface MeetingLiveAskRequest {
  prompt: string;
}

export interface MeetingLiveAskResponse {
  answer: string;
  error?: string;
}

// --- UI State Types (for Future Implementation) ---

export type RecordingState = 'idle' | 'recording' | 'paused';

export interface MeetingUiState {
  activeTab: MeetingTabType;
  recordingState: RecordingState;
  elapsedMs: number;
  jobStatus: MeetingJobStatus | 'idle';
  progressPct: number;
  statusText: string;
  errorMessage: string;
}

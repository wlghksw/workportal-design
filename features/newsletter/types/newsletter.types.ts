/**
 * Newsletter Service Domain Types
 * Extracted from legacy `services/newsletter/web/static/app.js`
 */

// --- API Request & Response Types ---

export interface NewsletterIssue {
  issue_year: number;
  issue_month: number;
}

export interface NewsletterUsedUrlsResponse {
  count: number;
  urls: string[];
}

export interface NewsletterGenerateRequest {
  urls: string[];
  featured_link: string | null;
  issue_year: number | null;
  issue_month: number | null;
  allow_repeat: boolean;
}

export interface NewsletterGenerateResponse {
  html_file: string;
  outlook_html_file?: string;
  send_html_file?: string;
  issue_label: string;
  size_kb: number;
  preview_url: string;
  download_url: string;
  urls_used: string[];
  skipped?: string[];
  invalid?: string[];
  mail?: {
    ok: boolean;
    recipient_count?: number;
    error?: string;
  };
  detail?: string | { message?: string; skipped?: string[] };
}

export interface NewsletterMailStatusGroup {
  name: string;
  active?: number;
  total?: number;
}

export interface NewsletterMailStatusResponse {
  sender: string;
  recipient_count: number;
  groups?: NewsletterMailStatusGroup[];
  ready: boolean;
  graph_configured: boolean;
  recipients_ready: boolean;
}

export interface NewsletterMailSendRequest {
  html_file: string;
  dry_run: boolean;
  groups: string[] | null;
}

export interface NewsletterMailSendResponse {
  recipient_count: number;
  detail?: string;
}

export interface NewsletterRecipient {
  email: string;
  name: string;
  active: boolean;
  note: string;
  group: string;
}

export interface NewsletterRecipientsManageRequest {
  recipients: NewsletterRecipient[];
}

export interface NewsletterRecipientsManageResponse {
  recipients: NewsletterRecipient[];
  groups: NewsletterMailStatusGroup[];
  total: number;
  active?: number;
  empty_names?: number;
  detail?: string;
}

export interface NewsletterCsvImportResponse {
  total: number;
  active: number;
  encoding?: string;
  empty_names?: number;
  detail?: string;
}

// --- UI State Types (for Future Implementation) ---

export type NewsletterViewType = 'create' | 'recipients';

export interface NewsletterUiState {
  currentView: NewsletterViewType;
  activeStep: number;
  lastGeneratedHtmlFile: string | null;
  lastSendHtmlFile: string | null;
  isMailReady: boolean;
}

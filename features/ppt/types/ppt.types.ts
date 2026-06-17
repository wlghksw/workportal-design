/**
 * PPT Service Domain Types
 * Extracted from legacy `services/ppt/templates/*.html` and `README.md`
 */

export type PptWorkMode = 'new' | 'append';
export type PptCategory = 'proposal' | 'report' | 'at_curriculum';
export type PptTargetAudience = '학교' | '방과후' | '돌봄' | '지자체' | '학부모' | '교육업체' | '투자' | '';

export type PptSlideLayoutType = 
  | 'title' 
  | 'full_text' 
  | 'card_grid' 
  | 'split_v' 
  | 'split_h'
  | 'timeline_process' 
  | 'data_focus' 
  | 'comparison' 
  | 'catalog_grid' 
  | 'curriculum_table' 
  | 'supply_pricing' 
  | 'split_table_images' 
  | 'pricing_table_cards' 
  | 'closing' 
  | 'chapter';

export interface PptFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface PptGenerateRequest {
  mode: PptWorkMode;
  category: PptCategory;
  files: PptFile[];
  basePptx?: PptFile;
  instructions: string;
  targetAudience?: PptTargetAudience;
}

export interface PptGenerateResponse {
  redirect: string;
  session_id: string;
  error?: string;
}

// --- Session & Editor Domain Types ---

export interface PptTableCell {
  value: string;
  isHeader?: boolean;
}

export interface PptTableRow {
  cells: PptTableCell[];
}

export interface PptTableData {
  headers?: string[];
  rows: PptTableRow[];
}

export interface PptSlideContent {
  main_points?: string[];
  sub_text?: string;
  highlight_data?: string;
  table_data?: PptTableData;
}

export interface PptSlide {
  page: number;
  title: string;
  subtitle?: string;
  tag?: string;
  layout_type: PptSlideLayoutType;
  layout_ratio?: string; // e.g., '1:1'
  content?: PptSlideContent;
  matched_image_url?: string;
  image_tag?: string;
  is_base_slide?: boolean;
}

export interface PptImage {
  tag: string;
  description?: string;
  url?: string;
  path?: string;
}

export interface PptChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PptReportData {
  markdown: string;
  html?: string;
}

export interface PptSessionData {
  session_id: string;
  category: PptCategory;
  slides_data?: {
    slides: PptSlide[];
  };
  report_data?: PptReportData;
  images: PptImage[];
  chat_history: PptChatMessage[];
}

export interface PptSessionResponse {
  status: 'success' | 'error';
  data: PptSessionData;
  error?: string;
}

// --- UI State Types ---

export type PptEditorTab = 'chat' | 'form';

export interface PptUiState {
  workMode: PptWorkMode;
  category: PptCategory;
  activePage: number;
  activeTab: PptEditorTab;
  isAILoading: boolean;
  isSidebarCollapsed: boolean;
  errorMessage: string | null;
}

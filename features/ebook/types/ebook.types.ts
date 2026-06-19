/**
 * E-book Service Domain Types
 * Extracted from legacy `services/ebook/index.html`
 */

export type EbookGenerationMode = 'title' | 'story';

export type EbookEnglishLevel =
  | 'Kindergarten'
  | 'Elementary School Lower Grades (1–3)'
  | 'Elementary School Upper Grades (4–6)';

export type EbookLayoutMode = 1 | 2 | 3; // 1: 낱장 (16장), 2: 2장 펼침, 3: 3장 펼침

export interface EbookApiSettings {
  apiKey: string;
  imageModel: string;
  chatModel: string;
}

export interface EbookBuildPromptRequest {
  title: string;
  level: EbookEnglishLevel;
  full_story: string;
}

export interface EbookBuildPromptResponse {
  script_prompt: string;
  image_prompt: string;
}

export interface EbookGenerateScriptRequest {
  script_prompt: string;
  api_key?: string;
  model?: string;
}

export type EbookScript = string[];

export interface EbookGenerateImageRequest {
  image_prompt: string;
  api_key?: string;
  model?: string;
  story_script?: string; // JSON string of EbookScript
  mode: EbookLayoutMode;
}

export interface EbookSceneImage {
  index: number;
  data: string; // base64 or URL
}

export interface EbookGenerateResponse {
  images: EbookSceneImage[];
}

export interface EbookSliceRequest {
  file: File;
  story_script?: string; // JSON string of EbookScript
  mode: EbookLayoutMode;
}

// --- UI State Types ---

export interface EbookUiState {
  generationMode: EbookGenerationMode;
  currentLevel: EbookEnglishLevel;
  layoutMode: EbookLayoutMode;
  isProcessing: boolean;
  processingText: string;
  currentStep: 1 | 2 | 3;
  errorMessage: string | null;
  script: EbookScript;
  jsonScriptText?: string;
  selectedFileName?: string;
  selectedFile?: File;
  images: EbookSceneImage[];
  showResults: boolean;
  scriptPrompt: string;
  imagePrompt: string;
  title: string;
  fullStory: string;
}

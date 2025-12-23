export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface DreamEntry {
  id: string;
  content: string;
  analysis: string;
  imageUrl?: string;
  date: Date;
}

export interface AnalysisState {
  status: AnalysisStatus;
  currentAnalysis: string;
  currentImageUrl: string | null;
  isImageLoading: boolean;
  error: string | null;
}
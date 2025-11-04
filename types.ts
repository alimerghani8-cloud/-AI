
export interface AnalysisResult {
  isAI: boolean;
  confidence: number;
  reasoning: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  result: AnalysisResult;
  timestamp: string;
}

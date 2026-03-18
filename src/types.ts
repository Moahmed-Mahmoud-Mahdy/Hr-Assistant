export interface JobProfile {
  id: string;
  title: string;
  field: string;
  experience: string;
  skills: string;
  other: string;
}

export interface EvaluationResult {
  id: string;
  fileName: string;
  candidateName?: string;
  score?: number;
  keyStrengths?: string[];
  keyWeaknesses?: string[];
  summary?: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
  decision?: 'accepted' | 'rejected' | 'none';
}

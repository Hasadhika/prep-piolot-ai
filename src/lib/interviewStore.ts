// Types for interview store - no external dependencies
export type InterviewType = 'technical' | 'behavioral';

export interface QuestionResult {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  grammarScore: number;
  accuracyScore: number;
  clarityScore: number;
}

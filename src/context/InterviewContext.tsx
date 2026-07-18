import React, { createContext, useContext, useState, useCallback } from 'react';

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

interface InterviewContextType {
  resumeText: string;
  resumeFileName: string;
  interviewType: InterviewType | null;
  questions: string[];
  currentQuestionIndex: number;
  results: QuestionResult[];
  learningPlan: string;
  overallFeedback: string;
  overallScore: number;
  isLoading: boolean;

  setResumeText: (text: string) => void;
  setResumeFileName: (name: string) => void;
  setInterviewType: (type: InterviewType) => void;
  setQuestions: (questions: string[]) => void;
  nextQuestion: () => void;
  addResult: (result: QuestionResult) => void;
  setLearningPlan: (plan: string) => void;
  setOverallFeedback: (feedback: string) => void;
  setOverallScore: (score: number) => void;
  setIsLoading: (v: boolean) => void;
  reset: () => void;
}

const InterviewContext = createContext<InterviewContextType | null>(null);

export const useInterview = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error('useInterview must be used within InterviewProvider');
  return ctx;
};

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [learningPlan, setLearningPlan] = useState('');
  const [overallFeedback, setOverallFeedback] = useState('');
  const [overallScore, setOverallScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const addResult = useCallback((result: QuestionResult) => {
    setResults(prev => [...prev, result]);
  }, []);

  const reset = useCallback(() => {
    setResumeText('');
    setResumeFileName('');
    setInterviewType(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResults([]);
    setLearningPlan('');
    setOverallFeedback('');
    setOverallScore(0);
    setIsLoading(false);
  }, []);

  return (
    <InterviewContext.Provider value={{
      resumeText, resumeFileName, interviewType, questions,
      currentQuestionIndex, results, learningPlan, overallFeedback,
      overallScore, isLoading,
      setResumeText, setResumeFileName, setInterviewType, setQuestions,
      nextQuestion, addResult, setLearningPlan, setOverallFeedback,
      setOverallScore, setIsLoading, reset,
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

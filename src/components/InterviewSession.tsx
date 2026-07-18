import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useInterview } from '@/context/InterviewContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const InterviewSession = ({ onComplete }: { onComplete: () => void }) => {
  const {
    resumeText, interviewType, questions, setQuestions,
    currentQuestionIndex, nextQuestion, addResult, setIsLoading, isLoading,
    setOverallScore, setOverallFeedback,
  } = useInterview();
  const { toast } = useToast();
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate questions on mount
  useEffect(() => {
    if (questions.length > 0) return;
    const generateQuestions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('interview-ai', {
          body: { action: 'generate-questions', resumeText, interviewType },
        });
        if (error) throw error;
        setQuestions(data.questions || []);
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to generate questions.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    generateQuestions();
  }, []);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const rec = new SpeechRecognitionAPI();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(transcript);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, []);

  const toggleMic = useCallback(() => {
    if (!recognition) {
      toast({ title: 'Not supported', description: 'Speech recognition is not supported in this browser.', variant: 'destructive' });
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setAnswer('');
      recognition.start();
      setIsListening(true);
    }
  }, [recognition, isListening, toast]);

  const submitAnswer = useCallback(async () => {
    if (!answer.trim()) return;
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }

    setIsSubmitting(true);
    const currentQ = questions[currentQuestionIndex];

    try {
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: {
          action: 'evaluate-answer',
          question: currentQ,
          answer: answer.trim(),
          interviewType,
          resumeText,
        },
      });
      if (error) throw error;

      addResult({
        question: currentQ,
        answer: answer.trim(),
        score: data.score || 0,
        feedback: data.feedback || '',
        grammarScore: data.grammarScore || 0,
        accuracyScore: data.accuracyScore || 0,
        clarityScore: data.clarityScore || 0,
      });

      setAnswer('');

      if (currentQuestionIndex >= questions.length - 1) {
        // Generate overall feedback
        const { data: overallData } = await supabase.functions.invoke('interview-ai', {
          body: {
            action: 'overall-feedback',
            interviewType,
            resumeText,
            results: [...(data ? [{
              question: currentQ, answer: answer.trim(),
              score: data.score, feedback: data.feedback,
            }] : [])],
          },
        });
        if (overallData) {
          setOverallScore(overallData.overallScore || 0);
          setOverallFeedback(overallData.overallFeedback || '');
        }
        onComplete();
      } else {
        nextQuestion();
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to evaluate answer.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }, [answer, currentQuestionIndex, questions, interviewType, resumeText, recognition, isListening]);

  if (isLoading || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-display">Preparing your interview questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="glass-card rounded-xl p-8"
        >
          <p className="text-xs uppercase tracking-wider text-primary mb-3 font-display font-semibold">
            {interviewType === 'technical' ? 'Technical Question' : 'Behavioral Question'}
          </p>
          <p className="text-lg text-foreground font-medium leading-relaxed">{currentQuestion}</p>
        </motion.div>
      </AnimatePresence>

      {/* Answer */}
      <div className="space-y-4">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer or use the microphone..."
          className="min-h-[140px] bg-secondary/50 border-border focus:border-primary/50 resize-none"
          disabled={isSubmitting}
        />

        <div className="flex items-center gap-3">
          <Button
            variant="glass"
            size="icon"
            onClick={toggleMic}
            className={isListening ? 'border-primary text-primary animate-pulse-glow' : ''}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          {isListening && (
            <span className="text-sm text-primary animate-pulse">Listening...</span>
          )}

          <div className="flex-1" />

          <Button
            variant="hero"
            onClick={submitAnswer}
            disabled={!answer.trim() || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating...</>
            ) : (
              <><Send className="w-4 h-4" /> Submit Answer</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;

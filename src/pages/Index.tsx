import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InterviewTips from '@/components/InterviewTips';
import ResumeUpload from '@/components/ResumeUpload';
import InterviewTypeSelect from '@/components/InterviewTypeSelect';
import InterviewSession from '@/components/InterviewSession';
import ResultsDashboard from '@/components/ResultsDashboard';
import { InterviewProvider, useInterview } from '@/context/InterviewContext';


type Step = 'landing' | 'upload' | 'select' | 'interview' | 'results';

const InterviewApp = () => {
  const [step, setStep] = useState<Step>('landing');
  const { reset } = useInterview();

  const handleRestart = () => {
    reset();
    setStep('landing');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">PrepPilot AI</span>
          </div>
          {step !== 'landing' && step !== 'results' && (
            <div className="flex gap-1">
              {['upload', 'select', 'interview'].map((s, i) => (
                <div
                  key={s}
                  className={`w-8 h-1 rounded-full transition-colors ${
                    ['upload', 'select', 'interview'].indexOf(step) >= i
                      ? 'bg-primary'
                      : 'bg-secondary'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Hero */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-4xl md:text-5xl font-bold leading-tight"
                >
                  Ace Your Next Interview with{' '}
                  <span className="text-gradient">AI-Powered Prep</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground"
                >
                  Upload your resume, practice with AI-generated questions, and get
                  personalized feedback on grammar, accuracy, and clarity.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button variant="hero" size="lg" onClick={() => setStep('upload')} className="gap-2 mt-4">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              {/* Tips */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground text-center mb-6">
                  Interview Do's & Don'ts
                </h2>
                <InterviewTips />
              </div>
            </motion.div>
          )}

          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="font-display text-3xl font-bold text-foreground">Upload Your Resume</h2>
                <p className="text-muted-foreground">We'll analyze it to create personalized interview questions.</p>
              </div>
              <ResumeUpload onComplete={() => setStep('select')} />
            </motion.div>
          )}

          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="font-display text-3xl font-bold text-foreground">Choose Interview Type</h2>
                <p className="text-muted-foreground">Select the type of interview you want to practice.</p>
              </div>
              <InterviewTypeSelect onSelect={() => setStep('interview')} />
            </motion.div>
          )}

          {step === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <InterviewSession onComplete={() => setStep('results')} />
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultsDashboard onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const Index = () => (
  <InterviewProvider>
    <InterviewApp />
  </InterviewProvider>
);

export default Index;

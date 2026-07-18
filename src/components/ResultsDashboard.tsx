import { motion } from 'framer-motion';
import { Trophy, Target, BookOpen, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInterview } from '@/context/InterviewContext';
import ReactMarkdown from 'react-markdown';

const ScoreCircle = ({ score, label, delay = 0 }: { score: number; label: string; delay?: number }) => {
  const color = score >= 80 ? 'text-success' : score >= 60 ? 'text-primary' : 'text-destructive';
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
          <motion.circle
            cx="48" cy="48" r="40" fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-display text-xl font-bold ${color}`}>{score}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
    </motion.div>
  );
};

const ResultsDashboard = ({ onRestart }: { onRestart: () => void }) => {
  const { results, overallScore, overallFeedback, learningPlan, interviewType } = useInterview();

  const avgGrammar = Math.round(results.reduce((s, r) => s + r.grammarScore, 0) / (results.length || 1));
  const avgAccuracy = Math.round(results.reduce((s, r) => s + r.accuracyScore, 0) / (results.length || 1));
  const avgClarity = Math.round(results.reduce((s, r) => s + r.clarityScore, 0) / (results.length || 1));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-8 text-center"
      >
        <Trophy className="w-10 h-10 text-primary mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">
          {interviewType === 'technical' ? 'Technical' : 'Behavioral'} Interview Results
        </h2>

        <div className="flex justify-center gap-10 mb-6">
          <ScoreCircle score={overallScore || Math.round(results.reduce((s, r) => s + r.score, 0) / (results.length || 1))} label="Overall" delay={0} />
          <ScoreCircle score={avgGrammar} label="Grammar" delay={0.1} />
          <ScoreCircle score={avgAccuracy} label="Accuracy" delay={0.2} />
          <ScoreCircle score={avgClarity} label="Clarity" delay={0.3} />
        </div>
      </motion.div>

      {/* Per-question results */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" /> Question Breakdown
        </h3>
        {results.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="glass-card rounded-lg p-5 space-y-3"
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-foreground flex-1 pr-4">Q{i + 1}: {r.question}</p>
              <span className={`text-sm font-display font-bold ${r.score >= 80 ? 'text-success' : r.score >= 60 ? 'text-primary' : 'text-destructive'}`}>
                {r.score}/100
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Your answer: {r.answer.slice(0, 200)}{r.answer.length > 200 ? '...' : ''}</p>
            <p className="text-sm text-secondary-foreground">{r.feedback}</p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Grammar: {r.grammarScore}</span>
              <span>Accuracy: {r.accuracyScore}</span>
              <span>Clarity: {r.clarityScore}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall feedback */}
      {overallFeedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">Overall Feedback</h3>
          <div className="text-sm text-secondary-foreground prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{overallFeedback}</ReactMarkdown>
          </div>
        </motion.div>
      )}

      {/* Learning Plan */}
      {learningPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" /> Personalized Learning Plan
          </h3>
          <div className="text-sm text-secondary-foreground prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{learningPlan}</ReactMarkdown>
          </div>
        </motion.div>
      )}

      <div className="flex justify-center pt-4">
        <Button variant="hero" onClick={onRestart} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Start New Interview
        </Button>
      </div>
    </div>
  );
};

export default ResultsDashboard;

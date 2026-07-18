import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const dos = [
  "Research the company thoroughly before the interview",
  "Practice the STAR method for behavioral questions",
  "Prepare specific examples from your experience",
  "Ask thoughtful questions at the end",
  "Maintain good body language and eye contact",
  "Follow up with a thank-you email",
];

const donts = [
  "Don't speak negatively about previous employers",
  "Don't give vague or generic answers",
  "Don't interrupt the interviewer",
  "Don't forget to listen carefully to each question",
  "Don't lie or exaggerate your experience",
  "Don't forget to prepare questions for the interviewer",
];

const InterviewTips = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-lg p-6"
      >
        <h3 className="font-display text-xl font-semibold text-success mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Do's
        </h3>
        <ul className="space-y-3">
          {dos.map((tip, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-start gap-3 text-sm text-secondary-foreground"
            >
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-success shrink-0" />
              {tip}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-lg p-6"
      >
        <h3 className="font-display text-xl font-semibold text-destructive mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          Don'ts
        </h3>
        <ul className="space-y-3">
          {donts.map((tip, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-start gap-3 text-sm text-secondary-foreground"
            >
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
              {tip}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default InterviewTips;

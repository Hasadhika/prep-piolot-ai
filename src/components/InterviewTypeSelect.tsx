import { motion } from 'framer-motion';
import { Code2, Users } from 'lucide-react';
import { useInterview, InterviewType } from '@/context/InterviewContext';

const InterviewTypeSelect = ({ onSelect }: { onSelect: () => void }) => {
  const { setInterviewType } = useInterview();

  const handleSelect = (type: InterviewType) => {
    setInterviewType(type);
    onSelect();
  };

  const options = [
    {
      type: 'technical' as InterviewType,
      icon: Code2,
      title: 'Technical Round',
      description: 'Data structures, algorithms, system design, and domain-specific questions based on your resume.',
    },
    {
      type: 'behavioral' as InterviewType,
      icon: Users,
      title: 'HR / Behavioral Round',
      description: 'Situational questions, leadership, teamwork, conflict resolution, and culture fit.',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      {options.map((opt, i) => (
        <motion.button
          key={opt.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect(opt.type)}
          className="glass-card rounded-xl p-8 text-left hover:border-primary/50 transition-all duration-300 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <opt.icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">{opt.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{opt.description}</p>
        </motion.button>
      ))}
    </div>
  );
};

export default InterviewTypeSelect;

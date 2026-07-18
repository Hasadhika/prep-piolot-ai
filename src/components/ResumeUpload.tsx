import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInterview } from '@/context/InterviewContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromPDF } from '@/lib/pdfParser';

const ResumeUpload = ({ onComplete }: { onComplete: () => void }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { setResumeText, setResumeFileName, resumeFileName, setLearningPlan, setIsLoading } = useInterview();
  const { toast } = useToast();

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.pdf') && !file.name.endsWith('.md')) {
      toast({ title: 'Unsupported format', description: 'Please upload a .txt, .md or .pdf file', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    setResumeFileName(file.name);

    try {
      let text: string;
      if (file.name.endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }

      if (!text.trim()) {
        toast({ title: 'Empty resume', description: 'Could not extract text from the file. Try a different format.', variant: 'destructive' });
        setIsUploading(false);
        return;
      }

      setResumeText(text);

      // Analyze resume and generate learning plan
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: { action: 'analyze-resume', resumeText: text },
      });

      if (error) throw error;
      setLearningPlan(data.learningPlan || '');
      toast({ title: 'Resume analyzed!', description: 'Your personalized learning plan is ready.' });
      onComplete();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to analyze resume. Please try again.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  }, [setResumeText, setResumeFileName, setLearningPlan, setIsLoading, toast, onComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  }, [processFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto"
    >
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`glass-card rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
          dragActive ? 'border-primary/60 glow' : 'hover:border-primary/30'
        }`}
        onClick={() => document.getElementById('resume-input')?.click()}
      >
        <input
          id="resume-input"
          type="file"
          accept=".txt,.pdf,.md"
          className="hidden"
          onChange={handleFileInput}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Analyzing your resume...</p>
          </div>
        ) : resumeFileName ? (
          <div className="flex flex-col items-center gap-4">
            <FileText className="w-12 h-12 text-primary" />
            <p className="text-foreground font-medium">{resumeFileName}</p>
            <p className="text-sm text-muted-foreground">Resume uploaded successfully</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-display font-semibold text-lg">
                Drop your resume here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports .txt, .md, .pdf files
              </p>
            </div>
            <Button variant="glass" size="sm">Browse Files</Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResumeUpload;

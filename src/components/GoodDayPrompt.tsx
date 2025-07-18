import React, { useState } from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface GoodDayPromptProps {
  wellnessScore: number;
  onClose: () => void;
}

const GoodDayPrompt: React.FC<GoodDayPromptProps> = ({ wellnessScore, onClose }) => {
  const [positiveFactors, setPositiveFactors] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user || !positiveFactors.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('positive_factors')
        .insert({
          user_id: user.id,
          factor_text: positiveFactors.trim(),
          wellness_score: wellnessScore
        } as any);

      if (error) throw error;

      toast({
        title: "Wonderful! 🌟",
        description: "Your positive factors have been saved. We'll remind you of them during challenging days.",
      });

      onClose();
    } catch (error) {
      console.error('Error saving positive factors:', error);
      toast({
        title: "Error",
        description: "Failed to save your positive factors. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-strong max-w-md w-full relative overflow-hidden">
        {/* Header with Celebration Graphics */}
        <div className="bg-gradient-to-r from-ojas-primary-blue to-ojas-soft-gold p-6 text-white relative">
          <div className="absolute top-2 right-2">
            <Sparkles className="w-6 h-6 opacity-70" />
          </div>
          <div className="absolute bottom-2 left-4">
            <Heart className="w-4 h-4 opacity-50" />
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Great Day! 🌟</h2>
            <p className="text-white/90 text-sm">
              Your wellness score is {wellnessScore} - that's wonderful!
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-ojas-charcoal-gray dark:text-ojas-mist-white mb-2">
              What made today special?
            </h3>
            <p className="text-sm text-ojas-slate-gray dark:text-ojas-cloud-silver mb-4">
              Share what contributed to your good day. We'll remind you of these positive factors during challenging times.
            </p>
            
            <textarea
              value={positiveFactors}
              onChange={(e) => setPositiveFactors(e.target.value)}
              placeholder="I felt great because... (e.g., good sleep, medication on time, family visit, gentle exercise)"
              className="w-full h-32 p-4 border border-ojas-cloud-silver rounded-xl focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue focus:border-transparent resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-ojas-cloud-silver text-ojas-charcoal-gray rounded-xl font-medium hover:bg-ojas-slate-gray/20 transition-colors disabled:opacity-50"
            >
              Skip for now
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !positiveFactors.trim()}
              className="flex-1 px-4 py-3 bg-ojas-primary-blue text-white rounded-xl font-medium hover:bg-ojas-primary-blue-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  Save Memories
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoodDayPrompt;

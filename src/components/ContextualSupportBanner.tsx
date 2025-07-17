import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Users, Heart, TrendingDown } from 'lucide-react';

interface ContextualSupportBannerProps {
  userRole?: 'patient' | 'caregiver';
  wellnessScore: number;
  recentSymptoms: Array<{
    symptom_type: string;
    severity: number;
    logged_at: string;
  }>;
  onNavigateToSupport: () => void;
}

const ContextualSupportBanner: React.FC<ContextualSupportBannerProps> = ({
  userRole = 'patient',
  wellnessScore,
  recentSymptoms,
  onNavigateToSupport
}) => {
  const [dismissed, setDismissed] = useState(false);

  // Check if support should be suggested
  const shouldShowSupport = () => {
    // Show if wellness score is declining (below 60)
    if (wellnessScore < 60) return true;
    
    // Show if multiple high-severity symptoms in recent days
    const highSeveritySymptoms = recentSymptoms.filter(s => s.severity >= 7);
    if (highSeveritySymptoms.length >= 2) return true;
    
    // Show if consistent pattern of symptoms
    const recentSymptomsCount = recentSymptoms.filter(s => {
      const symptomDate = new Date(s.logged_at);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return symptomDate >= threeDaysAgo;
    }).length;
    
    return recentSymptomsCount >= 3;
  };

  const getSupportMessage = () => {
    if (wellnessScore < 50) {
      return {
        icon: Heart,
        title: "We're here to help",
        message: "It seems like you've been having a tough week. You don't have to go through this alone.",
        buttonText: "Connect with Support"
      };
    }
    
    if (wellnessScore < 60) {
      return {
        icon: TrendingDown,
        title: "Consider reaching out",
        message: "Your wellness score has been lower lately. Connecting with others who understand can really help.",
        buttonText: "Find Support Groups"
      };
    }
    
    const highSeveritySymptoms = recentSymptoms.filter(s => s.severity >= 7);
    if (highSeveritySymptoms.length >= 2) {
      return {
        icon: Users,
        title: "You're not alone",
        message: "Managing multiple symptoms can be challenging. Consider connecting with others who share similar experiences.",
        buttonText: "Join Support Groups"
      };
    }
    
    return {
      icon: Users,
      title: "Community support available",
      message: "Many people find it helpful to share experiences and get support from others on similar health journeys.",
      buttonText: "Explore Support Groups"
    };
  };

  if (!shouldShowSupport() || dismissed) {
    return null;
  }

  const supportData = getSupportMessage();
  const IconComponent = supportData.icon;

  return (
    <Card className="border-l-4 border-l-ojas-calming-green bg-ojas-calming-green/5 dark:bg-ojas-calming-green/10">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-ojas-calming-green/10 flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-5 h-5 text-ojas-calming-green" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
              {supportData.title}
            </h3>
            <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver text-sm leading-relaxed mb-4">
              {supportData.message}
            </p>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-ojas-calming-green hover:bg-ojas-calming-green/90 text-white"
                onClick={onNavigateToSupport}
              >
                <Users className="h-3 w-3 mr-1" />
                {supportData.buttonText}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDismissed(true)}
                className="text-ojas-text-secondary border-ojas-border hover:bg-ojas-bg-light"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-ojas-text-secondary hover:text-ojas-text-main flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContextualSupportBanner;
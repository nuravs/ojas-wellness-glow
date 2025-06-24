
import React from 'react';
import InsightCard from './InsightCard';

interface InsightsSectionProps {
  dismissedInsights: Set<string>;
  onDismissInsight: (id: string) => void;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({
  dismissedInsights,
  onDismissInsight
}) => {
  // Sample insights with enhanced messaging
  const insights = [
    {
      id: 'consistency',
      type: 'encouragement' as const,
      title: 'Great consistency! 🌟',
      message: "You've been taking your medications regularly. This consistency helps maintain steady therapeutic levels and supports your overall wellness journey."
    },
    {
      id: 'morning-routine',
      type: 'tip' as const,
      title: 'Morning routine tip 🌅',
      message: "Taking medications at the same time each day can help maintain steady levels in your system. Consider setting them near your morning coffee or toothbrush as a gentle reminder."
    }
  ];

  const visibleInsights = insights.filter(insight => !dismissedInsights.has(insight.id));

  if (visibleInsights.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-ojas-text-main mb-8 font-heading">
        Your Wellness Insights
      </h2>
      <div className="space-y-6">
        {visibleInsights.map(insight => (
          <InsightCard
            key={insight.id}
            type={insight.type}
            title={insight.title}
            message={insight.message}
            onDismiss={() => onDismissInsight(insight.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default InsightsSection;

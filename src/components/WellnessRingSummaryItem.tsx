
import React from 'react';

interface SummaryItem {
  label: string;
  value: string;
  status: 'good' | 'attention' | 'neutral';
  icon: JSX.Element;
  textStatus: string;
}

interface WellnessRingSummaryItemProps {
  item: SummaryItem;
}

const WellnessRingSummaryItem: React.FC<WellnessRingSummaryItemProps> = ({ item }) => {
  return (
    <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-ojas-bg-light dark:hover:bg-ojas-slate-gray/20 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
          item.status === 'good' ? 'bg-ojas-success' : 
          item.status === 'attention' ? 'bg-ojas-alert' : 
          'bg-ojas-text-secondary'
        }`}>
          {item.status !== 'neutral' && (
            <div className="w-2 h-2 bg-white rounded-full" />
          )}
        </div>
        <span className="text-ojas-text-main dark:text-ojas-mist-white font-medium">{item.label}</span>
        <div className="flex items-center gap-2">
          {item.icon}
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            item.status === 'good' 
              ? 'bg-ojas-success/20 text-ojas-success' 
              : item.status === 'attention'
              ? 'bg-ojas-alert/20 text-ojas-alert'
              : 'bg-ojas-border text-ojas-text-secondary'
          }`}>
            {item.textStatus}
          </span>
        </div>
      </div>
      <span className="font-semibold text-ojas-text-main dark:text-ojas-mist-white text-right">
        {item.value}
      </span>
    </div>
  );
};

export default WellnessRingSummaryItem;

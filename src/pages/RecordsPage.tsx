
import React from 'react';
import { FileText, Download, Upload, Calendar, User } from 'lucide-react';

const RecordsPage: React.FC = () => {
  const records = [
    { id: '1', title: 'Lab Results - June 2024', date: 'June 15, 2024', type: 'lab' },
    { id: '2', title: 'MRI Scan Report', date: 'May 28, 2024', type: 'imaging' },
    { id: '3', title: 'Medication List', date: 'June 20, 2024', type: 'prescription' },
    { id: '4', title: 'Doctor Visit Notes', date: 'June 10, 2024', type: 'visit' },
  ];

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'lab': return <FileText className="w-6 h-6 text-wellness-blue" />;
      case 'imaging': return <Calendar className="w-6 h-6 text-wellness-green" />;
      case 'prescription': return <User className="w-6 h-6 text-wellness-yellow" />;
      default: return <FileText className="w-6 h-6 text-wellness-calm-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wellness-calm-800 mb-2">
            Your Medical Records
          </h1>
          <p className="text-wellness-calm-600 text-lg">
            Keep all your important documents in one place
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="ojas-card hover:scale-105 active:scale-95 transition-all duration-200 text-center min-h-[100px] flex flex-col items-center justify-center gap-3">
            <Upload className="w-8 h-8 text-wellness-green" />
            <span className="text-lg font-medium text-wellness-calm-800">Upload Document</span>
          </button>
          <button className="ojas-card hover:scale-105 active:scale-95 transition-all duration-200 text-center min-h-[100px] flex flex-col items-center justify-center gap-3">
            <Download className="w-8 h-8 text-wellness-blue" />
            <span className="text-lg font-medium text-wellness-calm-800">Export Records</span>
          </button>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-wellness-calm-800 mb-4">
            Recent Documents
          </h2>
          {records.map(record => (
            <div key={record.id} className="ojas-card hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                {getRecordIcon(record.type)}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-wellness-calm-800 mb-1">
                    {record.title}
                  </h3>
                  <p className="text-wellness-calm-600">
                    {record.date}
                  </p>
                </div>
                <button className="w-12 h-12 rounded-full bg-wellness-calm-100 hover:bg-wellness-calm-200 flex items-center justify-center transition-colors duration-200">
                  <Download className="w-5 h-5 text-wellness-calm-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;

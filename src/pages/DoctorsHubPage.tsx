
import React from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Clock,
  MapPin,
  Plus 
} from 'lucide-react';

const DoctorsHubPage: React.FC = () => {
  const doctors = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      specialty: 'Neurologist',
      nextAppt: 'June 15, 2:30 PM',
      phone: '(555) 123-4567',
      location: 'Downtown Medical Center',
      avatar: '👩‍⚕️'
    },
    {
      id: '2',
      name: 'Dr. Michael Rodriguez',
      specialty: 'Physical Therapist',
      nextAppt: 'June 12, 10:00 AM',
      phone: '(555) 987-6543',
      location: 'Wellness Therapy Clinic',
      avatar: '👨‍⚕️'
    }
  ];

  const quickActions = [
    {
      id: 'schedule',
      title: 'Schedule Appointment',
      icon: Calendar,
      color: 'wellness-green'
    },
    {
      id: 'message',
      title: 'Send Message',
      icon: MessageSquare,
      color: 'wellness-blue'
    },
    {
      id: 'emergency',
      title: 'Emergency Contact',
      icon: Phone,
      color: 'wellness-red'
    }
  ];

  const getActionColorClasses = (color: string) => {
    switch (color) {
      case 'wellness-green': return 'bg-wellness-green/10 hover:bg-wellness-green/20 text-wellness-green border-wellness-green/20';
      case 'wellness-blue': return 'bg-wellness-blue/10 hover:bg-wellness-blue/20 text-wellness-blue border-wellness-blue/20';
      case 'wellness-red': return 'bg-wellness-red/10 hover:bg-wellness-red/20 text-wellness-red border-wellness-red/20';
      default: return 'bg-calm-100 hover:bg-calm-200 text-calm-700 border-calm-200';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-calm-800 mb-2">
              My Doctors
            </h1>
            <p className="text-calm-600 text-lg">
              Your healthcare team
            </p>
          </div>
          <button className="w-12 h-12 bg-wellness-green rounded-full flex items-center justify-center text-white hover:bg-wellness-green/90 transition-colors duration-200">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {quickActions.map(action => (
            <button
              key={action.id}
              className={`ojas-card ${getActionColorClasses(action.color)} hover:scale-105 active:scale-95 transition-all duration-200 text-center min-h-[100px] flex flex-col items-center justify-center gap-2 border-2`}
            >
              <action.icon className="w-6 h-6"  />
              <span className="text-sm font-medium">{action.title}</span>
            </button>
          ))}
        </div>

        {/* Doctors List */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-calm-800 mb-4">
            Healthcare Team
          </h2>
          {doctors.map(doctor => (
            <div key={doctor.id} className="ojas-card hover:shadow-md transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-wellness-blue/10 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {doctor.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-calm-800 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-wellness-blue font-medium mb-2">
                    {doctor.specialty}
                  </p>
                  
                  <div className="space-y-2 text-sm text-calm-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Next: {doctor.nextAppt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 ojas-button-secondary text-sm py-2">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="flex-1 ojas-button-primary text-sm py-2">
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contact */}
        <div className="ojas-card bg-wellness-red/5 border-2 border-wellness-red/20">
          <h3 className="text-lg font-semibold text-wellness-red mb-2">
            🚨 Emergency Contact
          </h3>
          <p className="text-calm-700 mb-3">
            If you're experiencing a medical emergency, call 911 immediately.
          </p>
          <button className="ojas-button bg-wellness-red text-white hover:bg-wellness-red/90">
            <Phone className="w-5 h-5" />
            Emergency Services: 911
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsHubPage;

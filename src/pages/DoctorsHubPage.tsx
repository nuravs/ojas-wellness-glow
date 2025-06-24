import React from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Clock,
  MapPin,
  Plus,
  Upload,
  FileText,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface DoctorsHubPageProps {
  onBack?: () => void;
}

const DoctorsHubPage: React.FC<DoctorsHubPageProps> = ({ onBack }) => {
  const upcomingAppointments = [
    {
      id: '1',
      doctor: 'Dr. Sarah Chen',
      specialty: 'Neurologist',
      date: 'June 15, 2:30 PM',
      location: 'Downtown Medical Center',
      status: 'confirmed',
      avatar: '👩‍⚕️'
    }
  ];

  const recentResults = [
    {
      id: '1',
      type: 'Blood Work',
      date: 'June 10',
      status: 'new',
      critical: false,
      doctor: 'Dr. Sarah Chen'
    },
    {
      id: '2',
      type: 'MRI Scan',
      date: 'June 8',
      status: 'critical',
      critical: true,
      doctor: 'Dr. Sarah Chen'
    }
  ];

  const doctors = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      specialty: 'Neurologist',
      phone: '(555) 123-4567',
      location: 'Downtown Medical Center',
      avatar: '👩‍⚕️'
    },
    {
      id: '2',
      name: 'Dr. Michael Rodriguez',
      specialty: 'Physical Therapist',
      phone: '(555) 987-6543',
      location: 'Wellness Therapy Clinic',
      avatar: '👨‍⚕️'
    }
  ];

  const handleUpload = () => {
    console.log('Upload lab report or prescription');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Fallback navigation
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-ojas-mist-white pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Enhanced Header with Back Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-ojas-soft border-2 border-ojas-cloud-silver hover:bg-gray-50 transition-colors duration-200 focus:ring-4 focus:ring-ojas-primary/20"
            aria-label="Go back to previous screen"
          >
            <ArrowLeft className="w-6 h-6 text-ojas-charcoal-gray" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-ojas-charcoal-gray mb-2">
              My Doctors
            </h1>
            <p className="text-ojas-slate-gray text-lg">
              Your healthcare team
            </p>
          </div>
          <button 
            onClick={handleUpload}
            className="w-12 h-12 bg-ojas-primary-blue rounded-full flex items-center justify-center text-white hover:bg-ojas-primary-blue-hover transition-colors duration-200 shadow-ojas-medium focus:ring-4 focus:ring-ojas-primary/20"
            aria-label="Upload medical documents"
          >
            <Upload className="w-6 h-6" />
          </button>
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
              Upcoming Appointments
            </h2>
            {upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ojas-primary-blue/10 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {appointment.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-1">
                      {appointment.doctor}
                    </h3>
                    <p className="text-ojas-primary-blue font-medium mb-2">
                      {appointment.specialty}
                    </p>
                    
                    <div className="space-y-2 text-sm text-ojas-slate-gray mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-ojas-primary-blue" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-ojas-primary-blue" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-3 bg-ojas-primary-blue text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-ojas-primary-blue-hover active:scale-95">
                        Confirm
                      </button>
                      <button className="flex-1 px-4 py-3 bg-white border-2 border-ojas-cloud-silver text-ojas-charcoal-gray rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-gray-50 active:scale-95">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Results */}
        {recentResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
              Recent Results
            </h2>
            <div className="space-y-3">
              {recentResults.map(result => (
                <div 
                  key={result.id} 
                  className={`bg-white rounded-2xl shadow-ojas-soft p-4 border-2 ${
                    result.critical 
                      ? 'border-ojas-vibrant-coral animate-pulse-gentle' 
                      : result.status === 'new'
                        ? 'border-ojas-soft-gold'
                        : 'border-ojas-cloud-silver'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      result.critical 
                        ? 'bg-ojas-vibrant-coral/10 text-ojas-vibrant-coral' 
                        : 'bg-ojas-primary-blue/10 text-ojas-primary-blue'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-ojas-charcoal-gray">{result.type}</h3>
                        {result.critical && (
                          <div className="w-2 h-2 bg-ojas-vibrant-coral rounded-full animate-pulse"></div>
                        )}
                        {result.status === 'new' && (
                          <span className="px-2 py-1 bg-ojas-soft-gold/20 text-ojas-soft-gold text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ojas-slate-gray">{result.date} • {result.doctor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Healthcare Team */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
            Healthcare Team
          </h2>
          {doctors.map(doctor => (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-ojas-calming-green/10 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {doctor.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-ojas-primary-blue font-medium mb-2">
                    {doctor.specialty}
                  </p>
                  
                  <div className="space-y-2 text-sm text-ojas-slate-gray mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-3 bg-white border-2 border-ojas-cloud-silver text-ojas-charcoal-gray rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-gray-50 active:scale-95 flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="flex-1 px-4 py-3 bg-ojas-primary-blue text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-ojas-primary-blue-hover active:scale-95 flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-2xl shadow-ojas-soft border-2 border-ojas-vibrant-coral/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-ojas-vibrant-coral" />
            <h3 className="text-lg font-semibold text-ojas-vibrant-coral">
              Emergency Contact
            </h3>
          </div>
          <p className="text-ojas-charcoal-gray mb-4">
            If you're experiencing a medical emergency, call 911 immediately.
          </p>
          <button className="w-full px-6 py-4 bg-ojas-vibrant-coral text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-ojas-vibrant-coral-hover active:scale-95 flex items-center justify-center gap-3">
            <Phone className="w-5 h-5" />
            Emergency: 911
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsHubPage;

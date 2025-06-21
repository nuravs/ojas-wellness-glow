
import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const CalendarPage: React.FC = () => {
  const upcomingAppointments = [
    {
      id: '1',
      title: 'Dr. Johnson - Neurology Follow-up',
      date: 'June 15, 2024',
      time: '10:30 AM',
      location: 'Neurology Center, Room 204',
      type: 'In-person'
    },
    {
      id: '2',
      title: 'Physical Therapy Session',
      date: 'June 18, 2024',
      time: '2:00 PM',
      location: 'Rehabilitation Center',
      type: 'In-person'
    },
    {
      id: '3',
      title: 'Telehealth Check-in',
      date: 'June 22, 2024',
      time: '11:00 AM',
      location: 'Video call',
      type: 'Virtual'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-calm-800 mb-2">
            Your Calendar
          </h1>
          <p className="text-calm-600 text-lg">
            Upcoming appointments and events
          </p>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-calm-800 mb-4">
            Upcoming Appointments
          </h2>
          <div className="space-y-4">
            {upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="ojas-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-wellness-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-wellness-blue" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-calm-800 mb-2">
                      {appointment.title}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-calm-600">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-calm-600">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-calm-600">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-calm-500" />
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          appointment.type === 'Virtual' 
                            ? 'bg-wellness-blue/10 text-wellness-blue' 
                            : 'bg-wellness-green/10 text-wellness-green'
                        }`}>
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="ojas-card">
          <h3 className="text-lg font-semibold text-calm-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full ojas-button-secondary text-left">
              Schedule New Appointment
            </button>
            <button className="w-full ojas-button-secondary text-left">
              View Past Appointments
            </button>
            <button className="w-full ojas-button-secondary text-left">
              Contact Care Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

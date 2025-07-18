
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { usePatientCaregivers } from '@/hooks/usePatientCaregivers';
import CaregiverInvitationModal from './CaregiverInvitationModal';
import { format } from 'date-fns';

const CaregiverDashboard: React.FC = () => {
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const { 
    approvedRelationships, 
    pendingRequestsFromCaregiver, 
    isLoading 
  } = usePatientCaregivers();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  const hasConnections = approvedRelationships.length > 0;

  return (
    <div className="space-y-6">
      {/* Main Connection Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-ojas-primary-blue" />
            Patient Connections
          </CardTitle>
          <CardDescription>
            Manage your connections with patients to provide care support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasConnections ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-ojas-slate-gray">Connected Patients</h4>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {approvedRelationships.length} Active
                </Badge>
              </div>
              {approvedRelationships.map((relationship) => (
                <div key={relationship.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-ojas-slate-gray">
                      {relationship.patient_profile?.full_name || 'Unknown Patient'}
                    </p>
                    <p className="text-sm text-ojas-slate-gray/70">
                      Connected since {format(new Date(relationship.approved_at!), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    <Users className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-ojas-slate-gray/40 mx-auto mb-4" />
              <h4 className="font-medium text-ojas-slate-gray mb-2">No Patient Connections</h4>
              <p className="text-sm text-ojas-slate-gray/70 mb-4">
                Connect with a patient to start providing care support through OJAS
              </p>
            </div>
          )}

          <Button 
            onClick={() => setShowInvitationModal(true)}
            className="w-full bg-ojas-primary-blue hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect with New Patient
          </Button>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequestsFromCaregiver.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Pending Invitations
            </CardTitle>
            <CardDescription>
              Invitations waiting for patient approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequestsFromCaregiver.map((request) => (
                <div key={request.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-medium text-ojas-slate-gray">
                      {request.patient_profile?.full_name || 'Unknown Patient'}
                    </p>
                    <p className="text-sm text-ojas-slate-gray/70">
                      Invited on {format(new Date(request.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Pending
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <CaregiverInvitationModal
        isOpen={showInvitationModal}
        onClose={() => setShowInvitationModal(false)}
      />
    </div>
  );
};

export default CaregiverDashboard;

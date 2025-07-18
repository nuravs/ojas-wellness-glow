
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Check, X, User } from 'lucide-react';
import { usePatientCaregivers, PatientCaregiverRelationship } from '@/hooks/usePatientCaregivers';
import { format } from 'date-fns';

interface PatientApprovalCardProps {
  request: PatientCaregiverRelationship;
}

const PatientApprovalCard: React.FC<PatientApprovalCardProps> = ({ request }) => {
  const { updateRelationshipStatus } = usePatientCaregivers();

  const handleApprove = () => {
    updateRelationshipStatus.mutate({
      relationshipId: request.id,
      status: 'approved'
    });
  };

  const handleDecline = () => {
    updateRelationshipStatus.mutate({
      relationshipId: request.id,
      status: 'rejected'
    });
  };

  const isUpdating = updateRelationshipStatus.isPending;

  return (
    <Card className="border-ojas-primary-blue/20 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-ojas-primary-blue" />
            Caregiver Request
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        </CardTitle>
        <CardDescription>
          A caregiver has requested to access your health information
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
          <div className="w-10 h-10 bg-ojas-primary-blue/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-ojas-primary-blue" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-ojas-slate-gray">
              {request.caregiver_profile?.full_name || 'Unknown Caregiver'}
            </p>
            <p className="text-sm text-ojas-slate-gray/70">
              Requested on {format(new Date(request.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-ojas-slate-gray">
            <strong>What this means:</strong> If you approve this request, this caregiver will be able to view your medications, symptoms, vitals, and other health data in OJAS. You can revoke this access at any time in your settings.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleDecline}
            variant="outline"
            disabled={isUpdating}
            className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isUpdating}
            className="flex-1 bg-ojas-primary-blue hover:bg-blue-600"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Approve
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientApprovalCard;

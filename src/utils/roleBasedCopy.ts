
interface RoleBasedCopy {
  patient: string;
  caregiver: string;
}

interface CopyConfig {
  homeGreeting: RoleBasedCopy;
  homeSubtitle: RoleBasedCopy;
  medicationMarkTaken: RoleBasedCopy;
  medicationPostpone: RoleBasedCopy;
  symptomPrompt: RoleBasedCopy;
  wellnessPrompt: RoleBasedCopy;
  dashboardTitle: RoleBasedCopy;
  wellnessRingTooltip: RoleBasedCopy;
  todaysActionTitle: RoleBasedCopy;
  todaysActions: RoleBasedCopy;
  allTasksComplete: RoleBasedCopy;
  nextMedication: RoleBasedCopy;
  nextWellness: RoleBasedCopy;
  lastSymptom: RoleBasedCopy;
}

export const roleBasedCopy: CopyConfig = {
  homeGreeting: {
    patient: "Good morning, Sarah",
    caregiver: "Good morning, Caregiver"
  },
  homeSubtitle: {
    patient: "Let's see how you're doing today",
    caregiver: "Let's check on your patient's progress"
  },
  medicationMarkTaken: {
    patient: "Mark as Taken",
    caregiver: "Mark as Taken for Jane"
  },
  medicationPostpone: {
    patient: "Postpone",
    caregiver: "Postpone for Jane"
  },
  symptomPrompt: {
    patient: "How are you feeling?",
    caregiver: "How is Jane feeling today?"
  },
  wellnessPrompt: {
    patient: "Your wellness summary",
    caregiver: "Jane's wellness summary"
  },
  dashboardTitle: {
    patient: "Your Medications",
    caregiver: "Jane's Medications"
  },
  wellnessRingTooltip: {
    patient: "Your health score details",
    caregiver: "Jane's health score details"
  },
  todaysActionTitle: {
    patient: "Today's Action Summary",
    caregiver: "Today's Summary for Jane"
  },
  todaysActions: {
    patient: "Today's Actions",
    caregiver: "Jane's Today's Actions"
  },
  allTasksComplete: {
    patient: "You've completed all your tasks for today!",
    caregiver: "Jane has completed all tasks for today!"
  },
  nextMedication: {
    patient: "Next Med:",
    caregiver: "Jane's Next Med:"
  },
  nextWellness: {
    patient: "Next Wellness:",
    caregiver: "Jane's Wellness:"
  },
  lastSymptom: {
    patient: "Last Symptom:",
    caregiver: "Jane's Last Symptom:"
  }
};

export const getCopyForRole = (key: keyof CopyConfig, role: 'patient' | 'caregiver'): string => {
  return roleBasedCopy[key][role];
};

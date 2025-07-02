
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
  }
};

export const getCopyForRole = (key: keyof CopyConfig, role: 'patient' | 'caregiver'): string => {
  return roleBasedCopy[key][role];
};


// Check if medication is overdue (missed)
export const isOverdue = (medicationTime: string): boolean => {
  const medTime = new Date();
  const [hours, minutes] = medicationTime.split(/[:\s]/);
  const isPM = medicationTime.toLowerCase().includes('pm');
  const hour24 = isPM && parseInt(hours) !== 12 ? parseInt(hours) + 12 : 
                !isPM && parseInt(hours) === 12 ? 0 : parseInt(hours);
  
  medTime.setHours(hour24, parseInt(minutes) || 0, 0, 0);
  
  return medTime < new Date();
};

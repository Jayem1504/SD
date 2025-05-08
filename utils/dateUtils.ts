/**
 * Utility functions for date operations
 */

/**
 * Format a date to display as a string (e.g., "Jan 1, 2023")
 */
export const formatDate = (date: Date | null): string => {
  if (!date) return 'No due date';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a date to display time (e.g., "3:30 PM")
 */
export const formatTime = (date: Date | null): string => {
  if (!date) return '';
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date | null): boolean => {
  if (!date) return false;
  
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date | null): boolean => {
  if (!date) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
};

/**
 * Check if a date is in the next N days
 */
export const isNextNDays = (date: Date | null, days: number): boolean => {
  if (!date) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);
  
  return date >= today && date <= futureDate;
};

/**
 * Get a relative date string (e.g., "Today", "Tomorrow", "In 3 days", "2 days ago")
 */
export const getRelativeDateString = (date: Date | null): string => {
  if (!date) return 'No due date';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const dateWithoutTime = new Date(date);
  dateWithoutTime.setHours(0, 0, 0, 0);
  
  const diffTime = dateWithoutTime.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;
  
  return formatDate(date);
};
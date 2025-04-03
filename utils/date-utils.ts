import { WeekDay } from '@/types/habit';

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayFormatted = (): string => {
  return formatDate(new Date());
};

export const getDaysBetweenDates = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getLastNDays = (n: number): string[] => {
  const result: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < n; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    result.push(formatDate(date));
  }
  
  return result;
};

export const getCurrentWeekDay = (): WeekDay => {
  const days: WeekDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = new Date();
  return days[today.getDay()];
};

export const shouldCompleteHabitToday = (weekDays?: WeekDay[]): boolean => {
  if (!weekDays || weekDays.length === 0) return true;
  return weekDays.includes(getCurrentWeekDay());
};

export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export const getStreakCount = (logs: { date: string; completed: boolean }[]): number => {
  if (logs.length === 0) return 0;
  
  // Sort logs by date (newest first)
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = getTodayFormatted();
  let currentDate = new Date(today);
  
  // Check if the most recent log is from today and is completed
  const mostRecentLog = sortedLogs.find(log => log.date === today);
  if (mostRecentLog && mostRecentLog.completed) {
    streak = 1;
  } else if (!mostRecentLog) {
    // If no log for today, start checking from yesterday
    currentDate.setDate(currentDate.getDate() - 1);
  } else {
    // If today's log exists but is not completed, streak is 0
    return 0;
  }
  
  // Continue checking previous days
  let checkDate = formatDate(currentDate);
  let consecutiveDays = streak;
  
  for (let i = 0; i < sortedLogs.length; i++) {
    const log = sortedLogs.find(l => l.date === checkDate);
    
    if (log && log.completed) {
      consecutiveDays++;
      // Move to the previous day
      currentDate.setDate(currentDate.getDate() - 1);
      checkDate = formatDate(currentDate);
    } else {
      break;
    }
  }
  
  return consecutiveDays;
};
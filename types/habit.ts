export type Frequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  frequency: Frequency;
  weekDays?: WeekDay[];
  createdAt: string;
  color?: string;
  icon?: string;
  reminder?: string;
  archived?: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface HabitWithProgress extends Habit {
  streak: number;
  completedToday: boolean;
  completionRate: number;
}
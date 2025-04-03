import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitLog, Category, HabitWithProgress } from '@/types/habit';
import { getTodayFormatted, getStreakCount, shouldCompleteHabitToday } from '@/utils/date-utils';
import { categoryColors } from '@/constants/colors';

interface HabitState {
  habits: Habit[];
  habitLogs: HabitLog[];
  categories: Category[];
  
  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  archiveHabit: (id: string) => void;
  
  // Log actions
  toggleHabitCompletion: (habitId: string, date?: string) => void;
  addHabitLog: (log: Omit<HabitLog, 'id'>) => void;
  updateHabitLog: (id: string, updates: Partial<HabitLog>) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Getters
  getHabitsWithProgress: () => HabitWithProgress[];
  getHabitsByCategory: (categoryId: string) => Habit[];
  getActiveHabits: () => Habit[];
  getArchivedHabits: () => Habit[];
  getHabitLogsForDate: (date: string) => HabitLog[];
  getHabitLogsForHabit: (habitId: string) => HabitLog[];
  getHabitById: (id: string) => Habit | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getCompletionRate: (habitId: string, days?: number) => number;
  getStreak: (habitId: string) => number;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      habitLogs: [],
      categories: [
        { id: 'default', name: 'General', color: categoryColors[0] },
        { id: 'health', name: 'Health', color: categoryColors[1] },
        { id: 'productivity', name: 'Productivity', color: categoryColors[2] },
        { id: 'personal', name: 'Personal', color: categoryColors[3] },
      ],
      
      // Habit actions
      addHabit: (habit) => {
        const newHabit: Habit = {
          ...habit,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          color: habit.color || categoryColors[Math.floor(Math.random() * categoryColors.length)],
        };
        
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },
      
      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) => 
            habit.id === id ? { ...habit, ...updates } : habit
          ),
        }));
      },
      
      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
          habitLogs: state.habitLogs.filter((log) => log.habitId !== id),
        }));
      },
      
      archiveHabit: (id) => {
        set((state) => ({
          habits: state.habits.map((habit) => 
            habit.id === id ? { ...habit, archived: true } : habit
          ),
        }));
      },
      
      // Log actions
      toggleHabitCompletion: (habitId, date) => {
        const today = date || getTodayFormatted();
        const existingLog = get().habitLogs.find(
          (log) => log.habitId === habitId && log.date === today
        );
        
        if (existingLog) {
          // Toggle existing log
          set((state) => ({
            habitLogs: state.habitLogs.map((log) =>
              log.id === existingLog.id
                ? { ...log, completed: !log.completed }
                : log
            ),
          }));
        } else {
          // Create new log
          const newLog: HabitLog = {
            id: Date.now().toString(),
            habitId,
            date: today,
            completed: true,
          };
          
          set((state) => ({
            habitLogs: [...state.habitLogs, newLog],
          }));
        }
      },
      
      addHabitLog: (log) => {
        const newLog: HabitLog = {
          ...log,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          habitLogs: [...state.habitLogs, newLog],
        }));
      },
      
      updateHabitLog: (id, updates) => {
        set((state) => ({
          habitLogs: state.habitLogs.map((log) => 
            log.id === id ? { ...log, ...updates } : log
          ),
        }));
      },
      
      // Category actions
      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) => 
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },
      
      deleteCategory: (id) => {
        // Update habits with this category to have no category
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          habits: state.habits.map((habit) => 
            habit.categoryId === id ? { ...habit, categoryId: undefined } : habit
          ),
        }));
      },
      
      // Getters
      getHabitsWithProgress: () => {
        const { habits, habitLogs } = get();
        const today = getTodayFormatted();
        
        return habits.map((habit) => {
          const habitLogsByDate = habitLogs.filter((log) => log.habitId === habit.id);
          const todayLog = habitLogsByDate.find((log) => log.date === today);
          const streak = getStreakCount(habitLogsByDate);
          
          // Calculate completion rate (last 30 days)
          const completionRate = get().getCompletionRate(habit.id, 30);
          
          return {
            ...habit,
            streak,
            completedToday: !!todayLog?.completed,
            completionRate,
          };
        });
      },
      
      getHabitsByCategory: (categoryId) => {
        return get().habits.filter((habit) => habit.categoryId === categoryId && !habit.archived);
      },
      
      getActiveHabits: () => {
        return get().habits.filter((habit) => !habit.archived);
      },
      
      getArchivedHabits: () => {
        return get().habits.filter((habit) => habit.archived);
      },
      
      getHabitLogsForDate: (date) => {
        return get().habitLogs.filter((log) => log.date === date);
      },
      
      getHabitLogsForHabit: (habitId) => {
        return get().habitLogs.filter((log) => log.habitId === habitId);
      },
      
      getHabitById: (id) => {
        return get().habits.find((habit) => habit.id === id);
      },
      
      getCategoryById: (id) => {
        return get().categories.find((category) => category.id === id);
      },
      
      getCompletionRate: (habitId, days = 7) => {
        const { habitLogs } = get();
        const habit = get().getHabitById(habitId);
        if (!habit) return 0;
        
        const today = new Date();
        const logs: { date: string; completed: boolean }[] = [];
        
        // Create array of dates to check
        for (let i = 0; i < days; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          // Only count days where the habit should be completed based on frequency
          if (shouldCompleteHabitToday(habit.weekDays)) {
            const log = habitLogs.find(
              (l) => l.habitId === habitId && l.date === dateStr
            );
            
            logs.push({
              date: dateStr,
              completed: !!log?.completed,
            });
          }
        }
        
        if (logs.length === 0) return 0;
        
        const completedCount = logs.filter((log) => log.completed).length;
        return (completedCount / logs.length) * 100;
      },
      
      getStreak: (habitId) => {
        const logs = get().getHabitLogsForHabit(habitId);
        return getStreakCount(logs);
      },
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
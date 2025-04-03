import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useHabitStore } from '@/store/habit-store';
import { ProgressChart } from '@/components/ProgressChart';
import { getLastNDays, formatDateForDisplay } from '@/utils/date-utils';

export default function StatsScreen() {
  const { getHabitsWithProgress, getHabitLogsForDate } = useHabitStore();
  const [timeRange, setTimeRange] = useState(7); // days
  
  const habitsWithProgress = getHabitsWithProgress().filter(habit => !habit.archived);
  
  // Get completion data for the last N days
  const lastNDays = getLastNDays(timeRange);
  const completionData = lastNDays.map(date => {
    const logs = getHabitLogsForDate(date);
    if (logs.length === 0) return 0;
    
    const completedCount = logs.filter(log => log.completed).length;
    return (completedCount / logs.length) * 100;
  }).reverse();
  
  // Create labels for the chart (e.g., "Mon", "Tue", etc.)
  const chartLabels = lastNDays.map(date => {
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    return day.substring(0, 1);
  }).reverse();
  
  // Calculate overall stats
  const totalHabits = habitsWithProgress.length;
  const completedToday = habitsWithProgress.filter(habit => habit.completedToday).length;
  const completionRate = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
  
  // Find the habit with the longest streak
  const longestStreakHabit = habitsWithProgress.reduce(
    (longest, current) => (current.streak > longest.streak ? current : longest),
    { name: 'None', streak: 0 }
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Your Progress</Text>
        
        <View style={styles.statsCards}>
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <BarChart3 size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{Math.round(completionRate)}%</Text>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
              <Calendar size={20} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>{completedToday}/{totalHabits}</Text>
            <Text style={styles.statLabel}>Today's Habits</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
              <TrendingUp size={20} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{longestStreakHabit.streak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
        </View>
        
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Last {timeRange} Days</Text>
          <ProgressChart data={completionData} labels={chartLabels} height={180} />
        </View>
        
        <View style={styles.habitsContainer}>
          <Text style={styles.sectionTitle}>Habits Overview</Text>
          
          {habitsWithProgress.map((habit) => (
            <View key={habit.id} style={styles.habitRow}>
              <View style={styles.habitInfo}>
                <View 
                  style={[
                    styles.habitColorDot, 
                    { backgroundColor: habit.color || colors.primary }
                  ]} 
                />
                <Text style={styles.habitName} numberOfLines={1}>
                  {habit.name}
                </Text>
              </View>
              
              <View style={styles.habitStats}>
                <Text style={styles.habitStreak}>
                  {habit.streak} day streak
                </Text>
                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${Math.min(100, habit.completionRate)}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  habitsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  habitStats: {
    alignItems: 'flex-end',
    flex: 1,
  },
  habitStreak: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  progressContainer: {
    width: 100,
    height: 4,
    backgroundColor: colors.grayDark,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
});
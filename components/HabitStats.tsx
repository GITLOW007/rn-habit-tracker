import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar, Flame, BarChart3 } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface HabitStatsProps {
  streak: number;
  completionRate: number;
  totalCompletions: number;
}

export const HabitStats = ({ 
  streak, 
  completionRate, 
  totalCompletions 
}: HabitStatsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
          <Flame size={20} color={colors.warning} />
        </View>
        <Text style={styles.statValue}>{streak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
      
      <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <BarChart3 size={20} color={colors.primary} />
        </View>
        <Text style={styles.statValue}>{Math.round(completionRate)}%</Text>
        <Text style={styles.statLabel}>Completion</Text>
      </View>
      
      <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
          <Calendar size={20} color={colors.secondary} />
        </View>
        <Text style={styles.statValue}>{totalCompletions}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
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
  },
});
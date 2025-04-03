import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, ChevronRight, Flame } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { HabitWithProgress } from '@/types/habit';
import { useHabitStore } from '@/store/habit-store';

interface HabitCardProps {
  habit: HabitWithProgress;
}

export const HabitCard = ({ habit }: HabitCardProps) => {
  const router = useRouter();
  const toggleHabitCompletion = useHabitStore((state) => state.toggleHabitCompletion);
  const categories = useHabitStore((state) => state.categories);
  
  const category = categories.find((cat) => cat.id === habit.categoryId);
  
  const handlePress = () => {
    router.push(`/habit/${habit.id}`);
  };
  
  const handleToggleCompletion = () => {
    toggleHabitCompletion(habit.id);
  };
  
  return (
    <Pressable
      style={[styles.container, { borderLeftColor: habit.color || colors.primary }]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {habit.name}
          </Text>
          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
              <Text style={[styles.categoryText, { color: category.color }]}>
                {category.name}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.stats}>
          {habit.streak > 0 && (
            <View style={styles.streakContainer}>
              <Flame size={14} color={colors.warning} />
              <Text style={styles.streakText}>{habit.streak} day streak</Text>
            </View>
          )}
          
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
      
      <View style={styles.actions}>
        <Pressable
          style={[
            styles.checkButton,
            habit.completedToday && styles.checkButtonActive,
          ]}
          onPress={handleToggleCompletion}
        >
          {habit.completedToday ? (
            <Check size={20} color={colors.white} />
          ) : (
            <View style={styles.emptyCheck} />
          )}
        </Pressable>
        
        <ChevronRight size={20} color={colors.textTertiary} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  stats: {
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  progressContainer: {
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
  actions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.grayDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkButtonActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  emptyCheck: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.grayDark,
  },
});
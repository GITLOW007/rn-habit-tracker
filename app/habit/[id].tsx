import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  Edit2, 
  Trash2, 
  Archive, 
  Check, 
  Calendar, 
  Clock, 
  Tag,
  MoreVertical
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useHabitStore } from '@/store/habit-store';
import { HabitStats } from '@/components/HabitStats';
import { ProgressChart } from '@/components/ProgressChart';
import { HabitForm } from '@/components/HabitForm';
import { getLastNDays, formatDateForDisplay } from '@/utils/date-utils';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const { 
    getHabitById, 
    getCategoryById, 
    getHabitLogsForHabit, 
    toggleHabitCompletion, 
    deleteHabit, 
    archiveHabit,
    getStreak,
    getCompletionRate
  } = useHabitStore();
  
  const habit = getHabitById(id);
  
  if (!habit) {
    return (
      <View style={styles.container}>
        <Text>Habit not found</Text>
      </View>
    );
  }
  
  const category = habit.categoryId ? getCategoryById(habit.categoryId) : null;
  const habitLogs = getHabitLogsForHabit(habit.id);
  
  // Get completion data for the last 7 days
  const lastSevenDays = getLastNDays(7);
  const completionData = lastSevenDays.map(date => {
    const log = habitLogs.find(l => l.date === date);
    return log?.completed ? 100 : 0;
  }).reverse();
  
  // Create labels for the chart (e.g., "Mon", "Tue", etc.)
  const chartLabels = lastSevenDays.map(date => {
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    return day.substring(0, 1);
  }).reverse();
  
  const streak = getStreak(habit.id);
  const completionRate = getCompletionRate(habit.id, 30);
  const totalCompletions = habitLogs.filter(log => log.completed).length;
  
  const handleToggleCompletion = () => {
    toggleHabitCompletion(habit.id);
  };
  
  const handleEdit = () => {
    setShowForm(true);
    setShowMenu(false);
  };
  
  const handleArchive = () => {
    Alert.alert(
      "Archive Habit",
      "Are you sure you want to archive this habit? It will be hidden from your active habits.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Archive", 
          onPress: () => {
            archiveHabit(habit.id);
            router.back();
          }
        }
      ]
    );
    setShowMenu(false);
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteHabit(habit.id);
            router.back();
          }
        }
      ]
    );
    setShowMenu(false);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: habit.name,
          headerRight: () => (
            <View style={styles.headerRight}>
              <Pressable 
                style={styles.headerButton} 
                onPress={() => setShowMenu(!showMenu)}
              >
                <MoreVertical size={24} color={colors.text} />
              </Pressable>
            </View>
          ),
        }} 
      />
      
      {showMenu && (
        <View style={styles.menu}>
          <Pressable style={styles.menuItem} onPress={handleEdit}>
            <Edit2 size={20} color={colors.text} />
            <Text style={styles.menuItemText}>Edit</Text>
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={handleArchive}>
            <Archive size={20} color={colors.text} />
            <Text style={styles.menuItemText}>Archive</Text>
          </Pressable>
          
          <Pressable style={[styles.menuItem, styles.menuItemDanger]} onPress={handleDelete}>
            <Trash2 size={20} color={colors.error} />
            <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Delete</Text>
          </Pressable>
        </View>
      )}
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: habit.color + '20' }]}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{habit.name}</Text>
            {habit.description && (
              <Text style={styles.description}>{habit.description}</Text>
            )}
            
            <View style={styles.metaContainer}>
              {category && (
                <View style={styles.metaItem}>
                  <Tag size={16} color={category.color} />
                  <Text style={[styles.metaText, { color: category.color }]}>
                    {category.name}
                  </Text>
                </View>
              )}
              
              <View style={styles.metaItem}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>
                  Started {formatDateForDisplay(habit.createdAt)}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>
                  {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          
          <Pressable
            style={[
              styles.checkButton,
              habitLogs.some(log => log.date === getLastNDays(1)[0] && log.completed) && 
                styles.checkButtonActive,
            ]}
            onPress={handleToggleCompletion}
          >
            {habitLogs.some(log => log.date === getLastNDays(1)[0] && log.completed) ? (
              <Check size={24} color={colors.white} />
            ) : (
              <View style={styles.emptyCheck} />
            )}
          </Pressable>
        </View>
        
        <HabitStats 
          streak={streak} 
          completionRate={completionRate} 
          totalCompletions={totalCompletions} 
        />
        
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Last 7 Days</Text>
          <ProgressChart data={completionData} labels={chartLabels} height={180} />
        </View>
        
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {habitLogs.slice(0, 10).map((log) => (
            <View key={log.id} style={styles.historyItem}>
              <View 
                style={[
                  styles.historyDot, 
                  { backgroundColor: log.completed ? colors.success : colors.grayDark }
                ]} 
              />
              <Text style={styles.historyDate}>
                {formatDateForDisplay(log.date)}
              </Text>
              <Text style={styles.historyStatus}>
                {log.completed ? 'Completed' : 'Missed'}
              </Text>
            </View>
          ))}
          
          {habitLogs.length === 0 && (
            <Text style={styles.emptyText}>No activity recorded yet.</Text>
          )}
        </View>
      </ScrollView>
      
      {showForm && (
        <View style={styles.formContainer}>
          <HabitForm habitId={habit.id} onClose={() => setShowForm(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
    width: 160,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  menuItemTextDanger: {
    color: colors.error,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  checkButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.grayDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  checkButtonActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  emptyCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.grayDark,
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
  historyContainer: {
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
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  historyDate: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  historyStatus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 16,
  },
  formContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    zIndex: 10,
  },
});
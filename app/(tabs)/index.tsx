import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, ListChecks } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useHabitStore } from '@/store/habit-store';
import { HabitCard } from '@/components/HabitCard';
import { CategoryPill } from '@/components/CategoryPill';
import { EmptyState } from '@/components/EmptyState';
import { HabitForm } from '@/components/HabitForm';
import { getTodayFormatted, formatDateForDisplay } from '@/utils/date-utils';

export default function HomeScreen() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const { getHabitsWithProgress, categories } = useHabitStore();
  
  const habitsWithProgress = getHabitsWithProgress().filter(
    (habit) => !habit.archived && (!selectedCategoryId || habit.categoryId === selectedCategoryId)
  );
  
  const handleAddHabit = () => {
    setShowForm(true);
  };
  
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategoryId(selectedCategoryId === categoryId ? null : categoryId);
  };
  
  const today = getTodayFormatted();
  const formattedDate = formatDateForDisplay(today);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.title}>My Habits</Text>
        </View>
        
        <Pressable style={styles.addButton} onPress={handleAddHabit}>
          <Plus size={24} color={colors.white} />
        </Pressable>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <CategoryPill
          name="All"
          color={colors.primary}
          isSelected={selectedCategoryId === null}
          onPress={() => setSelectedCategoryId(null)}
        />
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            name={category.name}
            color={category.color}
            isSelected={selectedCategoryId === category.id}
            onPress={() => handleCategoryPress(category.id)}
          />
        ))}
      </ScrollView>
      
      {habitsWithProgress.length > 0 ? (
        <FlatList
          data={habitsWithProgress}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HabitCard habit={item} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          title="No habits yet"
          description="Start tracking your habits by adding your first one."
          actionLabel="Add Habit"
          onAction={handleAddHabit}
          icon={<ListChecks size={40} color={colors.primary} />}
        />
      )}
      
      {showForm && (
        <View style={styles.formContainer}>
          <HabitForm onClose={() => setShowForm(false)} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  formContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    zIndex: 10,
  },
});
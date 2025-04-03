import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { colors, categoryColors } from '@/constants/colors';
import { Habit, WeekDay, Frequency } from '@/types/habit';
import { useHabitStore } from '@/store/habit-store';

interface HabitFormProps {
  habitId?: string;
  onClose: () => void;
}

const WEEKDAYS: { key: WeekDay; label: string }[] = [
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'S' },
];

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

export const HabitForm = ({ habitId, onClose }: HabitFormProps) => {
  const router = useRouter();
  const { addHabit, updateHabit, getHabitById, categories } = useHabitStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [color, setColor] = useState(categoryColors[0]);
  
  useEffect(() => {
    if (habitId) {
      const habit = getHabitById(habitId);
      if (habit) {
        setName(habit.name);
        setDescription(habit.description || '');
        setCategoryId(habit.categoryId);
        setFrequency(habit.frequency);
        setWeekDays(habit.weekDays || []);
        setColor(habit.color || categoryColors[0]);
      }
    }
  }, [habitId, getHabitById]);
  
  const handleSave = () => {
    if (!name.trim()) {
      // Show error
      return;
    }
    
    const habitData = {
      name,
      description,
      categoryId,
      frequency,
      weekDays: frequency === 'custom' ? weekDays : undefined,
      color,
    };
    
    if (habitId) {
      updateHabit(habitId, habitData);
    } else {
      addHabit(habitData);
    }
    
    onClose();
    router.push('/');
  };
  
  const toggleWeekDay = (day: WeekDay) => {
    if (weekDays.includes(day)) {
      setWeekDays(weekDays.filter((d) => d !== day));
    } else {
      setWeekDays([...weekDays, day]);
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{habitId ? 'Edit Habit' : 'New Habit'}</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={24} color={colors.text} />
        </Pressable>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Drink water"
          placeholderTextColor={colors.textTertiary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add details about your habit"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: categoryId === category.id ? category.color : colors.gray,
                },
              ]}
              onPress={() => setCategoryId(category.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color: categoryId === category.id ? colors.white : colors.text,
                  },
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.frequencyContainer}>
          {FREQUENCIES.map((item) => (
            <Pressable
              key={item.value}
              style={[
                styles.frequencyChip,
                frequency === item.value && styles.frequencyChipActive,
              ]}
              onPress={() => setFrequency(item.value)}
            >
              <Text
                style={[
                  styles.frequencyChipText,
                  frequency === item.value && styles.frequencyChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      
      {frequency === 'custom' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Days of the week</Text>
          <View style={styles.weekDaysContainer}>
            {WEEKDAYS.map((day) => (
              <Pressable
                key={day.key}
                style={[
                  styles.weekDayChip,
                  weekDays.includes(day.key) && styles.weekDayChipActive,
                ]}
                onPress={() => toggleWeekDay(day.key)}
              >
                <Text
                  style={[
                    styles.weekDayChipText,
                    weekDays.includes(day.key) && styles.weekDayChipTextActive,
                  ]}
                >
                  {day.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorsContainer}>
          {categoryColors.map((colorOption) => (
            <Pressable
              key={colorOption}
              style={[
                styles.colorCircle,
                { backgroundColor: colorOption },
                color === colorOption && styles.colorCircleSelected,
              ]}
              onPress={() => setColor(colorOption)}
            >
              {color === colorOption && <Check size={16} color={colors.white} />}
            </Pressable>
          ))}
        </View>
      </View>
      
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Habit</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.gray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  frequencyChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.gray,
    marginRight: 8,
    marginBottom: 8,
  },
  frequencyChipActive: {
    backgroundColor: colors.primary,
  },
  frequencyChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  frequencyChipTextActive: {
    color: colors.white,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDayChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDayChipActive: {
    backgroundColor: colors.primary,
  },
  weekDayChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  weekDayChipTextActive: {
    color: colors.white,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleSelected: {
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
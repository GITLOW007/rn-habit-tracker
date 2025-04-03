import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Bell, 
  Palette, 
  Trash2, 
  Archive, 
  HelpCircle, 
  ChevronRight,
  Plus
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useHabitStore } from '@/store/habit-store';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { categories, addCategory, getArchivedHabits } = useHabitStore();
  
  const archivedHabits = getArchivedHabits();
  
  const handleAddCategory = () => {
    // In a real app, you'd show a form to add a category
    Alert.alert(
      "Add Category",
      "This would open a form to add a new category.",
      [{ text: "OK" }]
    );
  };
  
  const handleViewArchived = () => {
    if (archivedHabits.length === 0) {
      Alert.alert(
        "No Archived Habits",
        "You don't have any archived habits.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // In a real app, you'd navigate to an archived habits screen
    Alert.alert(
      "Archived Habits",
      `You have ${archivedHabits.length} archived habits.`,
      [{ text: "OK" }]
    );
  };
  
  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your habits and progress. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear Data", 
          style: "destructive",
          onPress: () => {
            // In a real app, you'd clear all data
            Alert.alert("Data Cleared", "All data has been cleared.");
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.grayDark, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <Pressable style={styles.addButton} onPress={handleAddCategory}>
              <Plus size={16} color={colors.white} />
            </Pressable>
          </View>
          
          {categories.map((category) => (
            <View key={category.id} style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View 
                  style={[
                    styles.colorDot, 
                    { backgroundColor: category.color }
                  ]} 
                />
                <Text style={styles.settingLabel}>{category.name}</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <Pressable style={styles.settingItem} onPress={handleViewArchived}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors.textSecondary + '20' }]}>
                <Archive size={20} color={colors.textSecondary} />
              </View>
              <Text style={styles.settingLabel}>Archived Habits</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
          
          <Pressable style={styles.settingItem} onPress={handleClearData}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
                <Trash2 size={20} color={colors.error} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                Clear All Data
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
                <HelpCircle size={20} color={colors.secondary} />
              </View>
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <User size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </View>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    marginBottom: 24,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  versionText: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: 20,
  },
});
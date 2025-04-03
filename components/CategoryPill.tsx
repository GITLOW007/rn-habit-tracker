import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { colors } from '@/constants/colors';

interface CategoryPillProps {
  name: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryPill = ({ 
  name, 
  color, 
  isSelected, 
  onPress 
}: CategoryPillProps) => {
  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? color : colors.gray,
          borderColor: color,
          borderWidth: isSelected ? 0 : 1,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          {
            color: isSelected ? colors.white : color,
          },
        ]}
      >
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
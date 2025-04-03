import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';

interface ProgressChartProps {
  data: number[];
  labels?: string[];
  height?: number;
}

export const ProgressChart = ({ 
  data, 
  labels = [], 
  height = 150 
}: ProgressChartProps) => {
  const maxValue = Math.max(...data, 1);
  
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.chart}>
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * 100;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${Math.max(barHeight, 5)}%`,
                      backgroundColor: value > 0 ? colors.primary : colors.grayDark,
                    }
                  ]} 
                />
              </View>
              {labels[index] && (
                <Text style={styles.label}>{labels[index]}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 16,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    width: 20,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
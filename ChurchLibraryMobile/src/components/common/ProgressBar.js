import React from 'react';
import { View, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme';

function ProgressBar({ progress, color }) {
  const { theme } = useTheme();
  const progressBarColor = color || theme.colors.primary.main;

  return (
    <View style={[styles.progressBarBackground, { backgroundColor: theme.colors.surface.secondary }]}>
      <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: progressBarColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    flex: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ProgressBar;

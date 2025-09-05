import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DuhaldeColors, DuhaldeFonts, DuhaldeSpacing } from '../styles/DuhaldeStyles';

interface DuhaldeHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export const DuhaldeHeader: React.FC<DuhaldeHeaderProps> = ({
  title,
  subtitle,
  showLogo = true,
}) => {
  return (
    <View style={styles.container}>
      {showLogo && (
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>🏗️ DUHALDE</Text>
          <Text style={styles.logoSubtext}>TracaBeton Industrial</Text>
        </View>
      )}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DuhaldeColors.primary.orange,
    paddingTop: DuhaldeSpacing.lg,
    paddingBottom: DuhaldeSpacing.xl,
    paddingHorizontal: DuhaldeSpacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: DuhaldeSpacing.md,
  },
  logoText: {
    fontSize: DuhaldeFonts.size.xl,
    fontWeight: DuhaldeFonts.weight.bold,
    color: DuhaldeColors.text.white,
  },
  logoSubtext: {
    fontSize: DuhaldeFonts.size.sm,
    color: DuhaldeColors.text.white,
    opacity: 0.9,
  },
  titleSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: DuhaldeFonts.size.xxl,
    fontWeight: DuhaldeFonts.weight.bold,
    color: DuhaldeColors.text.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: DuhaldeFonts.size.large,
    color: DuhaldeColors.text.white,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: DuhaldeSpacing.xs,
  },
});
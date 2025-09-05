/**
 * Duhalde Industries - Design System
 * Styles centralisés pour l'application DuhaldeTracaBeton
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Couleurs officielles Duhalde
export const DuhaldeColors = {
  primary: {
    orange: '#FF6B00',
    orangeLight: '#FF6B0020',
    orangeDark: '#E55A00',
  },
  secondary: {
    gray: '#6B7280',
    grayLight: '#F3F4F6',
    grayDark: '#374151',
  },
  background: {
    main: '#F8FAFC',
    card: '#FFFFFF',
    section: '#F1F5F9',
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    tertiary: '#6B7280',
    muted: '#9CA3AF',
    white: '#FFFFFF',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#3B82F6',
  },
};

// Typographie Duhalde
export const DuhaldeFonts = {
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    large: 18,
    xl: 20,
    xxl: 24,
    huge: 32,
  },
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
};

// Espacements industriels
export const DuhaldeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  huge: 32,
  card: {
    padding: 20,
    margin: 16,
  },
};

// Dimensions industrielles (touch targets optimisés)
export const DuhaldeDimensions = {
  touchTarget: {
    default: 56,
    large: 64,
  },
  button: {
    minHeight: 56,
    borderRadius: 12,
  },
  borderRadius: {
    small: 6,
    medium: 12,
    large: 16,
  },
  screen: {
    width: screenWidth,
    height: screenHeight,
  },
};

// Styles communs réutilisables
export const DuhaldeCommonStyles = StyleSheet.create({
  // Conteneurs
  screenContainer: {
    flex: 1,
    backgroundColor: DuhaldeColors.background.main,
  },
  scrollContent: {
    flexGrow: 1,
    padding: DuhaldeSpacing.lg,
  },
  card: {
    backgroundColor: DuhaldeColors.background.card,
    borderRadius: DuhaldeDimensions.borderRadius.medium,
    padding: DuhaldeSpacing.card.padding,
    marginBottom: DuhaldeSpacing.card.margin,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Textes
  titleText: {
    fontSize: DuhaldeFonts.size.xxl,
    fontWeight: DuhaldeFonts.weight.bold,
    color: DuhaldeColors.text.primary,
  },
  subtitleText: {
    fontSize: DuhaldeFonts.size.xl,
    fontWeight: DuhaldeFonts.weight.medium,
    color: DuhaldeColors.text.secondary,
  },
  bodyText: {
    fontSize: DuhaldeFonts.size.large,
    color: DuhaldeColors.text.primary,
  },
  
  // Boutons
  primaryButton: {
    backgroundColor: DuhaldeColors.primary.orange,
    paddingVertical: DuhaldeSpacing.lg,
    paddingHorizontal: DuhaldeSpacing.xl,
    borderRadius: DuhaldeDimensions.button.borderRadius,
    minHeight: DuhaldeDimensions.button.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: DuhaldeColors.text.white,
    fontSize: DuhaldeFonts.size.large,
    fontWeight: DuhaldeFonts.weight.bold,
  },
  secondaryButton: {
    backgroundColor: DuhaldeColors.background.card,
    borderWidth: 2,
    borderColor: DuhaldeColors.primary.orange,
    paddingVertical: DuhaldeSpacing.lg,
    paddingHorizontal: DuhaldeSpacing.xl,
    borderRadius: DuhaldeDimensions.button.borderRadius,
    minHeight: DuhaldeDimensions.button.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: DuhaldeColors.primary.orange,
    fontSize: DuhaldeFonts.size.large,
    fontWeight: DuhaldeFonts.weight.bold,
  },
  
  // Formulaires
  textInput: {
    borderWidth: 2,
    borderColor: DuhaldeColors.border.medium,
    borderRadius: DuhaldeDimensions.borderRadius.medium,
    paddingVertical: DuhaldeSpacing.lg,
    paddingHorizontal: DuhaldeSpacing.xl,
    fontSize: DuhaldeFonts.size.large,
    color: DuhaldeColors.text.primary,
    backgroundColor: DuhaldeColors.background.card,
    minHeight: DuhaldeDimensions.touchTarget.default,
  },
  inputLabel: {
    fontSize: DuhaldeFonts.size.large,
    fontWeight: DuhaldeFonts.weight.medium,
    color: DuhaldeColors.text.primary,
    marginBottom: DuhaldeSpacing.sm,
  },
  
  // Sections d'information
  infoSection: {
    backgroundColor: DuhaldeColors.primary.orangeLight,
    borderLeftWidth: 4,
    borderLeftColor: DuhaldeColors.primary.orange,
    padding: DuhaldeSpacing.lg,
    borderRadius: DuhaldeDimensions.borderRadius.medium,
    marginVertical: DuhaldeSpacing.lg,
  },
  infoTitle: {
    fontSize: DuhaldeFonts.size.xl,
    fontWeight: DuhaldeFonts.weight.bold,
    color: DuhaldeColors.primary.orange,
    marginBottom: DuhaldeSpacing.sm,
  },
  infoText: {
    fontSize: DuhaldeFonts.size.large,
    color: DuhaldeColors.text.secondary,
    lineHeight: 24,
  },
  
  // Messages d'erreur
  errorContainer: {
    backgroundColor: DuhaldeColors.status.error + '20',
    borderColor: DuhaldeColors.status.error,
    borderWidth: 1,
    borderRadius: DuhaldeDimensions.borderRadius.medium,
    padding: DuhaldeSpacing.lg,
    marginVertical: DuhaldeSpacing.md,
  },
  errorText: {
    color: DuhaldeColors.status.error,
    fontSize: DuhaldeFonts.size.large,
    fontWeight: DuhaldeFonts.weight.medium,
  },
  
  // Progress bars
  progressBar: {
    height: 8,
    backgroundColor: DuhaldeColors.border.light,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: DuhaldeColors.primary.orange,
    borderRadius: 4,
  },
});

// Fonction pour obtenir le style d'un badge de statut
export const getStatusBadgeStyle = (status: 'success' | 'warning' | 'error' | 'info' | 'default') => {
  const baseStyle = {
    paddingHorizontal: DuhaldeSpacing.md,
    paddingVertical: DuhaldeSpacing.sm,
    borderRadius: DuhaldeDimensions.borderRadius.small,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: DuhaldeDimensions.touchTarget.default - 16,
  };

  const colorMap = {
    success: { backgroundColor: DuhaldeColors.status.success + '20', color: DuhaldeColors.status.success },
    warning: { backgroundColor: DuhaldeColors.status.warning + '20', color: DuhaldeColors.status.warning },
    error: { backgroundColor: DuhaldeColors.status.error + '20', color: DuhaldeColors.status.error },
    info: { backgroundColor: DuhaldeColors.status.info + '20', color: DuhaldeColors.status.info },
    default: { backgroundColor: DuhaldeColors.secondary.grayLight, color: DuhaldeColors.text.secondary },
  };

  return {
    container: {
      ...baseStyle,
      backgroundColor: colorMap[status].backgroundColor,
    },
    text: {
      fontSize: DuhaldeFonts.size.base,
      fontWeight: DuhaldeFonts.weight.medium,
      color: colorMap[status].color,
    },
  };
};
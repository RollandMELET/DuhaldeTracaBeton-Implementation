/**
 * UIComponents ↔ ConfigEngine Interface Contract
 * 
 * Defines the interface contract between @ror-industrial/industrial-ui-components 
 * and @ror-industrial/industrial-config-engine for theme configuration
 * and dynamic branding management.
 */

export const UI_CONFIG_CONTRACT_INFO = {
  contractName: 'UIConfigContract',
  version: '1.0.0',
  minimumUIVersion: '^1.0.0',
  minimumConfigVersion: '^1.0.0',
  lastUpdated: '2025-09-05',
  description: 'Theme configuration and dynamic branding management',
  maintainer: 'DuhaldeTracaBeton-Implementation',
  
  performanceContract: {
    maxThemeLoadTime: 200,    // ms
    maxThemeApplyTime: 100,   // ms
    maxConfigUpdateTime: 150, // ms
  }
};

export interface UIConfigEngineContract {
  /**
   * Load theme configuration from config engine
   */
  loadThemeConfiguration(): Promise<ThemeConfiguration>;

  /**
   * Apply dynamic branding settings
   */
  applyBrandingSettings(branding: BrandingSettings): Promise<void>;

  /**
   * Get display settings for UI adaptation
   */
  getDisplaySettings(): Promise<DisplaySettings>;

  /**
   * Update theme at runtime
   */
  updateThemeAtRuntime?(themeUpdates: Partial<ThemeConfiguration>): Promise<void>;
}

export interface ConfigEngineUIContract {
  /**
   * Provide theme configuration for UI components
   */
  getThemeConfiguration(): Promise<ThemeConfiguration>;

  /**
   * Provide branding settings
   */
  getBrandingSettings(): Promise<BrandingSettings>;

  /**
   * Monitor theme usage and performance
   */
  reportThemeUsage?(usageData: ThemeUsageData): Promise<void>;
}

export interface ThemeConfiguration {
  clientId: string;
  version: string;
  colors: ColorConfiguration;
  typography: TypographyConfiguration;
  spacing: SpacingConfiguration;
  dimensions: DimensionConfiguration;
}

export interface BrandingSettings {
  companyName: string;
  primaryColor: string;
  secondaryColor?: string;
  logo?: string;
  touchTargetSize: number;
  minFontSize: number;
}

export interface DisplaySettings {
  orientation: 'portrait' | 'landscape' | 'both';
  targetResolution: string;
  deviceType: 'phone' | 'tablet' | 'desktop';
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface ColorConfiguration {
  primary: { main: string; light: string; dark: string };
  secondary: { main: string; light: string; dark: string };
  background: { main: string; card: string; section: string };
  text: { primary: string; secondary: string; white: string };
  status: { success: string; warning: string; error: string; info: string };
}

export interface TypographyConfiguration {
  fontFamily?: string;
  sizes: {
    xs: number; sm: number; base: number; large: number; xl: number;
    button: number; header: number; title: number;
  };
  weights: {
    normal: string; medium: string; semibold: string; bold: string;
  };
}

export interface SpacingConfiguration {
  xs: number; sm: number; md: number; lg: number; xl: number; xxl: number;
  card: { padding: number; margin: number };
  button: { paddingVertical: number; paddingHorizontal: number };
}

export interface DimensionConfiguration {
  touchTarget: { default: number; large: number; small: number };
  button: { minHeight: number; minWidth: number };
  borderRadius: { small: number; medium: number; large: number };
}

export interface ThemeUsageData {
  componentType: string;
  usageCount: number;
  averageRenderTime: number;
  timestamp: Date;
}
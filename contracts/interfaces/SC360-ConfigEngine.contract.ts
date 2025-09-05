/**
 * SC360Client ↔ ConfigEngine Interface Contract
 * 
 * Defines the interface contract between @ror-industrial/sc360-client 
 * and @ror-industrial/industrial-config-engine for API endpoint
 * and authentication configuration management.
 */

export const SC360_CONFIG_CONTRACT_INFO = {
  contractName: 'SC360ConfigContract',
  version: '1.0.0',
  minimumSC360Version: '^1.0.0',
  minimumConfigVersion: '^1.0.0',
  lastUpdated: '2025-09-05',
  description: 'API configuration and authentication management',
  maintainer: 'DuhaldeTracaBeton-Implementation',
  
  performanceContract: {
    maxConfigLoadTime: 200,   // ms
    maxAuthConfigTime: 300,   // ms
    configCacheDuration: 300000, // 5 minutes
  }
};

export interface SC360ConfigEngineContract {
  /**
   * Get API configuration for SC360Client initialization
   */
  getAPIConfiguration(environment: EnvironmentType): Promise<APIConfiguration>;

  /**
   * Get authentication configuration
   */
  getAuthenticationConfig(environment: EnvironmentType): Promise<AuthConfiguration>;

  /**
   * Get environment-specific settings
   */
  getEnvironmentSettings(environment: EnvironmentType): Promise<EnvironmentSettings>;

  /**
   * Report connection status back to config
   */
  reportConnectionStatus(status: ConnectionStatus): Promise<void>;
}

export interface ConfigEngineSC360Contract {
  /**
   * Provide API configuration for SC360Client
   */
  provideAPIConfig(): Promise<APIConfiguration>;

  /**
   * Provide authentication settings
   */
  provideAuthConfig(): Promise<AuthConfiguration>;

  /**
   * Monitor API performance and adjust configuration
   */
  monitorAPIPerformance?(metrics: APIPerformanceMetrics): Promise<void>;

  /**
   * Update configuration based on connection feedback
   */
  updateConfigFromFeedback?(feedback: ConnectionFeedback): Promise<void>;
}

export interface APIConfiguration {
  baseUrl: string;
  apiVersion: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  endpoints: APIEndpointConfig[];
  headers?: Record<string, string>;
}

export interface AuthConfiguration {
  type: 'bearer' | 'basic' | 'apikey' | 'oauth';
  credentials: AuthCredentials;
  refreshConfig?: RefreshConfiguration;
  securitySettings: SecuritySettings;
}

export interface EnvironmentSettings {
  environment: EnvironmentType;
  debugging: boolean;
  logging: LoggingConfiguration;
  features: FeatureFlag[];
  performance: PerformanceSettings;
}

export interface ConnectionStatus {
  connected: boolean;
  responseTime: number;
  lastSuccessfulCall: Date;
  errorCount: number;
  environment: EnvironmentType;
}

export type EnvironmentType = 'production' | 'staging' | 'development';

export interface APIEndpointConfig {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  timeout?: number;
  retries?: number;
}

export interface AuthCredentials {
  token?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
}

export interface RefreshConfiguration {
  refreshEndpoint: string;
  refreshToken?: string;
  autoRefresh: boolean;
  refreshThreshold: number; // seconds before expiry
}

export interface SecuritySettings {
  enforceHttps: boolean;
  validateCertificates: boolean;
  allowedOrigins: string[];
  tokenStorage: 'memory' | 'secure_storage' | 'keychain';
}

export interface LoggingConfiguration {
  level: 'error' | 'warn' | 'info' | 'debug';
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  sensitiveFields: string[];
}

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  environments: EnvironmentType[];
}

export interface PerformanceSettings {
  cacheEnabled: boolean;
  cacheDuration: number;
  maxConcurrentRequests: number;
  requestTimeout: number;
  compressionEnabled: boolean;
}

export interface APIPerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  retryCount: number;
  cacheHit: boolean;
}

export interface ConnectionFeedback {
  successful: boolean;
  responseTime: number;
  errorCode?: string;
  suggestion?: 'increase_timeout' | 'reduce_retries' | 'change_endpoint';
  timestamp: Date;
}
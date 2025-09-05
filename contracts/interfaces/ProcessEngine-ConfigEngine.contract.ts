/**
 * ProcessEngine ↔ ConfigEngine Interface Contract
 * 
 * Defines the interface contract between @ror-industrial/json-process-engine 
 * and @ror-industrial/industrial-config-engine for process template
 * loading, validation, and business rule management.
 */

export const ENGINE_CONFIG_CONTRACT_INFO = {
  contractName: 'ProcessEngineConfigContract',
  version: '1.0.0',
  minimumEngineVersion: '^1.0.0',
  minimumConfigVersion: '^1.0.0',
  lastUpdated: '2025-09-05',
  description: 'Process template management and business rule configuration',
  maintainer: 'DuhaldeTracaBeton-Implementation',
  
  performanceContract: {
    maxTemplateLoadTime: 300,    // ms
    maxValidationTime: 200,      // ms
    templateCacheDuration: 600000, // 10 minutes
  }
};

export interface ProcessEngineConfigContract {
  /**
   * Load process template from configuration
   */
  loadProcessTemplate(templateId: string): Promise<ProcessTemplate>;

  /**
   * Validate process definition against schemas
   */
  validateProcessDefinition(definition: ProcessDefinition): Promise<ValidationResult>;

  /**
   * Get business rules for process execution
   */
  getBusinessRules(processType: string): Promise<BusinessRuleSet>;

  /**
   * Save process execution results and metrics
   */
  saveProcessMetrics(metrics: ProcessExecutionMetrics): Promise<void>;

  /**
   * Get process configuration settings
   */
  getProcessConfiguration(processId: string): Promise<ProcessConfiguration>;
}

export interface ConfigEngineProcessContract {
  /**
   * Provide process templates for engine loading
   */
  provideProcessTemplate(templateId: string): Promise<ProcessTemplate>;

  /**
   * Provide validation schemas for process definitions
   */
  provideValidationSchema(schemaType: string): Promise<ValidationSchema>;

  /**
   * Provide business rules for process types
   */
  provideBusinessRules(processType: string): Promise<BusinessRuleSet>;

  /**
   * Store process execution analytics
   */
  storeExecutionAnalytics?(analytics: ProcessAnalytics): Promise<void>;

  /**
   * Update template based on execution feedback
   */
  updateTemplateFromFeedback?(templateId: string, feedback: TemplateFeedback): Promise<void>;
}

export interface ProcessTemplate {
  templateId: string;
  templateName: string;
  version: string;
  processType: string;
  definition: ProcessDefinition;
  metadata: TemplateMetadata;
  validation: TemplateValidation;
}

export interface ProcessDefinition {
  processId: string;
  processName: string;
  processType: string;
  processVersion: string;
  steps: ProcessStep[];
  processConfig?: ProcessConfig;
}

export interface ProcessStep {
  id: string;
  type: 'PointControle' | 'PointArret' | 'PointControleSpe' | 'Transition' | 'Terminal';
  title: string;
  description?: string;
  questions?: Question[];
  supervisorRequired?: boolean;
  photoRequired?: boolean;
  nextSteps?: string[];
  businessRules?: StepBusinessRules;
  validation?: StepValidation;
}

export interface Question {
  id: string;
  text: string;
  type: 'ok_ko' | 'text' | 'number' | 'choice' | 'photo';
  required: boolean;
  validation?: QuestionValidation;
  options?: string[];
}

export interface BusinessRuleSet {
  processType: string;
  rules: BusinessRule[];
  validators: BusinessValidator[];
  qualityRules: QualityRule[];
  escalationRules: EscalationRule[];
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: RuleAction;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface BusinessValidator {
  id: string;
  name: string;
  applicableSteps: string[];
  validationLogic: ValidationLogic;
  errorMessage: string;
}

export interface ProcessConfiguration {
  processId: string;
  enabled: boolean;
  maxExecutionTime: number;
  retryPolicy: RetryPolicy;
  notifications: NotificationConfig[];
  integrations: IntegrationConfig[];
}

export interface ProcessExecutionMetrics {
  processId: string;
  executionId: string;
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  stepMetrics: StepMetrics[];
  errorCount: number;
  retryCount: number;
  operatorId?: string;
}

export interface StepMetrics {
  stepId: string;
  executionTime: number;
  validationTime: number;
  retryCount: number;
  errorOccurred: boolean;
}

export interface TemplateMetadata {
  author: string;
  created: Date;
  lastModified: Date;
  usageCount: number;
  averageExecutionTime: number;
  successRate: number;
}

export interface TemplateValidation {
  schemaVersion: string;
  requiredFields: string[];
  optionalFields: string[];
  businessRuleIds: string[];
}

export interface ValidationSchema {
  schemaId: string;
  schemaVersion: string;
  jsonSchema: any;
  customValidators: CustomValidator[];
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  validationTime: number;
  schemaVersion: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'ERROR' | 'CRITICAL';
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  suggestion?: string;
}

export interface RuleAction {
  type: 'NOTIFY' | 'REDIRECT' | 'VALIDATE' | 'ESCALATE' | 'CUSTOM';
  parameters: Record<string, any>;
  timeout?: number;
}

export interface ValidationLogic {
  type: 'REGEX' | 'FUNCTION' | 'SCHEMA' | 'BUSINESS_RULE';
  rule: string | Function | object;
  parameters?: Record<string, any>;
}

export interface QualityRule {
  id: string;
  name: string;
  triggerConditions: string[];
  actions: QualityAction[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface QualityAction {
  type: 'ALERT' | 'NOTIFICATION' | 'WORKFLOW' | 'REPORT';
  target: string;
  data: Record<string, any>;
  delay?: number;
}

export interface EscalationRule {
  id: string;
  condition: string;
  timeoutMinutes: number;
  escalateTo: string[];
  actions: QualityAction[];
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffStrategy: 'FIXED' | 'EXPONENTIAL' | 'LINEAR';
  retryableErrors: string[];
}

export interface NotificationConfig {
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';
  enabled: boolean;
  recipients: string[];
  template: string;
}

export interface IntegrationConfig {
  systemId: string;
  enabled: boolean;
  config: Record<string, any>;
  endpoints: string[];
}

export interface ProcessAnalytics {
  processType: string;
  executionCount: number;
  averageDuration: number;
  successRate: number;
  commonErrors: string[];
  performanceData: any;
}

export interface TemplateFeedback {
  templateId: string;
  feedbackType: 'PERFORMANCE' | 'USABILITY' | 'ERROR' | 'SUGGESTION';
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  operatorId?: string;
  timestamp: Date;
}

export interface StepBusinessRules {
  validationRules: string[];
  completionCriteria: string[];
  escalationRules: string[];
  qualityChecks: string[];
}

export interface StepValidation {
  required: boolean;
  validatorIds: string[];
  customValidation?: string;
  timeoutSeconds?: number;
}

export interface QuestionValidation {
  required: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  range?: { min: number; max: number };
}

export interface CustomValidator {
  id: string;
  name: string;
  validationFunction: string; // Serialized function or reference
  errorMessage: string;
}

export interface ProcessConfig {
  timeoutMinutes: number;
  allowParallelExecution: boolean;
  requireSupervisorApproval: string[];
  qualityControlPoints: string[];
  integrationHooks: string[];
}
/**
 * ProcessEngine ↔ UIComponents Interface Contract
 * 
 * Defines the interface contract between @ror-industrial/json-process-engine 
 * and @ror-industrial/industrial-ui-components for progress tracking
 * and navigation coordination.
 * 
 * This contract ensures safe parallel development of both modules.
 */

// =============================================================================
// CONTRACT METADATA
// =============================================================================

export const PROCESS_ENGINE_UI_CONTRACT_INFO = {
  contractName: 'ProcessEngineUIContract',
  version: '1.0.0',
  minimumEngineVersion: '^1.0.0',
  minimumUIVersion: '^1.0.0',
  lastUpdated: '2025-09-05',
  description: 'Process progress tracking and UI navigation coordination',
  maintainer: 'DuhaldeTracaBeton-Implementation',
  
  performanceContract: {
    maxUIUpdateTime: 100,    // ms
    maxNavigationTime: 200,  // ms  
    progressUpdateFrequency: 500, // ms
  }
};

// =============================================================================
// CONTRACT INTERFACES
// =============================================================================

/**
 * Interface that UIComponents must implement for ProcessEngine integration
 */
export interface UIProcessEngineContract {
  /**
   * Update process progress in UI components
   * 
   * @param progressData - Current process progress information
   * @returns Promise resolving when UI is updated
   * 
   * @example
   * ```typescript
   * await uiComponents.updateProcessProgress({
   *   currentStep: 2,
   *   totalSteps: 5, 
   *   stepTitle: 'Steel Verification',
   *   percentage: 40
   * });
   * ```
   */
  updateProcessProgress(progressData: ProcessProgressData): Promise<void>;

  /**
   * Enable or disable navigation based on process state
   * 
   * @param navigationState - Navigation availability state
   * @returns Promise resolving when navigation state is applied
   * 
   * @example
   * ```typescript
   * await uiComponents.setNavigationState({
   *   nextEnabled: true,
   *   previousEnabled: false,
   *   homeEnabled: true
   * });
   * ```
   */
  setNavigationState(navigationState: NavigationState): Promise<void>;

  /**
   * Display process validation results in UI
   * 
   * @param validationResult - Validation results from process step
   * @returns Promise resolving when validation feedback is displayed
   * 
   * @example
   * ```typescript
   * await uiComponents.showValidationResult({
   *   valid: false,
   *   errors: ['Surface quality insufficient'],
   *   stepId: 'PC1_QUALITY_CHECK'
   * });
   * ```
   */
  showValidationResult(validationResult: ProcessValidationResult): Promise<void>;

  /**
   * Update step completion status in UI
   * 
   * @param stepData - Information about completed step
   * @returns Promise resolving when step status is updated
   */
  updateStepStatus(stepData: StepStatusData): Promise<void>;

  /**
   * Show process error state in UI
   * 
   * @param errorData - Process error information
   * @returns Promise resolving when error is displayed
   */
  showProcessError(errorData: ProcessErrorData): Promise<void>;

  // =============================================================================
  // OPTIONAL METHODS (safe to add in minor versions)
  // =============================================================================

  /**
   * OPTIONAL: Enhanced progress with metrics
   * Added in v1.1.0+ - backward compatible
   */
  updateProgressWithMetrics?(
    progressData: ProcessProgressData, 
    metrics: ProcessMetrics
  ): Promise<void>;

  /**
   * OPTIONAL: Custom step animations
   * Added in v1.1.0+ - backward compatible
   */
  animateStepTransition?(
    fromStep: string, 
    toStep: string, 
    duration?: number
  ): Promise<void>;
}

/**
 * Interface that ProcessEngine must implement for UI coordination
 */
export interface ProcessEngineUIContract {
  /**
   * Get current process progress for UI display
   * 
   * @param processId - Process identifier
   * @returns Promise resolving to current progress data
   */
  getProcessProgress(processId: string): Promise<ProcessProgressData>;

  /**
   * Get available navigation options for current state
   * 
   * @param processId - Process identifier
   * @returns Promise resolving to navigation options
   */
  getNavigationOptions(processId: string): Promise<NavigationOptions>;

  /**
   * Notify engine of user navigation action
   * 
   * @param navigationAction - User's navigation choice
   * @returns Promise resolving to navigation result
   */
  handleNavigationAction(navigationAction: NavigationAction): Promise<NavigationResult>;

  /**
   * Get step validation requirements for UI preparation
   * 
   * @param stepId - Step identifier
   * @returns Promise resolving to validation requirements
   */
  getStepValidationRequirements(stepId: string): Promise<ValidationRequirements>;

  /**
   * Register UI event handler for process events
   * 
   * @param eventType - Type of process event to listen for
   * @param handler - Event handler function
   */
  registerUIEventHandler(
    eventType: ProcessEventType, 
    handler: (eventData: any) => void
  ): void;
}

// =============================================================================
// CONTRACT DATA TYPES  
// =============================================================================

export interface ProcessProgressData {
  processId: string;
  currentStep: number;
  totalSteps: number;
  currentStepId: string;
  currentStepTitle: string;
  percentage: number;
  timeElapsed: number;      // seconds
  estimatedTimeRemaining: number; // seconds
  lastUpdate: Date;
}

export interface NavigationState {
  nextEnabled: boolean;
  previousEnabled: boolean;
  homeEnabled: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
  homeButtonText?: string;
  customActions?: CustomNavigationAction[];
}

export interface ProcessValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  stepId: string;
  timestamp: Date;
  validationDuration: number; // ms
}

export interface StepStatusData {
  stepId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  completedAt?: Date;
  completedBy?: string;
  data?: any;
  validationResult?: ProcessValidationResult;
}

export interface ProcessErrorData {
  errorId: string;
  errorCode: string;
  message: string;
  processId: string;
  stepId?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: Date;
  recoverable: boolean;
  suggestedActions?: string[];
}

export interface ProcessMetrics {
  performanceData: {
    stepExecutionTime: number;
    validationTime: number;
    navigationTime: number;
  };
  qualityData: {
    errorRate: number;
    retryCount: number;
    userSatisfaction?: number;
  };
}

export interface CustomNavigationAction {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  action: () => Promise<void>;
}

export interface NavigationOptions {
  availableDirections: ('next' | 'previous' | 'home' | 'custom')[];
  nextStepInfo?: {
    stepId: string;
    title: string;
    estimatedDuration: number;
  };
  previousStepInfo?: {
    stepId: string;
    title: string;
  };
  customOptions?: CustomNavigationAction[];
}

export interface NavigationAction {
  type: 'NEXT' | 'PREVIOUS' | 'HOME' | 'CUSTOM';
  currentStepId: string;
  targetStepId?: string;
  customActionId?: string;
  userData?: any;
}

export interface NavigationResult {
  success: boolean;
  newStepId?: string;
  error?: ContractError;
  requiresUserConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface ValidationRequirements {
  stepId: string;
  requiredFields: string[];
  validationRules: ValidationRule[];
  optionalFields?: string[];
  customValidators?: CustomValidator[];
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'regex' | 'range' | 'custom';
  rule: string | number | RegExp;
  errorMessage: string;
}

export interface CustomValidator {
  id: string;
  name: string;
  validationFunction: (data: any) => Promise<ValidationResult>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  validationTime: number; // ms
}

export type ProcessEventType = 
  | 'PROCESS_STARTED'
  | 'STEP_COMPLETED' 
  | 'VALIDATION_FAILED'
  | 'PROCESS_COMPLETED'
  | 'PROCESS_ERROR'
  | 'NAVIGATION_REQUESTED';

export interface ContractError {
  code: string;
  message: string;
  module: 'ProcessEngine' | 'UIComponents';
  contractVersion: string;
  retryable: boolean;
  timestamp: Date;
  context?: any;
}

// =============================================================================
// CONTRACT VALIDATION HELPERS
// =============================================================================

/**
 * Validate ProcessEngine implementation compliance
 */
export function validateProcessEngineUIContract(
  implementation: any
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  const requiredMethods = [
    'getProcessProgress',
    'getNavigationOptions',
    'handleNavigationAction',
    'getStepValidationRequirements',
    'registerUIEventHandler'
  ];
  
  requiredMethods.forEach(method => {
    if (typeof implementation[method] !== 'function') {
      violations.push(`ProcessEngine missing required method: ${method}`);
    }
  });
  
  return { valid: violations.length === 0, violations };
}

/**
 * Validate UIComponents implementation compliance
 */
export function validateUIProcessEngineContract(
  implementation: any
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  const requiredMethods = [
    'updateProcessProgress',
    'setNavigationState', 
    'showValidationResult',
    'updateStepStatus',
    'showProcessError'
  ];
  
  requiredMethods.forEach(method => {
    if (typeof implementation[method] !== 'function') {
      violations.push(`UIComponents missing required method: ${method}`);
    }
  });
  
  return { valid: violations.length === 0, violations };
}

/**
 * Performance validation for UI updates
 */
export function validateUIPerformance(
  updateDuration: number,
  operationType: string
): { meetsContract: boolean; issues: string[] } {
  const issues: string[] = [];
  const contract = PROCESS_ENGINE_UI_CONTRACT_INFO.performanceContract;
  
  let maxTime: number;
  switch (operationType) {
    case 'progress_update':
      maxTime = contract.maxUIUpdateTime;
      break;
    case 'navigation':
      maxTime = contract.maxNavigationTime;
      break;
    default:
      maxTime = contract.maxUIUpdateTime;
  }
  
  if (updateDuration > maxTime) {
    issues.push(`${operationType} took ${updateDuration}ms, exceeds ${maxTime}ms limit`);
  }
  
  return {
    meetsContract: issues.length === 0,
    issues
  };
}
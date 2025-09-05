/**
 * SC360Client ↔ ProcessEngine Interface Contract
 * 
 * Defines the interface contract between @ror-industrial/sc360-client 
 * and @ror-industrial/json-process-engine modules for avatar state
 * synchronization with workflow execution.
 * 
 * This contract ensures safe parallel development of both modules.
 */

// =============================================================================
// CONTRACT METADATA
// =============================================================================

export const SC360_PROCESS_ENGINE_CONTRACT_INFO = {
  contractName: 'SC360ProcessEngineContract',
  version: '1.0.0',
  minimumSC360Version: '^1.0.0',
  minimumEngineVersion: '^1.0.0',
  lastUpdated: '2025-09-05',
  description: 'Avatar state synchronization between SC360Client and ProcessEngine',
  maintainer: 'DuhaldeTracaBeton-Implementation',
  
  // Breaking change history
  breakingChanges: [
    // { version: '2.0.0', date: '2025-XX-XX', reason: 'Added required metadata parameter' }
  ],
  
  // Performance requirements
  performanceContract: {
    maxSyncTime: 500,        // ms
    maxRetryAttempts: 3,
    timeoutDuration: 30000,  // ms
  }
};

// =============================================================================
// CONTRACT INTERFACES
// =============================================================================

/**
 * Main interface that SC360Client must implement for ProcessEngine integration
 */
export interface SC360ProcessEngineContract {
  /**
   * Synchronize avatar state with workflow engine
   * 
   * @param avatarId - 360SC avatar identifier
   * @param workflowState - New workflow state from ProcessEngine
   * @param metadata - Optional metadata for state change
   * @returns Promise resolving to sync result
   * 
   * @example
   * ```typescript
   * const result = await sc360Client.syncAvatarState('avatar-123', 'PC2_STEEL_CHECK');
   * if (!result.success) {
   *   console.error('Sync failed:', result.error);
   * }
   * ```
   */
  syncAvatarState(
    avatarId: string, 
    workflowState: string, 
    metadata?: SyncMetadata
  ): Promise<SyncResult>;

  /**
   * Get current avatar status for workflow coordination
   * 
   * @param avatarId - 360SC avatar identifier  
   * @returns Promise resolving to current avatar status
   * 
   * @example
   * ```typescript
   * const status = await sc360Client.getAvatarStatus('avatar-123');
   * if (status.isReady) {
   *   await processEngine.continueWorkflow(status.currentNode.humanId);
   * }
   * ```
   */
  getAvatarStatus(avatarId: string): Promise<AvatarStatus>;

  /**
   * Handle synchronization failures with recovery actions
   * 
   * @param error - Contract error with standardized format
   * @returns Promise resolving to recovery action
   * 
   * @example  
   * ```typescript
   * try {
   *   await syncAvatarState(avatarId, state);
   * } catch (error) {
   *   const recovery = await handleSyncFailure(error);
   *   if (recovery.shouldRetry) {
   *     // Retry logic
   *   }
   * }
   * ```
   */
  handleSyncFailure(error: ContractError): Promise<RecoveryAction>;

  /**
   * Initialize avatar for workflow processing
   * 
   * @param avatarData - Avatar creation data
   * @param processType - Type of process (DALLE, TOIT, ENVELOPPE)
   * @returns Promise resolving to created avatar info
   */
  initializeAvatarForWorkflow(
    avatarData: AvatarCreationData, 
    processType: DuhaldeProcessType
  ): Promise<AvatarWorkflowInfo>;

  // =============================================================================
  // OPTIONAL METHODS (safe to add in minor versions)
  // =============================================================================

  /**
   * OPTIONAL: Enhanced metadata synchronization
   * Added in v1.1.0 - backward compatible
   */
  syncAvatarMetadata?(avatarId: string, metadata: ExtendedMetadata): Promise<SyncResult>;

  /**
   * OPTIONAL: Batch operations for performance
   * Added in v1.1.0 - backward compatible  
   */
  syncMultipleAvatars?(operations: BatchSyncOperation[]): Promise<BatchSyncResult>;
}

/**
 * Interface that ProcessEngine must implement for SC360Client integration
 */
export interface ProcessEngineSC360Contract {
  /**
   * Receive avatar state updates from SC360Client
   * 
   * @param avatarId - 360SC avatar identifier
   * @param sc360State - Current state from 360SmartConnect
   * @returns Promise resolving to workflow action
   */
  onAvatarStateUpdate(avatarId: string, sc360State: SC360State): Promise<WorkflowAction>;

  /**
   * Get workflow state for avatar synchronization
   * 
   * @param avatarId - 360SC avatar identifier
   * @returns Promise resolving to current workflow state
   */
  getWorkflowStateForAvatar(avatarId: string): Promise<WorkflowState>;

  /**
   * Handle SC360 connection failures
   * 
   * @param error - SC360 connection error
   * @returns Promise resolving to workflow continuation strategy
   */
  handleSC360Disconnection(error: ContractError): Promise<ContinuationStrategy>;
}

// =============================================================================
// CONTRACT DATA TYPES
// =============================================================================

export interface SyncResult {
  success: boolean;
  avatarId: string;
  oldState: string;
  newState: string;
  timestamp: Date;
  syncDuration: number;    // ms
  metadata?: any;
  error?: ContractError;
}

export interface AvatarStatus {
  avatarId: string;
  currentState: string;
  currentNode?: {
    id: string;
    humanId: string;
    name: string;
  };
  lastUpdate: Date;
  isReady: boolean;
  workflowActive: boolean;
  metadata?: any;
}

export interface SyncMetadata {
  stepId?: string;
  processType?: DuhaldeProcessType;
  operatorId?: string;
  timestamp?: Date;
  customFields?: Record<string, any>;
}

export interface AvatarCreationData {
  name: string;
  alphaId: string;
  company: string;
  metadataType: string;
  initialState?: string;
}

export interface AvatarWorkflowInfo {
  avatarId: string;
  workflowId: string;
  initialNode: {
    id: string;
    humanId: string;
    name: string;
  };
  processType: DuhaldeProcessType;
  estimatedDuration: number;
}

export interface WorkflowAction {
  type: 'CONTINUE' | 'PAUSE' | 'RESTART' | 'COMPLETE' | 'ERROR';
  nextStepId?: string;
  message?: string;
  data?: any;
}

export interface WorkflowState {
  workflowId: string;
  currentStepId: string;
  status: 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'ERROR';
  progress: {
    currentStep: number;
    totalSteps: number;
    percentage: number;
  };
  lastUpdate: Date;
}

export interface SC360State {
  objectId: string;
  currentNode: {
    id: string;
    humanId: string;
    name: string;
  };
  status: string;
  lastUpdate: Date;
  metadata?: any;
}

export interface ContinuationStrategy {
  strategy: 'OFFLINE_MODE' | 'RETRY_CONNECTION' | 'MANUAL_INTERVENTION';
  timeoutMs?: number;
  retryAttempts?: number;
  fallbackActions?: string[];
}

export type DuhaldeProcessType = 'DALLE' | 'TOIT' | 'ENVELOPPE';

export interface ExtendedMetadata {
  qualityData?: any;
  processMetrics?: any;
  operatorNotes?: string;
  photos?: string[];
}

export interface BatchSyncOperation {
  avatarId: string;
  targetState: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  metadata?: SyncMetadata;
}

export interface BatchSyncResult {
  totalOperations: number;
  successful: number;
  failed: number;
  results: SyncResult[];
  errors: ContractError[];
}

// =============================================================================
// STANDARDIZED ERROR HANDLING
// =============================================================================

export interface ContractError {
  code: string;
  message: string;
  module: 'SC360Client' | 'ProcessEngine';
  contractVersion: string;
  retryable: boolean;
  timestamp: Date;
  context?: any;
}

export interface RecoveryAction {
  action: 'RETRY' | 'SKIP' | 'MANUAL_INTERVENTION' | 'FAIL_GRACEFULLY';
  shouldRetry: boolean;
  retryAfterMs?: number;
  maxRetries?: number;
  fallbackData?: any;
  userNotification?: string;
}

// =============================================================================
// CONTRACT VALIDATION HELPERS
// =============================================================================

/**
 * Utility function to validate contract compliance at runtime
 */
export function validateSC360ProcessEngineContract(
  implementation: any
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  // Check required methods exist
  const requiredMethods = [
    'syncAvatarState',
    'getAvatarStatus', 
    'handleSyncFailure',
    'initializeAvatarForWorkflow'
  ];
  
  requiredMethods.forEach(method => {
    if (typeof implementation[method] !== 'function') {
      violations.push(`Missing required method: ${method}`);
    }
  });
  
  return {
    valid: violations.length === 0,
    violations
  };
}

/**
 * Performance validation for contract compliance
 */
export function validateSyncPerformance(
  syncResult: SyncResult
): { meetsContract: boolean; issues: string[] } {
  const issues: string[] = [];
  const maxSyncTime = SC360_PROCESS_ENGINE_CONTRACT_INFO.performanceContract.maxSyncTime;
  
  if (syncResult.syncDuration > maxSyncTime) {
    issues.push(`Sync took ${syncResult.syncDuration}ms, exceeds contract limit of ${maxSyncTime}ms`);
  }
  
  return {
    meetsContract: issues.length === 0,
    issues
  };
}
/**
 * SC360Client ↔ UIComponents Interface Contract
 * 
 * Defines the interface contract between @ror-industrial/sc360-client 
 * and @ror-industrial/industrial-ui-components for status badges
 * and visual feedback management.
 */

export const SC360_UI_CONTRACT_INFO = {
  contractName: 'SC360UIContract',
  version: '1.0.0',
  minimumSC360Version: '^1.0.0',
  minimumUIVersion: '^1.0.0',
  lastUpdated: '2025-09-05',
  description: 'Status visualization and user feedback management',
  maintainer: 'DuhaldeTracaBeton-Implementation',
  
  performanceContract: {
    maxStatusUpdateTime: 100,  // ms
    maxFeedbackTime: 150,     // ms
    maxIconLoadTime: 200,     // ms
  }
};

export interface SC360UIComponentsContract {
  /**
   * Update object status badge in UI
   */
  updateObjectStatusBadge(status: ObjectStatusData): Promise<void>;

  /**
   * Show connection status in UI header
   */
  updateConnectionStatus(connectionData: ConnectionStatusData): Promise<void>;

  /**
   * Display operation feedback to user
   */
  showOperationFeedback(feedback: OperationFeedback): Promise<void>;

  /**
   * Update progress indicator for long operations
   */
  updateOperationProgress(progress: OperationProgress): Promise<void>;

  /**
   * Show error state with recovery options
   */
  showErrorState(errorData: ErrorDisplayData): Promise<void>;

  /**
   * Clear temporary feedback messages
   */
  clearFeedbackMessages?(messageTypes?: string[]): Promise<void>;
}

export interface UIComponentsSC360Contract {
  /**
   * Handle user-initiated status changes
   */
  handleStatusChangeRequest(request: StatusChangeRequest): Promise<StatusChangeResult>;

  /**
   * Handle user retry actions for failed operations
   */
  handleRetryRequest(operation: RetryOperation): Promise<RetryResult>;

  /**
   * Get current UI state for synchronization
   */
  getCurrentUIState(): Promise<UIState>;

  /**
   * Register for UI events that affect SC360 operations
   */
  registerForUIEvents?(eventTypes: UIEventType[]): Promise<void>;
}

export interface ObjectStatusData {
  objectId: string;
  objectType: 'PIECE' | 'MOULE' | 'BL';
  currentStatus: string;
  previousStatus?: string;
  statusColor: string;
  statusText: string;
  lastUpdate: Date;
  metadata?: any;
}

export interface ConnectionStatusData {
  connected: boolean;
  connectionQuality: 'EXCELLENT' | 'GOOD' | 'POOR' | 'DISCONNECTED';
  responseTime?: number;
  lastSync?: Date;
  pendingOperations: number;
  errorCount: number;
}

export interface OperationFeedback {
  operationType: 'UPLOAD' | 'DOWNLOAD' | 'SYNC' | 'CREATE' | 'UPDATE' | 'DELETE';
  success: boolean;
  message: string;
  duration?: number;
  objectId?: string;
  timestamp: Date;
  details?: any;
}

export interface OperationProgress {
  operationId: string;
  operationType: string;
  progress: number;        // 0-100
  currentStep: string;
  totalSteps: number;
  estimatedTimeRemaining: number; // seconds
  canCancel: boolean;
}

export interface ErrorDisplayData {
  errorId: string;
  errorCode: string;
  userMessage: string;
  technicalMessage: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recoverable: boolean;
  suggestedActions: SuggestedAction[];
  timestamp: Date;
}

export interface SuggestedAction {
  actionId: string;
  label: string;
  description: string;
  actionType: 'RETRY' | 'CANCEL' | 'CONTACT_SUPPORT' | 'TRY_ALTERNATIVE';
  isPrimary: boolean;
}

export interface StatusChangeRequest {
  objectId: string;
  currentStatus: string;
  requestedStatus: string;
  reason?: string;
  operatorId?: string;
  timestamp: Date;
}

export interface StatusChangeResult {
  success: boolean;
  newStatus?: string;
  error?: string;
  requiresConfirmation: boolean;
  confirmationMessage?: string;
}

export interface RetryOperation {
  operationId: string;
  originalOperation: string;
  failureReason: string;
  retryAttempt: number;
  maxRetries: number;
}

export interface RetryResult {
  success: boolean;
  shouldContinueRetrying: boolean;
  nextRetryDelay?: number;
  error?: string;
}

export interface UIState {
  currentScreen: string;
  visibleObjects: string[];
  activeOperations: string[];
  connectionStatus: string;
  userInteractionEnabled: boolean;
  lastUpdate: Date;
}

export type UIEventType = 
  | 'USER_STATUS_CHANGE'
  | 'USER_RETRY_REQUEST'
  | 'USER_CANCEL_OPERATION'
  | 'SCREEN_FOCUS_CHANGE'
  | 'CONNECTION_TEST_REQUEST';

// =============================================================================
// DUHALDE-SPECIFIC EXTENSIONS
// =============================================================================

/**
 * Duhalde-specific status types for concrete manufacturing
 */
export type DuhaldeObjectStatus = 
  | 'CREATED'           // Piece/Moule created
  | 'IN_PROGRESS'       // Manufacturing in progress
  | 'PC1_INITIAL'       // Initial verification
  | 'PC2_STEEL'         // Steel verification  
  | 'PC3_FINAL'         // Final verification
  | 'QUALITY_CHECK'     // Quality control
  | 'SUPERVISOR_REVIEW' // Supervisor validation
  | 'COMPLETED'         // Manufacturing complete
  | 'REBUT'             // Quality rejection
  | 'DELIVERED';        // Delivered to client

/**
 * Duhalde-specific operation types
 */
export type DuhaldeOperationType = 
  | 'CREATE_AVATAR'
  | 'UPLOAD_QUALITY_PHOTO' 
  | 'UPDATE_PROCESS_STATE'
  | 'TRIGGER_REBUT_WORKFLOW'
  | 'NOTIFY_SUPERVISOR'
  | 'ASSIGN_BL_BETON';

/**
 * Duhalde-specific feedback messages
 */
export interface DuhaldeOperationFeedback extends OperationFeedback {
  operationType: DuhaldeOperationType;
  processType?: 'DALLE' | 'TOIT' | 'ENVELOPPE';
  qualityLevel?: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'REBUT';
  supervisorRequired?: boolean;
  urratsIntegration?: boolean;
}

/**
 * Duhalde-specific error handling
 */
export interface DuhaldeErrorDisplayData extends ErrorDisplayData {
  processType?: 'DALLE' | 'TOIT' | 'ENVELOPPE';
  affectedPieces?: string[];
  qualityImpact?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  productionImpact?: 'NONE' | 'DELAY' | 'STOP' | 'REWORK';
  urratsRequired?: boolean;
}
# Contract Development Guide - Human Developers & AI Agents

## 🎯 **Purpose & Philosophy**

This guide explains the **module interface contract system** for the RoR Industrial ecosystem, enabling **safe parallel development** of 4 independent modules while guaranteeing **system robustness** and **non-regression**.

### **Core Principle**
**Interface contracts ensure that adding new features to one module never breaks functionality in other modules.**

## 🏗️ **Contract Architecture**

### **Contract Location Strategy**
```
DuhaldeTracaBeton-Implementation/contracts/
    ↓ (Source of Truth)
Propagated to each module via scripts:
├── ror-industrial-modules/sc360-client/contracts/
├── ror-industrial-modules/json-process-engine/contracts/  
├── ror-industrial-modules/industrial-ui-components/contracts/
└── ror-industrial-modules/industrial-config-engine/contracts/
```

**Why in DuhaldeTracaBeton-Implementation?**
- ✅ **Real-world usage** - Contracts reflect actual interaction needs
- ✅ **Single source of truth** - No duplication or inconsistency
- ✅ **Client perspective** - Interfaces designed from user's viewpoint
- ✅ **Evolution driver** - Contracts evolve with real business needs

## 📋 **Contract Development Workflow**

### **For Human Developers**

#### **Step 1: Understand the Interaction**
```bash
# Before modifying any module, check interaction contracts
cd DuhaldeTracaBeton-Implementation/contracts
cat INTERACTION_MAP.md
cat interfaces/[relevant-contract].ts
```

#### **Step 2: Develop Respecting Contracts**
```typescript
// Example: Adding feature to SC360Client
// 1. Check what ProcessEngine expects from SC360Client
interface SC360ProcessEngineContract {
  syncAvatarState(avatarId: string, state: string): Promise<void>;
  // ↑ This method MUST remain unchanged
}

// 2. Add new functionality WITHOUT changing existing interface
class SC360Client implements SC360ProcessEngineContract {
  // ✅ Existing method - CANNOT change signature
  async syncAvatarState(avatarId: string, state: string): Promise<void> {
    // Original implementation must remain compatible
  }
  
  // ✅ New method - Can be added safely
  async syncAvatarMetadata(avatarId: string, metadata: any): Promise<void> {
    // New functionality
  }
}
```

#### **Step 3: Test Contract Compliance**
```bash
# Run contract compliance tests before committing
cd ror-industrial-modules/sc360-client
npm run test:contract-compliance

# Run cross-module integration tests
cd DuhaldeTracaBeton-Implementation
npm run test:all-contracts
```

#### **Step 4: Update Contracts if Needed**
```typescript
// If you MUST change a contract (rare!), increment version
interface SC360ProcessEngineContract {
  version: '2.0.0';  // ← Major version increment for breaking change
  
  // Changed method signature (BREAKING CHANGE)
  syncAvatarState(avatarId: string, state: string, metadata?: any): Promise<void>;
}
```

### **For AI Coding Agents**

#### **Pre-Development Protocol**
```bash
# ALWAYS check contracts before any module development
mcp__archon__perform_rag_query(query="module interface contracts", match_count=3)

# Read relevant contract file
Read(/path/to/DuhaldeTracaBeton-Implementation/contracts/interfaces/[module-contract].ts)

# Check interaction requirements
Read(/path/to/DuhaldeTracaBeton-Implementation/contracts/INTERACTION_MAP.md)
```

#### **Development Guidelines for AI**
1. **NEVER modify existing interface methods** - Only add new methods
2. **ALWAYS check contract compliance** - Run tests before committing
3. **UPDATE contract versions** if breaking changes absolutely necessary
4. **DOCUMENT all changes** - Update interface JSDoc comments
5. **VALIDATE backward compatibility** - Ensure existing code still works

#### **AI Contract Compliance Checklist**
```typescript
// Before implementing ANY module feature:
// ✅ Have I read the relevant contract file?
// ✅ Does my implementation respect existing interface methods?  
// ✅ Are any new methods optional or with default values?
// ✅ Have I run contract compliance tests?
// ✅ Will existing client code still work unchanged?
```

## 🔍 **Contract Specifications**

### **Contract File Structure**
```typescript
// contracts/interfaces/ModuleA-ModuleB.contract.ts
export interface ModuleAModuleBContract {
  // Contract metadata
  version: '1.0.0';                          // Semantic version
  minimumModuleAVersion: '^1.0.0';          // Required module versions
  minimumModuleBVersion: '^1.0.0';
  
  // Contract description
  description: 'Interface for ModuleA and ModuleB interaction';
  lastUpdated: '2025-09-05';
  
  // Required interface methods
  methodName(param: Type): Promise<ReturnType>;
  
  // Optional interface methods (safe to add)
  optionalMethod?(param?: Type): Promise<ReturnType>;
  
  // Event interfaces
  onEvent?(eventData: EventType): void;
}
```

### **Real Example: SC360-ProcessEngine Contract**
```typescript
// contracts/interfaces/SC360-ProcessEngine.contract.ts
export interface SC360ProcessEngineContract {
  version: '1.0.0';
  minimumSC360Version: '^1.0.0';
  minimumEngineVersion: '^1.0.0';
  description: 'Avatar state synchronization between SC360Client and ProcessEngine';
  lastUpdated: '2025-09-05';

  // REQUIRED METHODS - NEVER change signatures
  syncAvatarState(avatarId: string, workflowState: string): Promise<SyncResult>;
  getAvatarStatus(avatarId: string): Promise<AvatarStatus>;
  
  // ERROR HANDLING - Must follow contract
  handleSyncFailure(error: ContractError): Promise<RecoveryAction>;
  
  // EVENTS - Optional but if implemented, must match signature  
  onStateChange?(avatarId: string, oldState: string, newState: string): void;
  onSyncError?(avatarId: string, error: ContractError): void;
}

// Supporting types (part of contract)
export interface SyncResult {
  success: boolean;
  avatarId: string;
  newState: string;
  timestamp: Date;
  metadata?: any;
}

export interface AvatarStatus {
  avatarId: string;
  currentState: string;
  lastUpdate: Date;
  isReady: boolean;
}
```

## 🧪 **Testing Contracts**

### **Contract Compliance Testing**
```typescript
// contracts/tests/contract-compliance.test.ts
describe('SC360Client Contract Compliance', () => {
  let sc360Client: SC360Client;
  
  beforeEach(() => {
    sc360Client = new SC360Client(testConfig, mockAdapter);
  });

  test('implements SC360ProcessEngineContract', () => {
    // Verify all required methods exist
    expect(typeof sc360Client.syncAvatarState).toBe('function');
    expect(typeof sc360Client.getAvatarStatus).toBe('function');
    expect(typeof sc360Client.handleSyncFailure).toBe('function');
  });

  test('syncAvatarState respects contract signature', async () => {
    // Test method signature compliance
    const result = await sc360Client.syncAvatarState('avatar-123', 'IN_PROGRESS');
    
    // Verify return type matches contract
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('avatarId');
    expect(result).toHaveProperty('newState');
    expect(result.avatarId).toBe('avatar-123');
  });

  test('maintains backward compatibility', () => {
    // Test that v1.0.0 client code still works with v1.1.0 module
    const legacyCode = () => {
      return sc360Client.syncAvatarState('test-avatar', 'COMPLETED');
    };
    
    expect(legacyCode).not.toThrow();
  });
});
```

### **Integration Testing Between Modules**
```typescript
// contracts/tests/sc360-engine.integration.test.ts
describe('SC360Client + ProcessEngine Integration', () => {
  test('avatar state sync workflow', async () => {
    // Test real interaction between modules
    const avatar = await sc360Client.createAvatar(testData);
    await processEngine.startProcess('ProcessDalle', avatar.id);
    
    // Verify state synchronization works
    const status = await sc360Client.getAvatarStatus(avatar.id);
    expect(status.currentState).toBe('WORKFLOW_STARTED');
  });

  test('handles network failures gracefully', async () => {
    // Test error handling across module boundaries
    mockNetworkFailure();
    
    const result = await sc360Client.syncAvatarState('test', 'NEW_STATE');
    expect(result.success).toBe(false);
    
    // Verify ProcessEngine handles SC360 failures appropriately
    const engineState = processEngine.getState();
    expect(engineState.status).toBe('SYNC_PENDING');
  });
});
```

## 🔧 **Contract Evolution Management**

### **Safe Evolution Pattern**
```typescript
// Version 1.0.0 - Initial contract
interface SC360ProcessEngineContract {
  version: '1.0.0';
  syncAvatarState(avatarId: string, state: string): Promise<SyncResult>;
}

// Version 1.1.0 - Adding optional functionality (SAFE)
interface SC360ProcessEngineContract {
  version: '1.1.0';
  
  // Existing method UNCHANGED
  syncAvatarState(avatarId: string, state: string): Promise<SyncResult>;
  
  // New optional method (backward compatible)
  syncAvatarMetadata?(avatarId: string, metadata: any): Promise<SyncResult>;
}

// Version 2.0.0 - Breaking change (REQUIRES COORDINATION)
interface SC360ProcessEngineContract {
  version: '2.0.0';
  
  // Changed signature - BREAKING CHANGE
  syncAvatarState(
    avatarId: string, 
    state: string, 
    options: SyncOptions  // ← New required parameter
  ): Promise<SyncResult>;
}
```

### **Breaking Change Process**
1. **Document necessity** - Why is breaking change required?
2. **Update ALL affected modules** - No partial updates allowed
3. **Increment major version** - Clear signal of breaking change
4. **Update tests** - All contract tests must pass
5. **Update documentation** - Migration guide for breaking change

## 📱 **Practical Development Examples**

### **Scenario 1: Adding Photo Upload Feature to SC360Client**
```typescript
// ✅ CORRECT: Adding backward-compatible method
interface SC360UIComponentsContract {
  version: '1.1.0';  // Minor version increment
  
  // Existing methods unchanged
  updateStatusBadge(status: string, color: string): void;
  
  // New optional method - backward compatible
  showPhotoUploadProgress?(progress: number): void;
}

// Implementation
class SC360Client {
  // Existing functionality preserved
  updateStatusBadge(status: string, color: string): void {
    // Original implementation unchanged
  }
  
  // New functionality added safely
  showPhotoUploadProgress(progress: number): void {
    // New feature implementation
  }
}
```

### **Scenario 2: Modifying ProcessEngine Step Execution**
```typescript
// ❌ WRONG: Changing existing method signature
interface ProcessEngineUIContract {
  version: '2.0.0';  // Breaking change!
  
  // BREAKING: Changed signature
  updateProgress(step: number, total: number, metadata: any): void;  // Added metadata
}

// ✅ CORRECT: Adding new method instead
interface ProcessEngineUIContract {
  version: '1.1.0';  // Minor version increment
  
  // Original method unchanged
  updateProgress(step: number, total: number): void;
  
  // New method for enhanced functionality  
  updateProgressWithMetadata?(step: number, total: number, metadata: any): void;
}
```

## 🛠️ **Development Tools & Scripts**

### **Contract Synchronization**
```bash
# Sync contracts to all modules
./scripts/sync-contracts-to-modules.sh

# Test all contracts across modules
./scripts/test-all-module-contracts.sh

# Validate contract evolution
./scripts/validate-contract-evolution.sh
```

### **Pre-Commit Validation**
```bash
# Automatic validation before any commit
git add .
./scripts/validate-contract-compliance.sh  # Must pass before commit
git commit -m "feat: Add new feature respecting contracts"
```

### **CI/CD Integration**
```yaml
# GitHub Actions workflow
- name: Validate Contracts
  run: |
    npm run test:contract-compliance
    npm run test:cross-module-integration
    npm run validate:breaking-changes
```

## 🚨 **Critical Rules for All Developers**

### **NEVER Do**
- ❌ **Change existing method signatures** without major version increment
- ❌ **Remove methods** from contracts (deprecate first)
- ❌ **Change return types** in breaking ways
- ❌ **Modify error handling** contracts without coordination
- ❌ **Bypass contract testing** - all tests must pass

### **ALWAYS Do**
- ✅ **Read contracts first** - Understand requirements before coding
- ✅ **Add methods as optional** - Use optional params/methods for new features  
- ✅ **Test contract compliance** - Run tests before committing
- ✅ **Document changes** - Update JSDoc for all interface changes
- ✅ **Coordinate breaking changes** - Discuss with all module teams

## 🎯 **Success Metrics**

### **Development Velocity**
- **Parallel development** - 4 modules developed simultaneously
- **Zero integration surprises** - Contracts prevent unexpected failures  
- **Fast feature delivery** - New features without breaking existing functionality
- **Confident refactoring** - Contracts enable safe improvements

### **System Reliability**  
- **Zero regression bugs** - New features don't break existing functionality
- **Predictable behavior** - Modules behave as contracts specify
- **Graceful error handling** - Standardized error management across modules
- **Performance consistency** - Contract performance guarantees maintained

## 🔄 **Real-World Usage Example**

### **Scenario: Adding Advanced Quality Control to Duhalde**

#### **Step 1: Analyze Required Interactions**
```typescript
// New feature needs:
// SC360Client: Advanced photo analysis
// ProcessEngine: Quality workflow integration  
// UIComponents: Enhanced quality status display
// ConfigEngine: Quality rule configuration
```

#### **Step 2: Check Existing Contracts**
```typescript
// Read contracts to understand current capabilities
const sc360UIContract = require('./contracts/interfaces/SC360-UIComponents.contract.ts');
const engineConfigContract = require('./contracts/interfaces/ProcessEngine-ConfigEngine.contract.ts');
```

#### **Step 3: Develop Within Contract Constraints**
```typescript
// ✅ Add new optional methods to contracts
interface SC360UIComponentsContract {
  version: '1.2.0';  // Minor increment - new optional features
  
  // Existing required (unchanged)
  updateStatusBadge(status: string, color: string): void;
  
  // New optional quality features
  showQualityAnalysisResult?(analysis: QualityAnalysis): void;
  displayDefectHighlights?(defects: DefectArea[]): void;
}
```

#### **Step 4: Implement Across Modules**
```typescript
// Each module implements enhanced contract
// SC360Client v1.2.0 - adds quality photo analysis
// UIComponents v1.2.0 - adds quality result display
// ProcessEngine v1.2.0 - adds quality workflow steps
// ConfigEngine v1.2.0 - adds quality rule management
```

#### **Step 5: Validate System Integration**
```bash
# Test new quality feature across all modules
npm run test:quality-workflow-integration

# Verify backward compatibility
npm run test:legacy-workflows-still-work
```

## 🎖️ **Benefits Achieved**

### **For Development Teams**
- **Parallel development** without stepping on each other
- **Confident feature addition** - contracts prevent breakage
- **Predictable integration** - interfaces guarantee behavior
- **Faster debugging** - contract violations clearly identified

### **For System Architecture**
- **Modular evolution** - modules can evolve independently
- **Regression prevention** - automated testing prevents breakage
- **Interface stability** - controlled evolution of module boundaries
- **Client confidence** - DuhaldeTracaBeton implementation remains stable

## 🚀 **Quick Start Checklist**

### **Before Starting Any Module Development**
- [ ] Read `contracts/INTERACTION_MAP.md` 
- [ ] Review relevant contract files in `contracts/interfaces/`
- [ ] Understand current version requirements
- [ ] Check existing test coverage for the interaction
- [ ] Identify if your changes will require contract updates

### **During Development**
- [ ] Implement features respecting existing contract methods
- [ ] Add new functionality as optional methods only
- [ ] Write tests validating contract compliance
- [ ] Document new methods with JSDoc
- [ ] Run contract validation tests locally

### **Before Committing**
- [ ] All contract compliance tests pass
- [ ] Cross-module integration tests pass  
- [ ] Backward compatibility verified
- [ ] Contract versions updated if needed
- [ ] Documentation updated

### **AI Agent Specific Checklist**
- [ ] Used Archon to check current module tasks
- [ ] Used `mcp__archon__perform_rag_query()` for contract research
- [ ] Read contract files with `Read()` tool before coding
- [ ] Updated Archon task status throughout development
- [ ] Created Archon documentation for significant contract changes

---

## 💡 **Remember**

**The contract system exists to enable confident, fast, parallel development. When in doubt, err on the side of backward compatibility. It's better to add a new optional method than to modify an existing required one.**

**Success = All modules work together perfectly, even when developed by different teams in parallel.** 🏗️

---

*Safe parallel development through interface contracts - The foundation of reliable modular architecture* 🔗
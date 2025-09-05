# Migration Guide - Legacy to RoR Industrial Suite

## 🎯 **Migration Overview**

This guide explains how to migrate from legacy industrial applications (like the original DuhaldeTracaBeton) to the new **RoR Industrial Suite** architecture.

## 📋 **Migration Checklist**

### **Phase 1: Architecture Analysis**
- [ ] Analyze legacy application structure
- [ ] Identify client-specific vs generic components  
- [ ] Map specialized screens to generic screen types
- [ ] Extract business logic and validation rules
- [ ] Document external system integrations

### **Phase 2: Generic Implementation**
- [ ] Install RoR Industrial Suite base
- [ ] Create client plugin implementation
- [ ] Convert process definitions to JSON templates
- [ ] Implement business rules in plugin system
- [ ] Configure branding and theme system

### **Phase 3: Testing & Validation**
- [ ] Test generic screens with client data
- [ ] Validate business logic through plugin hooks
- [ ] Performance testing vs legacy
- [ ] User acceptance testing
- [ ] Production deployment preparation

## 🔄 **Step-by-Step Migration Process**

### **Step 1: Install RoR Industrial Suite**

```bash
# Create new project directory
mkdir MyCompany-RoR-Implementation
cd MyCompany-RoR-Implementation

# Initialize project
npm init -y

# Install RoR Industrial Suite
npm install @ror-industrial/process-suite
npm install @ror-industrial/sc360-client
npm install @ror-industrial/json-process-engine  
npm install @ror-industrial/industrial-ui-components
npm install @ror-industrial/industrial-config-engine

# Install React Native dependencies
npm install expo react react-native @react-navigation/native
```

### **Step 2: Create Client Plugin**

```typescript
// src/plugins/MyCompanyPlugin.ts
import { 
  ClientPlugin, 
  ClientConfig, 
  ValidationResult 
} from '@ror-industrial/process-suite';

export class MyCompanyPlugin implements ClientPlugin {
  clientId = 'my-company';
  clientName = 'My Manufacturing Company';
  version = '1.0.0';

  private config: ClientConfig;

  constructor() {
    this.config = this.createMyCompanyConfig();
  }

  // Implementation based on legacy business logic
  getConfig(): ClientConfig {
    return this.config;
  }

  // Migrate legacy initialization logic
  async initialize(): Promise<void> {
    console.log('🏭 MyCompany: Initializing manufacturing workflows');
    // Port legacy service initialization here
  }

  // Migrate legacy process start logic
  async onProcessStart(processId: string, data: any): Promise<void> {
    // Port legacy process initialization logic here
  }

  // Migrate legacy validation logic  
  async validateStepData(stepId: string, data: any): Promise<ValidationResult> {
    // Port legacy validation rules here
    return { valid: true, errors: [] };
  }

  // Port legacy custom actions
  async executeCustomAction(actionId: string, data: any): Promise<any> {
    switch (actionId) {
      case 'legacy_action_1':
        // Port legacy functionality here
        break;
      default:
        throw new Error(`Unknown action: ${actionId}`);
    }
  }

  private createMyCompanyConfig(): ClientConfig {
    // Port legacy configuration here
    return {
      clientId: 'my-company',
      clientName: 'My Manufacturing Company',
      industry: 'your-industry', // From legacy
      branding: this.createBrandingFromLegacy(),
      businessRules: this.createBusinessRulesFromLegacy(),
      processTemplates: this.createTemplatesFromLegacy(),
      integrations: this.createIntegrationsFromLegacy(),
      environment: this.createEnvironmentFromLegacy(),
    };
  }
}
```

### **Step 3: Convert Process Definitions**

#### **Legacy Specialized Screen → Generic JSON Template**

**Legacy PC1 Screen:**
```typescript
// Legacy: PC1VerificationEtapeInitialeScreen.tsx
const questions = [
  { id: 'q1', text: 'Moule propre et en bon état ?', type: 'ok_ko' },
  { id: 'q2', text: 'Ferraillage en place ?', type: 'ok_ko' },
];
const nextStep = 'PC2'; // Hardcoded
```

**RoR JSON Template:**
```json
{
  "processId": "my-manufacturing-v1",
  "steps": [
    {
      "id": "initial-check",
      "type": "PointControle",
      "title": "Initial Verification",
      "questions": [
        { "id": "q1", "text": "Mold clean and ready?", "type": "ok_ko" },
        { "id": "q2", "text": "Reinforcement in place?", "type": "ok_ko" }
      ],
      "nextSteps": ["steel-verification"]
    },
    {
      "id": "steel-verification", 
      "type": "PointControle",
      "title": "Steel Verification",
      "questions": [
        { "id": "q3", "text": "Steel quality approved?", "type": "ok_ko" }
      ],
      "nextSteps": ["supervisor-approval"]
    }
  ]
}
```

### **Step 4: Migrate Business Logic**

#### **Legacy Service Logic → Plugin Methods**

**Legacy Service:**
```typescript
// Legacy: src/services/QualityService.ts
export class QualityService {
  static async validateDalleQuality(data: any): Promise<boolean> {
    // Dalle-specific hardcoded validation
    if (data.mouleType === 'DALLE') {
      return data.surfaceQuality === 'good' && data.dimensions === 'ok';
    }
    return false;
  }
}
```

**RoR Plugin Method:**
```typescript
// RoR: MyCompanyPlugin.ts
async validateStepData(stepId: string, data: any): Promise<ValidationResult> {
  const errors: string[] = [];
  
  // Generalized validation (ported from legacy)
  if (data.stepType === 'PointControle') {
    if (!data.surfaceQuality || data.surfaceQuality !== 'good') {
      errors.push('Surface quality must be good');
    }
    if (!data.dimensions || data.dimensions !== 'ok') {
      errors.push('Dimensions must be within tolerance');
    }
  }

  return { valid: errors.length === 0, errors };
}
```

### **Step 5: Configure Branding**

#### **Legacy Styles → RoR Theme System**

**Legacy Hardcoded Styles:**
```typescript
// Legacy: DuhaldeStyles.ts
export const DuhaldeColors = {
  primary: { orange: '#FF6B00' },
  background: { main: '#F8FAFC' },
  // ... hardcoded for Duhalde only
};
```

**RoR Theme Configuration:**
```typescript
// RoR: MyCompanyPlugin.ts - createBrandingFromLegacy()
import { createClientTheme } from '@ror-industrial/industrial-ui-components';

const myTheme = createClientTheme({
  primaryColor: '#FF6B00',        // Port from legacy DuhaldeColors
  companyName: 'My Company',      // Port from legacy
  touchTargetSize: 56,           // Port from legacy requirements
  minFontSize: 18,              // Port from legacy requirements
  customizations: {
    // Additional customizations from legacy styles
    colors: {
      background: { main: '#F8FAFC' }, // From legacy
    },
  },
});
```

### **Step 6: Migrate External Integrations**

#### **Legacy Direct API → RoR Module + Plugin**

**Legacy Direct Integration:**
```typescript
// Legacy: SC360Service.ts - Direct API calls
export class SC360Service {
  static async createAvatar(data: any): Promise<Avatar> {
    // Direct API call with hardcoded business logic
    const response = await fetch('/api/avatars', {
      method: 'POST',
      body: JSON.stringify({
        // Hardcoded Duhalde-specific data
        metadataAvatarType: 'OF:Enveloppe-Dalle-Toit',
        alphaId: 'DALLE',
        // ...
      })
    });
  }
}
```

**RoR Module + Plugin:**
```typescript
// RoR: Use generic module + plugin customization
import { createSC360Client } from '@ror-industrial/sc360-client';

// In plugin executeCustomAction method:
async executeCustomAction(actionId: string, data: any): Promise<any> {
  switch (actionId) {
    case 'create_manufacturing_avatar':
      // Business logic in plugin, API call through module
      const client = createSC360Client(this.config.integrations.sc360);
      return await client.createAvatar({
        // Generic avatar creation with client-specific data
        name: data.name,
        metadataAvatarType: this.getCorrectAvatarType(data.objectType),
        // ...
      });
  }
}
```

## 📚 **Common Migration Patterns**

### **Screen Migration Patterns**

| Legacy Screen Type | RoR Generic Screen | Migration Notes |
|-------------------|-------------------|-----------------|
| `PC1VerificationEtapeInitiale` | `PointControleScreen` | Port questions to JSON template |
| `PC2VerificationAcier` | `PointControleScreen` | Same generic screen, different JSON |
| `PA1ValidationSuperviseur` | `PointArretScreen` | Supervisor approval logic |
| `RedirectScreen` | `JSONDrivenNavigationController` | Logic-based navigation |
| `Custom*Screen` | `PointControleSpeScreen` | Special data capture |

### **Service Migration Patterns**

| Legacy Service | RoR Module | Migration Strategy |
|---------------|------------|-------------------|
| `SC360Service` | `@ror-industrial/sc360-client` | Extract to generic API wrapper |
| `MouleService` | Plugin + `@ror-industrial/industrial-config-engine` | Business logic to plugin |
| `BLService` | Plugin + external adapter | Workflow logic to plugin |
| `AuthService` | Plugin + platform adapter | Auth logic to plugin |

### **Data Migration Patterns**

| Legacy Data | RoR Equivalent | Migration Method |
|-------------|----------------|------------------|
| Hardcoded process steps | JSON process templates | Convert to JSON format |
| Hardcoded validations | Plugin validation methods | Port to plugin code |
| Direct API calls | Module operations | Replace with module calls |
| Static configurations | Dynamic client configuration | Use config engine |

## 🛠️ **Migration Tools & Helpers**

### **Automated Migration Scripts**
```bash
# Script to convert legacy screens to JSON templates
node scripts/legacy-to-json-converter.js ./legacy/screens ./templates

# Script to extract business logic patterns  
node scripts/extract-business-logic.js ./legacy/services ./plugins

# Script to convert styles to theme configuration
node scripts/styles-to-theme.js ./legacy/styles ./branding
```

### **Validation Scripts**
```bash
# Validate migration completeness
npm run validate:migration

# Test legacy vs RoR feature parity
npm run test:feature-parity

# Performance comparison
npm run benchmark:legacy-vs-ror
```

## 🚨 **Migration Pitfalls to Avoid**

### **Common Mistakes**
- ❌ **Direct copying** specialized screens instead of creating generic ones
- ❌ **Hardcoding business logic** in RoR suite instead of plugins
- ❌ **Mixing architectures** - using both legacy and RoR patterns
- ❌ **Incomplete plugin implementation** - missing validation or hooks
- ❌ **Breaking generic design** - adding client-specific code to suite

### **Best Practices**
- ✅ **Extract patterns, not code** - understand logic, reimplement generically
- ✅ **Test thoroughly** - ensure RoR implementation matches legacy behavior
- ✅ **Document business rules** - capture legacy knowledge in plugin code
- ✅ **Progressive migration** - migrate piece by piece with validation
- ✅ **Maintain performance** - benchmark against legacy implementation

## 📊 **Migration Success Metrics**

### **Functionality Parity**
- [ ] All legacy screens/features have RoR equivalent
- [ ] All business logic migrated to plugin system
- [ ] All external integrations working through modules
- [ ] Performance equal or better than legacy
- [ ] User experience maintained or improved

### **Architecture Benefits Achieved**
- [ ] Client-agnostic base created (reusable for other clients)
- [ ] Modular architecture with independent modules
- [ ] Plugin system working for business logic customization
- [ ] JSON-driven configuration eliminating hardcoded behavior
- [ ] Multi-client support demonstrated with test clients

### **Quality Standards Met**
- [ ] Test coverage >90% for migrated functionality
- [ ] Industrial UI standards maintained (≥56px touch, ≥18px fonts)
- [ ] Documentation complete for new architecture
- [ ] CI/CD pipeline operational for all repositories
- [ ] Production deployment ready

---

*Successful migration from legacy to RoR Industrial Suite* 🔄
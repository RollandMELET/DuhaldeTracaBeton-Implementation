# Legacy Projects Reference

## 🔗 **Access to Legacy Projects**

This document provides access to legacy projects for reference during RoR Industrial Suite development.

### **Available Legacy References**

#### **DuhaldeTracaBeton Original (Main Branch)**
- **Path** : `./references/legacy-duhalde-main/`
- **Purpose** : Original Duhalde-specific implementation
- **Key Components** :
  - Specialized screens (PC1, PC2, RedirectScreen)
  - Avatar-centric workflow
  - Direct 360SC integrations
  - DuhaldeStyles.ts original
  - Business logic patterns

#### **RoR-Process-Engine Original**
- **Path** : `./references/legacy-ror-engine/`  
- **Purpose** : Original workflow engine inspiration
- **Key Components** :
  - ProcessEngine core concepts
  - Step execution patterns
  - Original type definitions
  - Workflow navigation logic

### **Legacy Architecture Patterns**

#### **Specialized Screens Pattern (Legacy)**
```typescript
// Legacy approach - specialized screens per process
PC1VerificationEtapeInitialeScreen.tsx     // Dalle step 1
PC2VerificationAcierScreen.tsx             // Dalle step 2  
PC3VerificationScreen.tsx                  // Dalle step 3
Toit_PC1VerificationEtapeInitialeScreen.tsx // Toit step 1
// ... many specialized screens
```

**vs RoR Generic Approach:**
```typescript
// RoR approach - 5 generic screens
PointControleScreen.tsx                     // All quality controls
PointArretScreen.tsx                        // All supervisor validations
PointControleSpeScreen.tsx                  // All special controls
TransitionScreen.tsx                        // All transitions
TerminalScreen.tsx                          // All completions
```

#### **Avatar-Centric Workflow (Legacy)**
```typescript
// Legacy - direct 360SC integration
const avatar = await AvatarService.createAvatar(mouleData);
await SC360Service.changeAvatarNode(avatarId, humanId);
const precast = await AvatarService.searchPrecastInMoule(mouleId);
```

**vs RoR Plugin Approach:**
```typescript
// RoR - through client plugin system
const plugin = pluginManager.getActivePlugin();
await plugin.onProcessStart(processId, data);
await pluginManager.executeCustomAction('create_avatar', data);
```

### **Migration Patterns**

#### **From Specialized to Generic Screens**
```typescript
// Legacy specialized screen
export default function PC1VerificationEtapeInitialeScreen({ mouleId, mouleName }) {
  // Hardcoded questions for PC1 Dalle only
  const questions = [
    { id: 'q1', text: 'Moule propre et en bon état ?', type: 'ok_ko' },
    // ... PC1 specific questions
  ];
  
  const handleValidation = () => {
    // Hardcoded PC1 logic
    SC360Service.changeAvatarNode(avatarId, '0002'); // Hardcoded next step
  };
}
```

**Becomes Generic Screen:**
```typescript
// RoR generic screen  
export default function PointControleScreen({ processStep }) {
  // Dynamic questions from JSON template
  const questions = processStep.questions || [];
  
  const handleValidation = () => {
    // Generic navigation through JSON-driven engine
    await jsonEngine.executeStep(processStep.id, answers);
  };
}
```

#### **From Hardcoded to Plugin-Based Business Logic**
```typescript
// Legacy hardcoded business logic
if (mouleType === 'DALLE') {
  // Dalle-specific validation
  await validateDalleSpecific(data);
} else if (mouleType === 'TOIT') {
  // Toit-specific validation  
  await validateToitSpecific(data);
}
```

**Becomes Plugin System:**
```typescript
// RoR plugin-based business logic
const plugin = pluginManager.getActivePlugin();
const validation = await plugin.validateStepData(stepId, data);
if (!validation.valid) {
  // Handle validation errors generically
}
```

### **Code Reference Examples**

#### **Legacy DuhaldeStyles.ts Usage**
```typescript
// Reference: ./references/legacy-duhalde-main/src/styles/DuhaldeStyles.ts
// Shows original Duhalde branding implementation
export const DuhaldeColors = {
  primary: { orange: '#FF6B00' },
  // ... complete color system
};
```

#### **Legacy Service Patterns**
```typescript  
// Reference: ./references/legacy-duhalde-main/src/services/
// - SC360Service.ts - Direct API integration patterns
// - MouleService.ts - CRUD operations with hardcoded logic
// - BLService.ts - Workflow state management patterns
```

#### **Legacy Process Templates**
```typescript
// Reference: ./references/legacy-duhalde-main/src-ui-engine-separation/assets/
// - ProcessDalle.json - Original process definition
// - ProcessToit.json - Roof manufacturing process  
// - ProcessEnveloppe_V2.json - Envelope process
```

### **When to Use Legacy References**

#### **✅ Good Reference Uses**
- Understanding original business logic patterns
- Extracting forgotten requirements or edge cases
- Validating that RoR implementation covers all features
- Learning from proven UI/UX patterns
- Debugging complex industrial workflows

#### **❌ Avoid Direct Copying**
- Don't copy specialized screens (create generic ones)
- Don't copy hardcoded business logic (use plugins)  
- Don't copy direct API calls (use modules)
- Don't copy client-specific validations (generalize)

### **Reference Commands**

#### **Quick Access**
```bash
# View legacy Duhalde implementation
code ./references/legacy-duhalde-main

# View legacy RoR-Engine
code ./references/legacy-ror-engine

# Compare architectures
diff -r ./references/legacy-duhalde-main/src ./src
```

#### **Specific File References**
```bash
# Legacy vs RoR comparison examples
# Legacy: ./references/legacy-duhalde-main/src/screens/process/PC1VerificationEtapeInitialeScreen.tsx
# RoR:    ./src/screens/PointControleScreen.tsx

# Legacy: ./references/legacy-duhalde-main/src/services/SC360Service.ts  
# RoR:    @ror-industrial/sc360-client module

# Legacy: ./references/legacy-duhalde-main/src/styles/DuhaldeStyles.ts
# RoR:    DuhaldeTracaBeton-Implementation/src/branding/DuhaldeStyles.ts
```

### **Documentation Cross-References**

#### **Architecture Evolution**
- **Legacy** : Monolithic Duhalde-specific application
- **RoR v1** : Generic suite with client plugin system
- **Future** : Multi-client industrial platform

#### **Key Migrations Completed**
- ✅ **Specialized screens** → Generic JSON-driven screens
- ✅ **Hardcoded business logic** → Plugin system
- ✅ **Direct API calls** → Module-based architecture  
- ✅ **Client-specific theming** → Generic theme system
- ✅ **Monolithic repo** → 6 modular repositories

---

*Use legacy references wisely - learn from the past, build for the future* 📚
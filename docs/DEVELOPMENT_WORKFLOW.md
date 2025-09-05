# Development Workflow - Multi-Client Industrial Suite

## 🏭 **Development Scenarios**

This document outlines development workflows for different scenarios in the RoR Industrial ecosystem.

## 🎯 **Scenario 1: Developing the Generic Suite**

### **Working on Base RoR Industrial Suite**
```bash
# Repository: RoR-Industrial-JSONDriven-Process-Suite
cd ~/Projects/RoR-Industrial-JSONDriven-Process-Suite

# Check Archon tasks for generic suite
mcp__archon__list_tasks(project_id="3446cb64-7f7e-4940-85cd-f35bbb65b8f4")

# Development workflow
npm install
npm run dev
npm test
```

### **Common Suite Development Tasks**
- **Adding new generic screen type** (e.g., "PointInspection")
- **Enhancing plugin system** capabilities
- **Improving JSON template validation** 
- **Optimizing generic screen performance**
- **Adding multi-platform support**

### **Suite Development Rules**
- ❌ **NEVER add client-specific logic** to the suite
- ✅ **Always test with multiple client plugins** (Duhalde + TestClient)
- ✅ **Maintain backwards compatibility** for plugin interface
- ✅ **Keep industrial standards** (≥56px touch, ≥18px fonts)

## 🎯 **Scenario 2: Developing Client Implementation**

### **Working on Duhalde Client Implementation**
```bash
# Repository: DuhaldeTracaBeton-Implementation
cd ~/Projects/DuhaldeTracaBeton-Implementation

# Check Archon tasks for Duhalde client
mcp__archon__list_tasks(project_id="9371bf07-c538-4c96-86cc-99e185315d5e")

# Development workflow
npm install
npm run dev:duhalde
npm test
```

### **Common Client Development Tasks**
- **Customizing business logic** in DuhaldeClientPlugin
- **Creating/updating process templates** for concrete manufacturing
- **Standardizing DuhaldeStyles.ts** across all screens
- **Integrating specialized agents** (signalement, BL workflow, moule management)
- **Testing with Duhalde production data**

### **Client Development Rules**
- ✅ **All business logic** goes in ClientPlugin implementation
- ✅ **Use RoR Suite generic screens** - don't create specialized ones
- ✅ **Follow client branding standards** (#FF6B00, touch targets, fonts)
- ❌ **Don't modify** the base RoR Suite from client implementation

## 🎯 **Scenario 3: Developing NPM Modules**

### **Working on SC360Client Module**
```bash
# Repository: @ror-industrial/sc360-client  
cd ~/Projects/ror-industrial-modules/sc360-client

# Check Archon tasks for SC360 module
mcp__archon__list_tasks(project_id="bc6b257b-c375-433b-ad59-fc44c908da71")

# Development workflow
npm install
npm run dev
npm test
npm run test:multi-platform
```

### **Working on ProcessEngine Module**
```bash
# Repository: @ror-industrial/json-process-engine
cd ~/Projects/ror-industrial-modules/json-process-engine

# Check Archon tasks for ProcessEngine module  
mcp__archon__list_tasks(project_id="952b6391-b678-4769-b444-81518af94251")

# Development workflow
npm install
npm run dev
npm test
npm run test:plugins
```

### **Module Development Rules**
- ✅ **Keep modules completely generic** - no client-specific code
- ✅ **Maintain interface compatibility** - avoid breaking changes
- ✅ **Test with multiple clients** - validate genericity
- ✅ **Document everything** - APIs, examples, migration guides

## 🔄 **Cross-Repository Development**

### **Feature Development Across Multiple Repos**

**Example: Adding new process step type "PointMaintenance"**

1. **Define in ProcessEngine module:**
```bash
cd ~/Projects/ror-industrial-modules/json-process-engine
# Add "PointMaintenance" to step types
# Update ProcessEngine to handle new step type
git commit -m "feat: Add PointMaintenance step type"
git push origin main
npm version minor && npm publish
```

2. **Create generic screen in Suite:**
```bash  
cd ~/Projects/RoR-Industrial-JSONDriven-Process-Suite
# Create PointMaintenanceScreen.tsx generic implementation
# Update JSONDrivenNavigationController
git commit -m "feat: Add PointMaintenanceScreen for maintenance workflows"
git push origin main
```

3. **Update client implementation:**
```bash
cd ~/Projects/DuhaldeTracaBeton-Implementation  
# Update DuhaldeClientPlugin with maintenance-specific business logic
# Create maintenance process templates
# Test with Duhalde requirements
git commit -m "feat: Add Duhalde maintenance workflow support"
git push origin main
```

### **Dependency Update Workflow**
```bash
# When modules are updated, update dependent projects

# 1. Update RoR Suite dependencies
cd ~/Projects/RoR-Industrial-JSONDriven-Process-Suite
npm update @ror-industrial/json-process-engine
npm test  # Validate compatibility
git commit -m "deps: Update ProcessEngine to v1.1.0"

# 2. Update client implementations
cd ~/Projects/DuhaldeTracaBeton-Implementation
npm update @ror-industrial/process-suite
npm test  # Validate Duhalde functionality  
git commit -m "deps: Update RoR Suite to v1.1.0"
```

## 🧪 **Testing Workflows**

### **Module Testing**
```bash
# Test individual module
cd ~/Projects/ror-industrial-modules/[module-name]
npm test
npm run test:coverage
npm run test:performance

# Test module integration
npm run test:integration
```

### **Suite Testing**
```bash
# Test generic suite functionality
cd ~/Projects/RoR-Industrial-JSONDriven-Process-Suite
npm test
npm run test:multi-client
npm run test:plugin-system

# Test with real client plugins
npm run test:duhalde-integration
npm run test:steel-works-integration
```

### **Client Testing**
```bash
# Test client implementation
cd ~/Projects/DuhaldeTracaBeton-Implementation
npm test
npm run test:business-logic
npm run test:duhalde-specific

# Test against RoR Suite changes
npm run test:ror-compatibility
```

### **Cross-Repository Testing**
```bash
# Integration testing across all repositories
cd ~/Projects
./scripts/test-full-ecosystem.sh

# Performance benchmarking
./scripts/benchmark-vs-legacy.sh

# Multi-client validation
./scripts/validate-multi-client.sh
```

## 📦 **Release Management**

### **Module Release Process**
1. **Development** in feature branches
2. **Testing** - comprehensive test suite
3. **Versioning** - semantic versioning  
4. **Publishing** - NPM registry publication
5. **Documentation** - Update README and changelogs

### **Suite Release Process**  
1. **Module compatibility** - ensure latest modules work
2. **Plugin interface** - validate backwards compatibility
3. **Generic functionality** - test with multiple clients
4. **Documentation** - update guides and examples
5. **Client notification** - inform client implementations

### **Client Release Process**
1. **Business validation** - test client-specific functionality  
2. **Performance validation** - industrial environment testing
3. **User acceptance** - validation with actual operators
4. **Production deployment** - staged rollout
5. **Monitoring** - post-deployment validation

## 🛠️ **Development Tools & Scripts**

### **Ecosystem Management Scripts**
```bash
# Clone entire ecosystem
./scripts/clone-ecosystem.sh

# Update all repositories  
./scripts/update-all-repos.sh

# Test entire ecosystem
./scripts/test-ecosystem.sh

# Deploy client implementation
./scripts/deploy-client.sh [client-name]
```

### **Module Development Tools**
```bash
# Generate new module skeleton
npm create ror-industrial-module --name=new-module

# Test module compatibility with suite
npm run test:suite-compatibility

# Publish module update
npm run release:module
```

### **Client Development Tools**  
```bash
# Generate new client implementation
npm create ror-industrial-client --name=new-client --industry=manufacturing

# Test client with RoR Suite  
npm run test:ror-integration

# Deploy client to production
npm run deploy:production
```

## 📋 **Development Best Practices**

### **Archon-First Development**
```bash
# ALWAYS start with Archon task management
mcp__archon__list_tasks(project_id="[current-project-id]")
mcp__archon__update_task(task_id="...", status="doing")

# Research before implementation
mcp__archon__perform_rag_query(query="implementation pattern", match_count=5)
mcp__archon__search_code_examples(query="feature implementation", match_count=3)

# Update progress
mcp__archon__update_task(task_id="...", status="review")
```

### **Code Quality Standards**
- **Industrial standards** - ≥56px touch targets, ≥18px fonts
- **TypeScript strict** - Full type safety across all modules
- **Test coverage** - >90% for business logic, >95% for core functionality
- **Documentation** - Comprehensive for all public interfaces
- **Error handling** - Robust error recovery for industrial environments

### **Git Workflow**
```bash
# Feature branch development
git checkout -b feature/new-feature
# Development with frequent commits
git commit -m "feat: Add new feature component"
# Push and create PR
git push origin feature/new-feature
gh pr create --title "feat: Add new feature"
```

### **Communication Between Teams**
- **Archon updates** - Keep Archon tasks updated for visibility
- **Documentation** - Update relevant docs for changes
- **Testing** - Cross-repository testing for breaking changes
- **Versioning** - Coordinate releases across modules

## 🎯 **Success Metrics**

### **Development Velocity**
- **New client** : <1 week from requirements to production
- **New feature** : <2 days for generic implementation 
- **Bug fixes** : <4 hours average resolution time
- **Module updates** : <1 day for compatibility validation

### **Quality Metrics**
- **Test coverage** : >90% across all repositories
- **Performance** : Industrial tablet optimization maintained
- **Accessibility** : 100% compliance with industrial UI standards
- **Documentation** : Complete coverage for all public interfaces

### **Business Impact**
- **Time-to-market** : 90% faster for new industrial clients
- **Code reusability** : 80%+ shared across all clients
- **Maintenance efficiency** : Centralized updates benefit all clients
- **Scalability** : Unlimited client implementations supported

---

*Efficient development workflow for industrial manufacturing excellence* 🛠️
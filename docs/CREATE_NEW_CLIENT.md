# Creating a New Industrial Client

## 🏭 **Step-by-Step Guide to Create Your Industrial Client**

This guide shows how to create a new industrial client implementation using the RoR Industrial Suite.

## 🎯 **Prerequisites**

- RoR Industrial Suite installed
- Understanding of your manufacturing process
- Basic TypeScript/React Native knowledge
- Industrial requirements defined (touch targets, fonts, etc.)

## 📋 **Step 1: Client Plugin Implementation**

Create your client plugin by implementing the `ClientPlugin` interface:

```typescript
// src/plugins/MyCompanyPlugin.ts
import { 
  ClientPlugin, 
  ClientConfig, 
  ValidationResult 
} from '@ror-industrial/process-suite';
import { createClientTheme } from '@ror-industrial/industrial-ui-components';

export class MyCompanyPlugin implements ClientPlugin {
  clientId = 'my-company';
  clientName = 'My Manufacturing Company';
  version = '1.0.0';

  private config: ClientConfig;

  constructor() {
    this.config = this.createMyCompanyConfig();
  }

  getConfig(): ClientConfig {
    return this.config;
  }

  async initialize(): Promise<void> {
    console.log('🏭 MyCompany: Initializing manufacturing workflows');
    // Initialize your company-specific services
  }

  async cleanup(): Promise<void> {
    console.log('🧹 MyCompany: Cleaning up');
    // Cleanup company-specific resources
  }

  // Implement business logic hooks
  async onProcessStart(processId: string, data: any): Promise<void> {
    // Your process start logic
  }

  async onStepComplete(stepId: string, data: any): Promise<void> {
    // Your step completion logic
  }

  // Implement validation hooks  
  async validateStepData(stepId: string, data: any): Promise<ValidationResult> {
    // Your validation logic
    return { valid: true, errors: [] };
  }

  // Implement custom actions
  async executeCustomAction(actionId: string, data: any): Promise<any> {
    switch (actionId) {
      case 'my_custom_action':
        return await this.handleCustomAction(data);
      default:
        throw new Error(`Unknown action: ${actionId}`);
    }
  }

  private createMyCompanyConfig(): ClientConfig {
    // Create your client configuration
    const myTheme = createClientTheme({
      primaryColor: '#YOUR_COLOR',
      companyName: 'My Manufacturing Company',
      touchTargetSize: 56,
      minFontSize: 18,
    });

    return {
      clientId: 'my-company',
      clientName: 'My Manufacturing Company',
      industry: 'your-industry',
      branding: {
        theme: myTheme,
        companyName: 'My Manufacturing Company',
        companyColors: { primary: '#YOUR_COLOR' },
        touchTargetSize: 56,
        minFontSize: 18,
        displaySettings: {
          orientation: 'landscape',
          targetResolution: '1280x800',
          deviceType: 'tablet',
        },
      },
      businessRules: this.createMyBusinessRules(),
      processTemplates: this.createMyProcessTemplates(),
      integrations: this.createMyIntegrations(),
      environment: this.createMyEnvironment(),
    };
  }

  // Implement other helper methods...
}
```

## 📋 **Step 2: Process Templates**

Create your manufacturing process templates:

```json
// assets/my-company/my-manufacturing-process.json
{
  "processId": "my-manufacturing-v1",
  "processName": "My Manufacturing Process",
  "processType": "ASSEMBLY",
  "steps": [
    {
      "id": "initial-check",
      "type": "PointControle",
      "title": "Initial Quality Check",
      "questions": [
        {
          "id": "materials-check",
          "text": "All materials available and inspected?",
          "type": "ok_ko",
          "required": true
        },
        {
          "id": "equipment-ready",
          "text": "Equipment calibrated and ready?", 
          "type": "ok_ko",
          "required": true
        }
      ],
      "nextSteps": ["supervisor-approval"]
    },
    {
      "id": "supervisor-approval",
      "type": "PointArret",
      "title": "Supervisor Approval",
      "supervisorRequired": true,
      "nextSteps": ["production-start"]
    },
    {
      "id": "production-start",
      "type": "Transition", 
      "title": "Begin Production",
      "nextSteps": ["final-inspection"]
    },
    {
      "id": "final-inspection",
      "type": "PointControleSpe",
      "title": "Final Quality Inspection",
      "photoRequired": true,
      "questions": [
        {
          "id": "final-quality",
          "text": "Final product meets specifications?",
          "type": "ok_ko",
          "required": true
        }
      ],
      "nextSteps": ["process-complete"]
    },
    {
      "id": "process-complete",
      "type": "Terminal",
      "title": "Production Complete"
    }
  ]
}
```

## 🎨 **Step 3: Branding Customization**

Configure your company branding:

```typescript
// Branding configuration
const myBranding = {
  theme: createClientTheme({
    primaryColor: '#YOUR_PRIMARY_COLOR',
    companyName: 'Your Company Name',
    touchTargetSize: 56,        // Adjust for your glove requirements
    minFontSize: 18,           // Adjust for your visibility requirements
  }),
  companyName: 'Your Company Name',
  companyColors: {
    primary: '#YOUR_PRIMARY_COLOR',
    secondary: '#YOUR_SECONDARY_COLOR',
    accent: '#YOUR_ACCENT_COLOR',
  },
  displaySettings: {
    orientation: 'landscape',   // or 'portrait' or 'both'
    targetResolution: '1280x800', // Your target tablet resolution
    deviceType: 'tablet',      // or 'phone' or 'desktop'
  },
};
```

## 🔧 **Step 4: Business Rules Configuration**

Define your industry-specific business rules:

```typescript
// Business rules for your industry
const myBusinessRules: BusinessRuleSet = {
  validators: [
    {
      id: 'my_validator',
      name: 'My Custom Validator',
      description: 'Validates data specific to my industry',
      applicableSteps: ['PointControle'],
      validationFunction: (data: any) => {
        // Your validation logic here
        const isValid = /* your logic */;
        return {
          valid: isValid,
          errors: isValid ? [] : ['Custom validation failed']
        };
      }
    }
  ],
  stepCompletionRules: [
    {
      stepType: 'PointArret',
      requiredFields: ['supervisorId', 'timestamp'],
      requiresSupervisorApproval: true,
    }
  ],
  qualityRules: [
    {
      id: 'my_quality_rule',
      name: 'My Quality Rule',
      triggerConditions: ['quality_issue_detected'],
      actions: [
        {
          type: 'alert',
          target: 'quality_system',
          data: { severity: 'high' }
        }
      ]
    }
  ],
  workflowRules: [],
  customHandlers: []
};
```

## 🔗 **Step 5: Integration Setup**

Configure your external system integrations:

```typescript
// External integrations
const myIntegrations = {
  externalSystems: [
    {
      id: 'my_erp',
      name: 'My ERP System',
      type: 'erp',
      enabled: true,
      config: {
        baseUrl: 'https://erp.mycompany.com',
        apiKey: 'your-api-key'
      },
      endpoints: []
    }
  ],
  apis: [
    {
      id: 'my_api',
      name: 'My Company API',
      baseUrl: 'https://api.mycompany.com',
      authentication: {
        type: 'bearer',
        config: { tokenEndpoint: '/auth/token' }
      },
      timeout: 30000
    }
  ],
  notifications: [
    {
      id: 'my_notifications',
      type: 'webhook',
      enabled: true,
      config: {
        url: 'https://notifications.mycompany.com/webhook'
      }
    }
  ]
};
```

## 📱 **Step 6: Register and Use Your Client**

Register your client plugin with the RoR Industrial Suite:

```typescript
// App.tsx or your main application file
import React, { useEffect } from 'react';
import { ClientPluginManager } from '@ror-industrial/process-suite';
import { MyCompanyPlugin } from './src/plugins/MyCompanyPlugin';

function App() {
  useEffect(() => {
    // Initialize plugin manager
    const pluginManager = new ClientPluginManager();
    
    // Register your client plugin
    const myPlugin = new MyCompanyPlugin();
    pluginManager.registerPlugin(myPlugin);
    
    // Activate your client
    pluginManager.activateClient('my-company');
    
    console.log('🎉 My Company client activated!');
  }, []);

  return (
    // Your app components using the customized RoR Industrial Suite
  );
}
```

## 🧪 **Step 7: Test Your Implementation**

Test your client with the generic screens:

```typescript
// Test your client configuration
import { ClientPluginManager } from '@ror-industrial/process-suite';
import { MyCompanyPlugin } from './src/plugins/MyCompanyPlugin';

async function testMyClient() {
  const pluginManager = new ClientPluginManager();
  const myPlugin = new MyCompanyPlugin();
  
  // Register and activate
  pluginManager.registerPlugin(myPlugin);
  await pluginManager.activateClient('my-company');
  
  // Test business logic hooks
  await pluginManager.onProcessStart('my-process', { productType: 'assembly' });
  
  // Test validation
  const validation = await pluginManager.validateStepData('step1', { 
    temperature: 1100,
    quality: 'good'
  });
  
  console.log('Validation result:', validation);
  
  // Test custom actions
  const result = await pluginManager.executeCustomAction('my_custom_action', {
    action: 'test'
  });
  
  console.log('Custom action result:', result);
}
```

## 📚 **Step 8: Documentation**

Document your client implementation:

1. **README.md** - Overview and setup instructions
2. **BUSINESS_RULES.md** - Your industry-specific rules
3. **PROCESS_TEMPLATES.md** - Your process documentation
4. **INTEGRATION_GUIDE.md** - External system integration
5. **DEPLOYMENT.md** - Production deployment instructions

## 🎉 **You're Done!**

Your industrial client is now ready to use the RoR Industrial Suite with full customization!

## 📋 **Checklist**

- [ ] ClientPlugin class implemented
- [ ] Client configuration defined  
- [ ] Process templates created
- [ ] Business rules configured
- [ ] External integrations setup
- [ ] Branding customized
- [ ] Plugin registered and tested
- [ ] Documentation created

## 💡 **Tips**

1. **Start simple** - Begin with basic configuration and add complexity gradually
2. **Test with generic screens** - Use the 5 generic screens to validate your setup  
3. **Follow industrial standards** - Minimum 56px touch targets, 18px fonts
4. **Use existing examples** - Reference Duhalde and TestClient plugins
5. **Validate early** - Test validation rules with your actual data
6. **Document everything** - Future developers will thank you

---

*Welcome to the RoR Industrial ecosystem! 🏭*
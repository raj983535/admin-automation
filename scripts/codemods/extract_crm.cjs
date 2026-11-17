const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('e:/college-automation/src/pages/CrmPage.tsx', 'utf8');

// Extract types
const typeMatch = content.match(/export type LeadStage[\s\S]*?export interface StudentLead[^{]*\{[\s\S]*?\n\}/);
if (typeMatch) {
  fs.writeFileSync('e:/college-automation/src/types/crm.types.ts', typeMatch[0] + '\n');
}

// Extract mock data
const mockMatch = content.match(/const INITIAL_LEADS: StudentLead\[\] = \[[\s\S]*?\n\];/);
if (mockMatch) {
  let mockContent = "import type { StudentLead } from '../types/crm.types';\n\nexport " + mockMatch[0] + '\n';
  fs.writeFileSync('e:/college-automation/src/mock/crm.mock.ts', mockContent);
}

// Create service
const serviceContent = `import type { StudentLead } from '../types/crm.types';
import { INITIAL_LEADS } from '../mock/crm.mock';

class CrmService {
  async getLeads(): Promise<StudentLead[]> {
    // Simulate network latency for modular SaaS readiness
    return new Promise((resolve) => setTimeout(() => resolve([...INITIAL_LEADS]), 600));
  }
}

export const crmService = new CrmService();
`;
fs.writeFileSync('e:/college-automation/src/services/crm.service.ts', serviceContent);
console.log('CRM Extracted successfully.');

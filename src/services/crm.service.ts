import type { StudentLead } from '../types/crm.types';
import { INITIAL_LEADS } from '../mock/crm.mock';

class CrmService {
  async getLeads(): Promise<StudentLead[]> {
    // Simulate network latency for modular SaaS readiness
    return new Promise((resolve) => setTimeout(() => resolve([...INITIAL_LEADS]), 600));
  }
}

export const crmService = new CrmService();

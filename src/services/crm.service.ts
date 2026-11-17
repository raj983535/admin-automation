import type { StudentLead } from '../types/crm.types';
import { INITIAL_LEADS } from '../mock/crm.mock';

class CrmService {
  async getLeads(): Promise<StudentLead[]> {
    // Return mock data instantly for demo presentation
    return Promise.resolve([...INITIAL_LEADS]);
  }
}

export const crmService = new CrmService();

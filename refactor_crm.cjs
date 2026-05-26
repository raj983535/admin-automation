const fs = require('fs');

let content = fs.readFileSync('e:/college-automation/src/pages/CrmPage.tsx', 'utf8');

// 1. Remove types
content = content.replace(/export type LeadStage[\s\S]*?export interface StudentLead[^{]*\{[\s\S]*?\n\}/, "import type { LeadStage, StudentLead } from '../types/crm.types';");

// 2. Remove INITIAL_LEADS
content = content.replace(/const INITIAL_LEADS: StudentLead\[\] = \[[\s\S]*?\n\];/, "import { crmService } from '../services/crm.service';");

// 3. Update the component to use the service
content = content.replace(
  /const \[leads, setLeads\] = useState<StudentLead\[\]>\(INITIAL_LEADS\);/,
  `const [leads, setLeads] = useState<StudentLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const data = await crmService.getLeads();
      setLeads(data);
      setIsLoading(false);
    };
    fetchLeads();
  }, []);`
);

// We need to add useEffect to imports if it's not there.
if (!content.includes('useEffect')) {
  content = content.replace(/import React, \{ useState/g, 'import React, { useState, useEffect');
}

fs.writeFileSync('e:/college-automation/src/pages/CrmPage.tsx', content, 'utf8');
console.log('CRM component refactored successfully.');

const fs = require('fs');

let content = fs.readFileSync('e:/college-automation/src/pages/CrmPage.tsx', 'utf8');

// Remove interface StudentLead and TimelineEvent (optional but cleaner to just remove StudentLead)
content = content.replace(/interface StudentLead \{[\s\S]*?\n\}/, "import type { StudentLead } from '../types/crm.types';");

// Make sure the import of crmService is there, my previous script had a bug where it might not have placed it at top if the array replacement was weird
if (!content.includes('import { crmService }')) {
  content = content.replace(/import styles from '\.\/CrmPage\.module\.css';/, "import styles from './CrmPage.module.css';\nimport { crmService } from '../services/crm.service';");
}

fs.writeFileSync('e:/college-automation/src/pages/CrmPage.tsx', content, 'utf8');
console.log('CRM fixed imports.');

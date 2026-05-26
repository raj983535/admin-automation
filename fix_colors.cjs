const fs = require('fs');
const path = require('path');

const dir = 'e:/college-automation/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let changed = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // ManageStaffPage - Roles
  content = content.replace(/'#ef4444'/g, "'var(--stage-red-text)'");
  content = content.replace(/'#8b5cf6'/g, "'var(--stage-purple-text)'");
  content = content.replace(/'#3b82f6'/g, "'var(--stage-blue-text)'");
  content = content.replace(/'#10b981'/g, "'var(--stage-green-text)'");
  content = content.replace(/'#f97316'/g, "'var(--stage-orange-text)'");
  content = content.replace(/'#9ca3af'/g, "'var(--stage-gray-text)'");
  
  // Project Management - Priorities
  content = content.replace(/'#fee2e2'/g, "'var(--stage-red-bg)'");
  content = content.replace(/'#b91c1c'/g, "'var(--stage-red-text)'");
  
  // Vault Action Logs
  content = content.replace(/'#f3eff9'/g, "'var(--stage-purple-bg)'");
  content = content.replace(/'#6b4f8a'/g, "'var(--stage-purple-text)'");
  content = content.replace(/'#eef6f0'/g, "'var(--stage-green-bg)'");
  content = content.replace(/'#3d7a52'/g, "'var(--stage-green-text)'");
  content = content.replace(/'#eef4fb'/g, "'var(--stage-blue-bg)'");
  content = content.replace(/'#3d6b9e'/g, "'var(--stage-blue-text)'");

  // Workflow Automation
  content = content.replace(/'#a855f7'/g, "'var(--stage-purple-text)'");
  content = content.replace(/'#eab308'/g, "'var(--stage-yellow-text)'");
  content = content.replace(/'#22c55e'/g, "'var(--stage-green-text)'");
  content = content.replace(/'#6b7280'/g, "'var(--stage-gray-text)'");
  content = content.replace(/'#dbeafe'/g, "'var(--stage-blue-bg)'");
  content = content.replace(/'#f3e8ff'/g, "'var(--stage-purple-bg)'");
  content = content.replace(/'#ffedd5'/g, "'var(--stage-orange-bg)'");
  content = content.replace(/'#fef9c3'/g, "'var(--stage-yellow-bg)'");
  content = content.replace(/'#dcfce7'/g, "'var(--stage-green-bg)'");
  content = content.replace(/'#f3f4f6'/g, "'var(--stage-gray-bg)'");
  content = content.replace(/'#1e40af'/g, "'var(--stage-blue-text)'");
  content = content.replace(/'#6b21a8'/g, "'var(--stage-purple-text)'");
  content = content.replace(/'#9a3412'/g, "'var(--stage-orange-text)'");
  content = content.replace(/'#854d0e'/g, "'var(--stage-yellow-text)'");
  content = content.replace(/'#166534'/g, "'var(--stage-green-text)'");
  content = content.replace(/'#374151'/g, "'var(--stage-gray-text)'");

  // Misc Hardcoded Whites & Beiges
  content = content.replace(/'#ffffff'/g, "'var(--color-bg-card)'");
  content = content.replace(/'#faf9f6'/g, "'var(--color-bg-input)'");
  content = content.replace(/'#e5e1d9'/g, "'var(--color-border)'");
  content = content.replace(/'#6b5e52'/g, "'var(--color-muted-brown)'");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    changed++;
    console.log('Fixed hex colors in:', file);
  }
}

console.log('Total fixed:', changed);

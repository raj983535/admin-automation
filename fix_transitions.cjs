const fs = require('fs');
const path = require('path');

const dir = 'e:/college-automation/src';

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.css')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(dir);
let changed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Fix the broken transitions caused by PowerShell eating the $1 variable
  // We'll replace it with var(--transition-fast) which is 150ms ease
  content = content.replace(/transition:\s*background-color\s*,\s*border-color\s*,\s*color\s*,\s*opacity\s*,\s*box-shadow\s*,\s*transform\s*(ease)?;/g, 'transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), opacity var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log('Fixed:', path.basename(file));
  }
}

console.log('Total fixed files:', changed);

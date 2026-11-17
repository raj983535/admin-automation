const fs = require('fs');
const path = require('path');

const fixImports = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      // Replace ../components/layout with ../layouts
      content = content.replace(/\.\.\/components\/layout\/AppShell/g, '../layouts/AppShell');
      content = content.replace(/\.\.\/components\/layout/g, '../layouts');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed imports in:', fullPath);
      }
    }
  }
};

fixImports('e:/college-automation/src/pages');
fixImports('e:/college-automation/src/routes');

console.log('Done fixing imports.');

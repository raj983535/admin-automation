const fs = require('fs');
const path = require('path');

const fixLayoutImports = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixLayoutImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      // Fix UI components imports
      content = content.replace(/\.\.\/\.\.\/ui\//g, '../../components/ui/');
      
      // Fix config, hooks, contexts imports
      content = content.replace(/\.\.\/\.\.\/\.\.\/config/g, '../../config');
      content = content.replace(/\.\.\/\.\.\/\.\.\/hooks/g, '../../hooks');
      content = content.replace(/\.\.\/\.\.\/\.\.\/contexts/g, '../../contexts');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed internal imports in:', fullPath);
      }
    }
  }
};

fixLayoutImports('e:/college-automation/src/layouts');

console.log('Done fixing layouts.');

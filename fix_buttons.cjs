const fs = require('fs');
const path = require('path');

const dir = 'e:/college-automation/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let changed = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const regex = /<button(?![^>]*\btype=)([^>]*)>/g;
  
  if (regex.test(content)) {
    const newContent = content.replace(regex, '<button type="button"$1>');
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      changed++;
      console.log('Fixed', file);
    }
  }
}

console.log(`Updated ${changed} files with missing type="button".`);

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
    } else if (filePath.endsWith('.css') || filePath.endsWith('.tsx')) {
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
  
  // Replace transition: all with explicit properties
  content = content.replace(/transition:\s*all\s+(var\(--transition-[^)]+\))/g, 'transition: background-color , border-color , color , opacity , box-shadow , transform ');
  
  // Remove backdrop-filter which causes severe scroll jank
  content = content.replace(/backdrop-filter:\s*blur\([^)]+\);?/g, '');
  
  // Replace semi-transparent background on overlays with slightly darker one since blur is removed
  content = content.replace(/rgba\(74,\s*64,\s*56,\s*0\.4\)/g, 'rgba(40, 30, 25, 0.6)');
  content = content.replace(/rgba\(0,\s*0,\s*0,\s*0\.4\)/g, 'rgba(0, 0, 0, 0.6)');
  content = content.replace(/rgba\(0,\s*0,\s*0,\s*0\.5\)/g, 'rgba(0, 0, 0, 0.7)');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log('Optimized:', path.basename(file));
  }
}

console.log('Total optimized files:', changed);


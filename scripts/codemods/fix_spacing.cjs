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

  // Replace common padding/margin pixel values
  content = content.replace(/:\s*4px/g, ": var(--space-1)");
  content = content.replace(/:\s*8px/g, ": var(--space-2)");
  content = content.replace(/:\s*12px/g, ": var(--space-3)");
  content = content.replace(/:\s*16px/g, ": var(--space-4)");
  content = content.replace(/:\s*20px/g, ": var(--space-5)");
  content = content.replace(/:\s*24px/g, ": var(--space-6)");
  content = content.replace(/:\s*32px/g, ": var(--space-8)");

  // Careful with the above - it might break non-padding things like borders or font sizes if they happen to match.
  // To be safe, only replace padding and margin values:
  // We'll roll back the broad replace and do targeted ones.
  content = original;

  const replaceTargeted = (prop, px, token) => {
    const regex = new RegExp(`(${prop}(?:-[a-z]+)?):\\s*${px}px(?![0-9])`, 'g');
    content = content.replace(regex, `$1: var(${token})`);
    
    // Also catch multiple values like padding: 12px 16px
    const regexMulti1 = new RegExp(`(${prop}(?:-[a-z]+)?):\\s*([a-z0-9-()., ]+)\\s+${px}px`, 'g');
    content = content.replace(regexMulti1, `$1: $2 var(${token})`);
    
    const regexMulti2 = new RegExp(`(${prop}(?:-[a-z]+)?):\\s*${px}px\\s+([a-z0-9-()., ]+)`, 'g');
    content = content.replace(regexMulti2, `$1: var(${token}) $2`);
  };

  const props = ['padding', 'margin', 'gap'];
  props.forEach(p => {
    replaceTargeted(p, 4, '--space-1');
    replaceTargeted(p, 8, '--space-2');
    replaceTargeted(p, 12, '--space-3');
    replaceTargeted(p, 16, '--space-4');
    replaceTargeted(p, 20, '--space-5');
    replaceTargeted(p, 24, '--space-6');
    replaceTargeted(p, 32, '--space-8');
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log('Fixed spacing in:', path.basename(file));
  }
}

console.log('Total fixed spacing:', changed);

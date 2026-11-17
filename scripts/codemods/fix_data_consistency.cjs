const fs = require('fs');
const path = require('path');

const dir = 'e:/college-automation/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let changed = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Standardize Students
  content = content.replace(/'Aditya Sen'/g, "'Sahil Sharma'");
  content = content.replace(/'Amit Shah'/g, "'Arjun Singhal'");
  content = content.replace(/'Vikram Seth'/g, "'Kabir Malhotra'");
  content = content.replace(/'Amit Verma'/g, "'Kabir Malhotra'");
  content = content.replace(/'Raj Singh'/g, "'Arjun Singhal'");
  content = content.replace(/'Pooja Sen'/g, "'Priya Pillai'");
  content = content.replace(/'Kunal Roy'/g, "'Sahil Sharma'");
  content = content.replace(/'Amit Mishra'/g, "'Sahil Sharma'");
  content = content.replace(/'Tanvi Shah'/g, "'Ananya Iyer'");
  content = content.replace(/'Priyanshu Roy'/g, "'Kabir Malhotra'");
  content = content.replace(/'Sneha Gupta'/g, "'Priya Pillai'");
  content = content.replace(/'Emma Watson'/g, "'Ananya Iyer'");
  content = content.replace(/'John Doe'/g, "'Arjun Singhal'");

  // In FinanceManagementPage, Meera Deshmukh is listed as student but she is Registrar. Fix it.
  if (file === 'FinanceManagementPage.tsx') {
    content = content.replace(/studentName:\s*'Meera Deshmukh'/g, "studentName: 'Ananya Iyer'");
    content = content.replace(/studentName:\s*'Rohan Verma'/g, "studentName: 'Kabir Malhotra'");
  }
  
  if (file === 'CrmPage.tsx') {
    // Meera is registrar, Rohan is finance, replace them in CRM leads
    content = content.replace(/name:\s*'Meera Deshmukh'/g, "name: 'Priya Pillai'");
    content = content.replace(/name:\s*'Rohan Verma'/g, "name: 'Sahil Sharma'");
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    changed++;
    console.log('Fixed data in:', file);
  }
}

console.log('Total fixed:', changed);

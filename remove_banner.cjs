const fs = require('fs');

function removeSection(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find index of "<!-- UPGRADED GREEN CTA SECTION -->"
  let startIndex = content.indexOf('<!-- UPGRADED GREEN CTA SECTION -->');
  if (startIndex === -1) {
    console.log(`Section not found in ${file}`);
    return;
  }
  
  // Find index of "<!-- EU LOGOS SECTION -->"
  let endIndex = content.indexOf('<!-- EU LOGOS SECTION -->');
  if (endIndex === -1) {
    console.log(`End Section not found in ${file}`);
    return;
  }
  
  // Remove everything between them
  content = content.slice(0, startIndex) + content.slice(endIndex);
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Removed banner from ${file}`);
}

removeSection('index.html');
removeSection('pl/index.html');

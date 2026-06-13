const fs = require('fs');

const files=['index.html','kontakt.html','o-nas.html','oferta.html','privacy-policy.html','projekty-eu.html','pl/index.html','pl/kontakt.html','pl/o-nas.html','pl/oferta.html','pl/polityka-prywatnosci.html','pl/projekty-eu.html'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/v=50/g, 'v=51');
    fs.writeFileSync(f, content, 'utf8');
  }
});
console.log('Updated v=51');

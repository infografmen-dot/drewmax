import fs from 'fs';

const plFiles = ['pl/index.html', 'pl/kontakt.html', 'pl/o-nas.html', 'pl/oferta.html', 'pl/polityka-prywatnosci.html', 'pl/projekty-eu.html'];

plFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/VAT ID \/ NIP:/g, 'NIP:');
    fs.writeFileSync(f, content, 'utf8');
  }
});
console.log('Fixed NIP');

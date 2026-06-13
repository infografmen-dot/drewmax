import fs from 'fs';

const files = [
  'index.html', 'kontakt.html', 'o-nas.html', 'oferta.html', 'privacy-policy.html', 'projekty-eu.html',
  'pl/index.html', 'pl/kontakt.html', 'pl/o-nas.html', 'pl/oferta.html', 'pl/polityka-prywatnosci.html', 'pl/projekty-eu.html'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/v=58/g, 'v=59');
    fs.writeFileSync(f, content, 'utf8');
  }
});
console.log('Updated v=59 in all HTML files');

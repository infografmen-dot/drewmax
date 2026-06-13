import fs from 'fs';

const enFiles = ['index.html', 'kontakt.html', 'o-nas.html', 'oferta.html', 'privacy-policy.html', 'projekty-eu.html'];
const plFiles = ['pl/index.html', 'pl/kontakt.html', 'pl/o-nas.html', 'pl/oferta.html', 'pl/polityka-prywatnosci.html', 'pl/projekty-eu.html'];

enFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix anchors and EN translation for products
    content = content.replace(/href="oferta\.html#(?:plastikowe|plastic)">Szczotki Plastikowe/g, 'href="oferta.html#plastic">Plastic Brushes');
    content = content.replace(/href="oferta\.html#(?:wewnetrzne|indoor)">Szczotki Wewnętrzne/g, 'href="oferta.html#indoor">Indoor Wooden Brushes');
    content = content.replace(/href="oferta\.html#(?:zewnetrzne|outdoor)">Szczotki Zewnętrzne/g, 'href="oferta.html#outdoor">Outdoor Wooden Brushes');
    content = content.replace(/href="oferta\.html#(?:techniczne|technical)">(?:Szczotki Techniczne|Technical Brushes)/g, 'href="oferta.html#technical">Technical Brushes');
    content = content.replace(/href="oferta\.html#(?:galanteria|accessories)">(?:Galanteria Drzewna|Wooden Accessories)/g, 'href="oferta.html#accessories">Wooden Accessories');

    // Also just check if hrefs need fixing without text replacing
    content = content.replace(/href="oferta\.html#plastikowe"/g, 'href="oferta.html#plastic"');
    content = content.replace(/href="oferta\.html#wewnetrzne"/g, 'href="oferta.html#indoor"');
    content = content.replace(/href="oferta\.html#zewnetrzne"/g, 'href="oferta.html#outdoor"');
    content = content.replace(/href="oferta\.html#techniczne"/g, 'href="oferta.html#technical"');
    content = content.replace(/href="oferta\.html#galanteria"/g, 'href="oferta.html#accessories"');

    fs.writeFileSync(f, content, 'utf8');
  }
});

plFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');

    // Fix anchors for PL, keep PL names
    content = content.replace(/href="oferta\.html#plastikowe"/g, 'href="oferta.html#plastic"');
    content = content.replace(/href="oferta\.html#wewnetrzne"/g, 'href="oferta.html#indoor"');
    content = content.replace(/href="oferta\.html#zewnetrzne"/g, 'href="oferta.html#outdoor"');
    content = content.replace(/href="oferta\.html#techniczne"/g, 'href="oferta.html#technical"');
    content = content.replace(/href="oferta\.html#galanteria"/g, 'href="oferta.html#accessories"');

    // Fix PL Text in Footer (and anywhere else if matched, which is fine)
    content = content.replace(/Polski producent szczotek drewnianych i plastikowych oraz komponentów z drewna tokarskiego\.\s*Ponad 30 years of family craftsmanship and premium FSC beechwood quality\./g, 'Polski producent szczotek drewnianych i plastikowych oraz komponentów z drewna tokarskiego. Ponad 30 lat rodzinnego rzemiosła i najwyższej jakości drewna bukowego FSC.');
    content = content.replace(/Ponad 30 years of family craftsmanship and premium FSC beechwood quality\./g, 'Ponad 30 lat rodzinnego rzemiosła i najwyższej jakości drewna bukowego FSC.');

    content = content.replace(/<h4>Nawigacja<\/h4>\s*<ul class="footer-links">\s*<li><a href="index\.html">Home<\/a><\/li>\s*<li><a href="oferta\.html">Produkty<\/a><\/li>\s*<li><a href="o-nas\.html">About Us<\/a><\/li>\s*<li><a href="projekty-eu\.html">EU Projects<\/a><\/li>\s*<li><a href="kontakt\.html">Kontakt<\/a><\/li>\s*<\/ul>/g, `<h4>Nawigacja</h4>
          <ul class="footer-links">
            <li><a href="index.html">Strona Główna</a></li>
            <li><a href="oferta.html">Produkty</a></li>
            <li><a href="o-nas.html">O Nas</a></li>
            <li><a href="projekty-eu.html">Projekty UE</a></li>
            <li><a href="kontakt.html">Kontakt</a></li>
          </ul>`);
    
    // In case it didn't match the exact block:
    content = content.replace(/>Home<\/a><\/li>/g, '>Strona Główna</a></li>');
    content = content.replace(/>About Us<\/a><\/li>/g, '>O Nas</a></li>');
    content = content.replace(/>EU Projects<\/a><\/li>/g, '>Projekty UE</a></li>');

    // Fix Poland -> Polska in contacts
    content = content.replace(/Poland(\s*<\/span>)/g, 'Polska$1');
    content = content.replace(/Expert Manager:/g, 'Doradca Klienta:');

    fs.writeFileSync(f, content, 'utf8');
  }
});

console.log('Translations and links updated!');

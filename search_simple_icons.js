import https from 'https';

https.get('https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/_data/simple-icons.json', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const p = JSON.parse(data);
      console.log('p.icons type:', Array.isArray(p.icons));
      if (p.icons) {
        console.log('Sample icon:', p.icons[0]);
        // list all icon titles that have "forest" or "steward" or "wood" or "eco" or "tree"
        const filtered = p.icons.filter(i => {
          const t = i.title.toLowerCase();
          return t.includes('eco') || t.includes('tree') || t.includes('wood') || t.includes('green') || t.includes('cert');
        });
        console.log('Filtered icons matches:', filtered.slice(0, 30));
      }
    } catch(e) {
      console.log('Error parsing:', e);
    }
  });
}).on('error', (err) => {
  console.error(err);
});

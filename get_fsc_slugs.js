import https from 'https';

https.get('https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/_data/simple-icons.json', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const p = JSON.parse(data);
      const icons = p.icons;
      console.log('Total icons in simple-icons json:', icons.length);
      const matching = icons.filter(i => {
        const title = i.title.toLowerCase();
        const slug = (i.slug || '').toLowerCase();
        return title.includes('fsc') || slug.includes('fsc') || title.includes('stewardship') || slug.includes('stewardship') || title.includes('forest');
      });
      console.log('Matching icons:', matching);
    } catch(e) {
      console.log('Error:', e);
    }
  });
}).on('error', (err) => {
  console.error(err);
});

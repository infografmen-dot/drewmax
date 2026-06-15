import https from 'https';

https.get('https://cdn.jsdelivr.net/npm/simple-icons/data/simple-icons.json', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const keys = Object.keys(parsed);
      console.log('Total keys:', keys.length);
      const matched = keys.filter(k => k.toLowerCase().includes('fsc') || k.toLowerCase().includes('forest') || k.toLowerCase().includes('steward') || k.toLowerCase().includes('council'));
      console.log('Matched keys:', matched);
    } catch(e) {
      // maybe simple-icons.json is nested differently or is an array
      try {
        const arr = JSON.parse(data).icons || JSON.parse(data);
        const matched = arr.map(i => i.title || i.name || i).filter(t => t.toLowerCase().includes('fsc') || t.toLowerCase().includes('forest') || t.toLowerCase().includes('steward') || t.toLowerCase().includes('council'));
        console.log('Matched parsed:', matched);
      } catch (e2) {
        console.log('Error parsing:', e.message, e2.message);
        console.log('Snippet of data:', data.slice(0, 500));
      }
    }
  });
}).on('error', (err) => {
  console.error(err);
});

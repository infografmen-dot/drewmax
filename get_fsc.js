import https from 'https';

https.get('https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/fsc.svg', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('---BEGIN---');
    console.log(data);
    console.log('---END---');
  });
}).on('error', (err) => {
  console.error(err);
});

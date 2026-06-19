import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware do przekierowywania adresów .html na ładne adresy (clean URLs)
app.use((req, res, next) => {
  const cleanPath = req.path;
  if (cleanPath.endsWith('.html')) {
    const withoutHtml = cleanPath.slice(0, -5);
    const queryString = req.url.substring(req.path.length); // zachowujemy parametry zapytania (np. ?ref=...)
    
    if (withoutHtml === '/index') {
      return res.redirect(301, '/' + queryString);
    }
    if (withoutHtml === '/en/index') {
      return res.redirect(301, '/en' + queryString);
    }
    return res.redirect(301, withoutHtml + queryString);
  }
  next();
});

// Serwowanie plików statycznych z obsługą ucinania rozszerzenia .html
// Oznacza to, że żądanie /o-nas automatycznie zaserwuje o-nas.html, a /en/o-nas zaserwuje en/o-nas.html
app.use(express.static(__dirname, {
  extensions: ['html']
}));

// Specjalne obsłużenie głównych wejść (na wypadek specyficznego zachowania)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/en', (req, res) => {
  res.sendFile(path.join(__dirname, 'en', 'index.html'));
});

// Przekierowanie starych ścieżek /pl do głównego katalogu (nowej domyślnej wersji PL)
app.get('/pl', (req, res) => {
  res.redirect(301, '/');
});

app.get('/pl/:filename', (req, res) => {
  const filename = req.params.filename;
  const cleanName = filename.endsWith('.html') ? filename.slice(0, -5) : filename;
  if (cleanName === 'index') {
    return res.redirect(301, '/');
  }
  res.redirect(301, `/${cleanName}`);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[DREWMAX] Serwer uruchomiony na porcie ${port}.`);
});

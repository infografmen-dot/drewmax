import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serwowanie plików statycznych z głównego katalogu
app.use(express.static(__dirname));

// Obsługa głównych ścieżek wejściowych
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pl', (req, res) => {
  res.sendFile(path.join(__dirname, 'pl', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[DREWMAX] Serwer uruchomiony na porcie ${port}.`);
});

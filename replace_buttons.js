import fs from 'fs';

function processHtml(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  const replacements = [
    { num: "01", id: "plastic" },
    { num: "02", id: "indoor" },
    { num: "03", id: "outdoor" },
    { num: "04", id: "technical" },
    { num: "05", id: "accessories" }
  ];

  replacements.forEach(rep => {
    let regex = new RegExp(`(<span class="cetro-item-num">${rep.num}<\/span>[\\s\\S]*?<h3 class="cetro-item-title">[\\s\\S]*?<\/div>\\s*)<button class="cetro-arrow-btn" (aria-label="[^"]+")>([\\s\\S]*?)<\/button>`, 'g');
    
    content = content.replace(regex, `$1<a href="oferta.html#${rep.id}" class="cetro-arrow-btn" $2>$3</a>`);
  });

  fs.writeFileSync(file, content, 'utf8');
}

processHtml('index.html');
processHtml('pl/index.html');
console.log('Modified buttons');

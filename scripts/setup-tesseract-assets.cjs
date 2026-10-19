const fs = require('fs');
const path = require('path');

const publicTesseractDir = path.join(__dirname, '..', 'public', 'tesseract');
const tessdataDir = path.join(publicTesseractDir, 'tessdata');

if (!fs.existsSync(tessdataDir)) {
  fs.mkdirSync(tessdataDir, { recursive: true });
}

// 1. Copy worker
const workerSrc = path.join(__dirname, '..', 'node_modules', 'tesseract.js', 'dist', 'worker.min.js');
if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, path.join(publicTesseractDir, 'worker.min.js'));
  console.log('✓ Copied worker.min.js');
}

// 2. Copy core wasm files
const coreDir = path.join(__dirname, '..', 'node_modules', 'tesseract.js-core');
if (fs.existsSync(coreDir)) {
  const files = fs.readdirSync(coreDir);
  for (const file of files) {
    if (file.startsWith('tesseract-core')) {
      fs.copyFileSync(path.join(coreDir, file), path.join(publicTesseractDir, file));
    }
  }
  console.log('✓ Copied tesseract-core wasm binaries');
}

// 3. Copy traineddata for languages
const langs = ['eng', 'spa', 'fra', 'deu'];
for (const lang of langs) {
  const langPath = path.join(__dirname, '..', 'node_modules', '@tesseract.js-data', lang, '4.0.0_best_int', `${lang}.traineddata.gz`);
  if (fs.existsSync(langPath)) {
    fs.copyFileSync(langPath, path.join(tessdataDir, `${lang}.traineddata.gz`));
    console.log(`✓ Copied ${lang}.traineddata.gz`);
  }
}

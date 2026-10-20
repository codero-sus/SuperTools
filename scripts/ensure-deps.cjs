const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const pkgPath = path.join(rootDir, 'package.json');

try {
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const deps = Object.keys(pkg.dependencies || {});
    const missing = deps.filter(dep => {
      const depDir = path.join(rootDir, 'node_modules', dep);
      return !fs.existsSync(depDir);
    });

    if (missing.length > 0) {
      console.log(`[*] Detected missing dependencies: ${missing.join(', ')}`);
      console.log('[*] Automatically running npm install...');
      const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      execSync(`${npmCmd} install`, { stdio: 'inherit', cwd: rootDir });
      console.log('[*] Dependencies successfully installed.');
    }
  }
} catch (err) {
  console.warn('[!] Dependency check warning:', err.message);
}

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const getGitRef = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    console.error('Failed to get Git ref:', e);
    return 'unknown';
  }
};

const swPath = path.join(__dirname, '..', 'public', 'sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');
swContent = swContent.replace('__GIT_REF__', getGitRef());
fs.writeFileSync(swPath, swContent);

console.log('Service Worker processed successfully.');

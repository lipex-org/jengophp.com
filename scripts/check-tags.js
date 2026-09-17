import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = path.resolve('..');
const packages = [
  'base',
  'schema',
  'storage',
  'auth',
  'api',
  'ai',
  'pdf',
  'broadcasting',
  'inertia',
  'vite-plugin',
  'installer',
];

console.log('\nJengo Ecosystem Package Tag Audit:\n');
console.log(
  'Package'.padEnd(20) +
  'Latest Git Tag'.padEnd(20) +
  'Total Tags'.padEnd(15) +
  'Git Repo?'
);
console.log('-'.repeat(65));

for (const pkg of packages) {
  const pkgDir = path.join(root, pkg);
  if (!fs.existsSync(pkgDir)) {
    console.log(pkg.padEnd(20) + 'Not found'.padEnd(35) + 'No');
    continue;
  }
  const isGit = fs.existsSync(path.join(pkgDir, '.git'));
  if (!isGit) {
    console.log(pkg.padEnd(20) + 'No .git dir'.padEnd(35) + 'No');
    continue;
  }
  try {
    const latestTag = execSync('git tag -l --sort=-v:refname | head -n 1', { cwd: pkgDir })
      .toString().trim() || 'Untagged';
    const tagCount = execSync('git tag -l | wc -l', { cwd: pkgDir })
      .toString().trim();
    console.log(
      pkg.padEnd(20) +
      latestTag.padEnd(20) +
      tagCount.padEnd(15) +
      'Yes'
    );
  } catch (e) {
    console.log(pkg.padEnd(20) + 'Error checking'.padEnd(35) + 'Yes');
  }
}
console.log('-'.repeat(65) + '\n');

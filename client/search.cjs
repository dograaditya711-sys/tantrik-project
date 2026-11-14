const fs = require('fs');
const path = require('path');

const patterns = [
  { name: 'Fix #1 — wallet/recharge', re: /wallet\/recharge/ },
  { name: 'Fix #5 — socket connect io(', re: /\bio\s*\(/ },
  { name: 'Fix #5 — socket.io-client import', re: /socket\.io-client/ },
  { name: 'Fix #3 — rzp_test (frontend Razorpay key)', re: /rzp_(test|live)_/ },
  { name: 'Fix #3 — key_id reference', re: /key_id/ },
  { name: 'H1 — localhost:5000 (hardcoded)', re: /localhost:5000/ },
  { name: 'H1 — VITE_API_URL use', re: /VITE_API_URL/ },
  { name: 'H1 — axios.create / baseURL', re: /(axios\.create|baseURL)/ },
  { name: 'Fix #4 — testOtp in UI', re: /testOtp/ },
];

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    if (['node_modules', 'dist', '.git', 'android'].includes(f)) continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(f)) out.push(full);
  }
  return out;
}

const files = walk(path.join(__dirname, 'src'));
console.log(`\nScanning ${files.length} files in client/src...`);

for (const { name, re } of patterns) {
  const hits = [];
  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (re.test(line)) hits.push(`${path.relative(process.cwd(), file)}:${i + 1}  ${line.trim()}`);
    });
  }
  console.log(`\n========== ${name} ==========  (${hits.length} hits)`);
  hits.slice(0, 15).forEach(h => console.log('  ' + h));
  if (hits.length > 15) console.log(`  ... and ${hits.length - 15} more`);
}
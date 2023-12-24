import fs from 'fs';

function hash(s: string): number {
  let tot = 0;
  for (const c of s) {
    tot += c.charCodeAt(0);
    tot = tot * 17;
    tot = tot % 256;
  }
  return tot;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8').trim();
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const chars = data.split(',');
  let sum = 0;
  for (const char of chars) {
    sum += hash(char);
  }
  console.log(hash('cm'));

  console.log(sum);
}

main();

import fs from 'fs';

function getNext(history: number[]): number {
  let tot = history[history.length - 1];
  while (history.some(val => val !== 0)) {
    const next = [];
    for (let i = 0; i < history.length - 1; i++) {
      next.push(history[i + 1] - history[i]);
    }
    history = next;
    tot += history[history.length - 1];
  }

  return tot;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const histories = data.split('\n');
  let total = 0;
  for (const history of histories) {
    total += getNext(history.split(' ').map(Number));
  }

  console.log(total);
}

main();

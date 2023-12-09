import fs from 'fs';

function getNext(history: number[]): number {
  const firsts = [history[0]];
  while (history.some(val => val !== 0)) {
    const next = [];
    for (let i = 0; i < history.length - 1; i++) {
      next.push(history[i + 1] - history[i]);
    }
    history = next;
    firsts.push(history[0]);
  }

  let tot = 0;
  for (let i = firsts.length - 1; i >= 0; i--) {
    tot = firsts[i] - tot;
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

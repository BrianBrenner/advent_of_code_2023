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

function addLens(boxes: lens[][], lens: string) {
  // removing lens
  if (lens.split('-').length === 2) {
    const label = lens.split('-')[0];
    boxes[hash(label)] = boxes[hash(label)].filter(l => l.label !== label);
  } else {
    const [label, power] = lens.split('=');
    // adding new lens
    const lensIndex = boxes[hash(label)].findIndex(l => l.label === label);
    // already has lens, replace it
    if (lensIndex !== -1) {
      boxes[hash(label)][lensIndex].length = Number(power);
    } else {
      boxes[hash(label)].push({label, length: Number(power)});
    }
  }
}

function getPower(boxes: lens[][]): number {
  let sum = 0;
  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
      sum += (1 + i) * (1 + j) * boxes[i][j].length;
    }
  }
  return sum;
}

interface lens {
  label: string;
  length: number;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8').trim();
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const lenses = data.split(',');

  const boxes: lens[][] = Array.from({length: 256}, () => []);

  for (const lens of lenses) {
    addLens(boxes, lens);
  }

  console.log(getPower(boxes));
}

main();

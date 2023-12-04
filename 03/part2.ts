import fs from 'fs';
import {createHash} from 'crypto';

type index = [number, number];

class numberSequence {
  indices: index[];
  val: number;
  id: string;

  constructor(indices: index[], val: number) {
    this.indices = indices;
    this.val = val;

    const hash = createHash('sha256');
    hash.update(`${val}-${indices[0][0]}-${indices[0][1]}`);
    this.id = hash.digest('hex');
  }
}

function isNumber(input: string): boolean {
  return !isNaN(Number(input));
}

function getNumber(rows: string[][], i: number, j: number): numberSequence {
  let l = j;
  let r = j;
  while (rows[i][l] && isNumber(rows[i][l])) {
    l--;
  }
  while (rows[i][r] && isNumber(rows[i][r])) {
    r++;
  }

  const numInds: index[] = [];
  for (let k = l + 1; k <= r - 1; k++) {
    numInds.push([i, k]);
  }
  const numAsStr = rows[i].slice(l + 1, r).join('');

  return new numberSequence(numInds, Number(numAsStr));
}

// returns all numbers that are adjacent to the given index
function getNeighbors(
  rows: string[][],
  i: number,
  j: number
): numberSequence[] {
  const indicesToCheck = [
    [i + 1, j + 1],
    [i + 1, j - 1],
    [i + 1, j],
    [i - 1, j + 1],
    [i - 1, j - 1],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ];

  const nums: numberSequence[] = [];
  const hashes = new Set<string>();
  for (const [row, col] of indicesToCheck) {
    // if it is a symbol
    if (rows[row] && rows[row][col] && isNumber(rows[row][col])) {
      // find full number
      const num = getNumber(rows, row, col);
      if (!hashes.has(num.id)) {
        hashes.add(num.id);
        nums.push(num);
      }
    }
  }
  return nums;
}

function getGearRatio(rows: string[][], index: index): number {
  const neighbors = getNeighbors(rows, index[0], index[1]);
  if (neighbors.length === 2) {
    // product of numbers
    return neighbors.map(num => num.val).reduce((a, b) => a * b, 1);
  }

  return 0;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const rows = data.split('\n').map(x => x.split(''));

  const gears: index[] = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (rows[i][j] === '*') {
        gears.push([i, j]);
      }
    }
  }

  // sum all gear ratios
  const tot = gears.map(x => getGearRatio(rows, x)).reduce((a, b) => a + b, 0);
  console.log(tot);
}

main();

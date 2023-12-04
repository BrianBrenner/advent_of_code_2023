import fs from 'fs';

type index = [number, number];
interface numberSequence {
  // each entry in the arr is a set of coordinates for a char making up the number
  indices: index[];
  // the value of the number as number
  val: number;
}

function hasNearbySymbol(rows: string[][], i: number, j: number): boolean {
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

  for (const [row, col] of indicesToCheck) {
    // if it is a symbol
    if (
      rows[row] &&
      rows[row][col] &&
      rows[row][col] !== '.' &&
      !isNumber(rows[row][col])
    ) {
      return true;
    }
  }
  return false;
}

function isNumber(input: string): boolean {
  return !isNaN(Number(input));
}

// each arr in the arr is a set of coodrinates for a number
function getNumberIndices(row: string[], i: number): numberSequence[] {
  const out: numberSequence[] = [];
  let cur: index[] = [];
  let inNumber = false;
  for (let j = 0; j < row.length; j++) {
    if (isNumber(row[j])) {
      inNumber = true;
      cur.push([i, j]);
    } else {
      // were in a number
      if (inNumber) {
        inNumber = false;
        const numAsStr = cur.map(x => row[x[1]]).join('');
        const fullNum: numberSequence = {
          indices: cur,
          val: Number(numAsStr),
        };
        out.push(fullNum);
        cur = [];
      }
    }
  }

  // catch number at end of row. check if were in a number
  if (inNumber) {
    const numAsStr = cur.map(x => row[x[1]]).join('');
    const fullNum: numberSequence = {
      indices: cur,
      val: Number(numAsStr),
    };
    out.push(fullNum);
  }

  return out;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const rows = data.split('\n').map(x => x.split(''));
  let total = 0;

  let numbers: numberSequence[] = [];
  rows.forEach((row, i) => {
    numbers = numbers.concat(getNumberIndices(row, i));
  });

  numbers.forEach(num => {
    const isValid = num.indices
      .map(x => hasNearbySymbol(rows, x[0], x[1]))
      .some(x => x);
    if (isValid) {
      total += num.val;
    }
  });

  console.log(total);
}

main();

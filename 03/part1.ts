import fs from 'fs';

function findNumberIndexes(input: string): {start: number; end: number}[] {
  const regex = /\d+/g;
  const result: {start: number; end: number}[] = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    result.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return result;
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
      isNaN(Number(rows[row][col]))
    ) {
      return true;
    }
  }
  return false;
}

function main() {
  // const data = fs.readFileSync('input.txt', 'utf-8');
  const data = fs.readFileSync('test.txt', 'utf-8');
  const rows = data.split('\n').map(x => x.split(''));
  let total = 0;

  rows.forEach((row, i) => {
    const nums = findNumberIndexes(row.join(''));
    for (const num of nums) {
      let nearSymbol = false;
      for (let j = num.start; j < num.end; j++) {
        if (hasNearbySymbol(rows, i, j)) {
          nearSymbol = true;
        }
      }
      if (nearSymbol) {
        total += Number(row.slice(num.start, num.end).join(''));
      }
    }
  });

  console.log(total);
}

main();

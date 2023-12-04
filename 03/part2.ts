import fs from 'fs';

type num = {
  start: number;
  // character after the end
  end: number;
};

function findNumberIndexes(input: string): num[] {
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

function getNearbyStars(rows: string[][], y: number, n: num): number[][] {
  const starCoords = [];
  for (let i = y - 1; i <= y + 1; i++) {
    for (let j = n.start - 1; j <= n.end; j++) {
      if (rows[i] && rows[i][j] && rows[i][j] === '*') {
        starCoords.push([i, j]);
      }
    }
  }
  return starCoords;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const rows = data.split('\n').map(x => x.split(''));
  let total = 0;

  const starToNums: Map<string, number[]> = new Map();
  rows.forEach((row, i) => {
    const nums = findNumberIndexes(row.join(''));
    for (const num of nums) {
      const stars = getNearbyStars(rows, i, num);

      for (const star of stars) {
        const key = star.join(',');
        const numValue = Number(row.slice(num.start, num.end).join(''));
        if (starToNums.has(key)) {
          const arr = starToNums.get(key)!;
          arr.push(numValue);
        } else {
          starToNums.set(key, [numValue]);
        }
      }
    }
  });

  for (const [key, value] of starToNums.entries()) {
    if (value.length === 2) {
      total += value.reduce((a, b) => a * b, 1);
    }
  }

  console.log(total);
}

main();

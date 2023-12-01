import * as fs from 'fs';

function findNum(str: string): number {
  const nameToNum: Map<string, string> = new Map([
    ['one', '1'],
    ['two', '2'],
    ['three', '3'],
    ['four', '4'],
    ['five', '5'],
    ['six', '6'],
    ['seven', '7'],
    ['eight', '8'],
    ['nine', '9'],
  ]);

  const regex = /(?:[1-9]|one|two|three|four|five|six|seven|eight|nine)/g;
  const match = str.match(regex);

  if (match && match.length > 0) {
    let first = match[0];
    if (nameToNum.has(first)) {
      first = nameToNum.get(first)!;
    }
    let last = match[match.length - 1];
    if (nameToNum.has(last)) {
      last = nameToNum.get(last)!;
    }

    return Number(first + last);
  }

  return 0;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  const dataArr: string[] = data.split('\n');

  let sum = 0;
  for (const row of dataArr) {
    sum += findNum(row);
  }

  console.log(sum);
}

main();

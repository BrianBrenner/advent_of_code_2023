import fs from 'fs';

function countOccurrences(input: string, targetChar: string): number {
  return input
    .split('')
    .reduce((acc, char) => acc + (char === targetChar ? 1 : 0), 0);
}

// do backtracking and check each one
function bruteForce(chars: string, grouping: number[]): number {
  let options = 0;
  function backtrack(chars: string[]) {
    // every ? is set, check if it's valid
    if (countOccurrences(chars.join(''), '?') === 0) {
      if (checkGrouping(chars.join(''), grouping)) {
        options += 1;
      }
    }

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char === '?') {
        const clone = [...chars];
        clone[i] = '.';
        backtrack(clone);
        chars[i] = '#';
        backtrack(chars);
        break;
      }
    }
  }

  backtrack(chars.split(''));
  return options;
}

function checkGrouping(chars: string, grouping: number[]): boolean {
  const hashCount = chars
    .split('.')
    .filter(s => s !== '')
    .map(s => countOccurrences(s, '#'));

  if (hashCount.length !== grouping.length) {
    return false;
  }

  for (let i = 0; i < grouping.length; i++) {
    const count = hashCount[i];
    const numHash = grouping[i];
    if (count !== numHash) {
      return false;
    }
  }

  return true;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');

  const lines = data.split('\n');
  let tot = 0;
  for (const line of lines) {
    const [chars, grouping] = line.split(' ');
    tot += bruteForce(chars, grouping.split(',').map(Number));
  }

  console.log(`total: ${tot}`);
}

main();

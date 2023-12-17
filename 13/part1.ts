import fs from 'fs';

function rotatePattern(pattern: string[]): string[] {
  const numRows = pattern.length;
  const numCols = pattern[0].length;

  const rotated = [];
  for (let i = 0; i < numCols; i++) {
    let row = '';
    for (let j = 0; j < numRows; j++) {
      row += pattern[j][i];
    }
    rotated.push(row);
  }

  return rotated;
}

// returns the index of the base of the reflection point, returns -1 if no reflection
function findReflectionIndex(pattern: string[]): number {
  for (let i = 0; i < pattern.length - 1; i++) {
    if (pattern[i] === pattern[i + 1]) {
      let isValid = true;
      for (let j = i - 1; j >= 0; j--) {
        const distFromReflection = i - j;
        if (
          i - distFromReflection < 0 ||
          i + distFromReflection + 1 >= pattern.length
        ) {
          break;
        }
        if (
          pattern[i - distFromReflection] !==
          pattern[i + distFromReflection + 1]
        ) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        return i;
      }
    }
  }
  return -1;
}

function findPatternScore(pattern: string[]): number {
  const horiz = findReflectionIndex(pattern);
  if (horiz !== -1) {
    return (horiz + 1) * 100;
  }
  const vertical = findReflectionIndex(rotatePattern(pattern));
  if (vertical !== -1) {
    return vertical + 1;
  }
  return 0;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');

  const patterns = data.split('\n\n').map(img => img.split('\n'));
  let total = 0;
  for (const pattern of patterns) {
    total += findPatternScore(pattern);
  }

  console.log(total);
}

main();

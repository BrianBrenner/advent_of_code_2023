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

// if valid, returns the index of the smudge, if no smudge but refleted, returns -1, if not reflected return -2
function isReflected(p1: string, p2: string): number {
  const smudges = [];
  for (let i = 0; i < p1.length; i++) {
    if (p1[i] !== p2[i]) {
      smudges.push(i);
    }
  }

  if (smudges.length > 1) {
    return -2;
  }

  if (smudges.length === 1) {
    return smudges[0];
  }

  return -1;
}

// returns the index of the base of the reflection point, returns -1 if no reflection
function findReflectionIndex(origPattern: string[]): number {
  const orig = origPattern.slice();
  for (let i = 0; i < origPattern.length - 1; i++) {
    // reset smudge
    const pattern = orig.slice();
    let hasSmudge = false;
    const smudgeIndex = isReflected(pattern[i], pattern[i + 1]);
    if (smudgeIndex >= -1) {
      if (smudgeIndex >= 0) {
        hasSmudge = true;
        // fix smudge
        const cur = pattern[i];
        if (cur === '#') {
          pattern[i] = '.';
        } else {
          pattern[i] = '#';
        }
      }
      let isValid = true;
      for (let j = i - 1; j >= 0; j--) {
        const distFromReflection = i - j;
        if (
          i - distFromReflection < 0 ||
          i + distFromReflection + 1 >= pattern.length
        ) {
          break;
        }
        const smudgeIndex = isReflected(
          pattern[i - distFromReflection],
          pattern[i + distFromReflection + 1]
        );
        if (smudgeIndex >= -1) {
          if (smudgeIndex >= 0) {
            hasSmudge = true;
            // fix smudge
            const cur = pattern[i];
            if (cur === '#') {
              console.log(pattern[i - distFromReflection]);
              pattern[i - distFromReflection] = '.';
            } else {
              pattern[i] = '#';
            }
          }
        } else {
          isValid = false;
          break;
        }
      }
      if (isValid && hasSmudge) {
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

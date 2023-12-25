import fs from 'fs';

function writeToFile(filePath: string, content: string): void {
  const fileStream = fs.createWriteStream(filePath, {flags: 'w'}); // 'a' flag for appending
  fileStream.write(content + '\n');
  fileStream.end();
}

const BENDS = ['F', 'L', 'J', '7'];

const BEND_SAME_SIDES: {[key: string]: string[]} = {
  F: ['7', 'L'],
  L: ['J', 'F'],
  J: ['L', '7'],
  7: ['F', 'J'],
};

function isInside(land: string[][], i: number, j: number): boolean {
  let curI = i;
  let curJ = j;
  let crossing = 0;
  let curBend = '';
  // left
  while (curJ >= 0) {
    if (land[curI][curJ] === '|') {
      crossing += 1;
    }
    if (BENDS.includes(land[curI][curJ])) {
      if (curBend === '') {
        curBend = land[curI][curJ];
      } else {
        if (!BEND_SAME_SIDES[curBend].includes(land[curI][curJ])) {
          crossing += 1;
        }
        curBend = '';
      }
    }
    curJ -= 1;
  }
  if (crossing % 2 === 0) {
    return false;
  }

  curI = i;
  curJ = j;
  crossing = 0;
  curBend = '';
  // right
  while (curJ < land[0].length) {
    if (land[curI][curJ] === '|') {
      crossing += 1;
    }
    if (BENDS.includes(land[curI][curJ])) {
      if (curBend === '') {
        curBend = land[curI][curJ];
      } else {
        if (!BEND_SAME_SIDES[curBend].includes(land[curI][curJ])) {
          crossing += 1;
        }
        curBend = '';
      }
    }
    curJ += 1;
  }
  if (crossing % 2 === 0) {
    return false;
  }

  curI = i;
  curJ = j;
  crossing = 0;
  curBend = '';
  // up
  while (curI >= 0) {
    if (land[curI][curJ] === '-') {
      crossing += 1;
    }
    if (BENDS.includes(land[curI][curJ])) {
      if (curBend === '') {
        curBend = land[curI][curJ];
      } else {
        if (!BEND_SAME_SIDES[curBend].includes(land[curI][curJ])) {
          crossing += 1;
        }
        curBend = '';
      }
    }
    curI -= 1;
  }
  if (crossing % 2 === 0) {
    return false;
  }

  curI = i;
  curJ = j;
  crossing = 0;
  curBend = '';
  // down
  while (curI < land.length) {
    if (land[curI][curJ] === '-') {
      crossing += 1;
    }
    if (BENDS.includes(land[curI][curJ])) {
      if (curBend === '') {
        curBend = land[curI][curJ];
      } else {
        if (!BEND_SAME_SIDES[curBend].includes(land[curI][curJ])) {
          crossing += 1;
        }
        curBend = '';
      }
    }
    curI += 1;
  }
  if (crossing % 2 === 0) {
    return false;
  }

  return true;
}

function countArea(land: string[][]): number {
  const copy = land.map(row => row.map(col => col));
  let count = 0;
  for (let i = 0; i < land.length; i++) {
    for (let j = 0; j < land[i].length; j++) {
      if (
        land[i][j] === '-' ||
        land[i][j] === '|' ||
        BENDS.includes(land[i][j])
      ) {
        count += 1;
      } else if (isInside(land, i, j)) {
        copy[i][j] = '#';
        count += 1;
      }
    }
  }

  writeToFile('filled.txt', copy.map(row => row.join('')).join('\n'));
  return count;
}

function handleBend(dir: string, nextDir: string): string {
  if (dir === 'R') {
    if (nextDir === 'U') {
      return 'J';
    } else {
      return '7';
    }
  } else if (dir === 'L') {
    if (nextDir === 'U') {
      return 'L';
    } else {
      return 'F';
    }
  } else if (dir === 'U') {
    if (nextDir === 'R') {
      return 'F';
    } else {
      return '7';
    }
  } else if (dir === 'D') {
    if (nextDir === 'R') {
      return 'L';
    } else {
      return 'J';
    }
  }
  console.log('error');
  return '';
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8').trim();
  // const data = fs.readFileSync('test.txt', 'utf-8');

  const land = Array.from({length: 600}, () =>
    Array.from({length: 600}, () => '.')
  );
  let curI = 300;
  let curJ = 300;
  land[curI][curJ] = '-';
  const rows = data.split('\n');
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    const [dir, dist] = row.split(' ');
    for (let i = 0; i < Number(dist); i++) {
      let char = '';
      switch (dir) {
        case 'R':
          curJ += 1;
          char = '-';
          break;
        case 'L':
          curJ -= 1;
          char = '-';
          break;
        case 'U':
          curI -= 1;
          char = '|';
          break;
        case 'D':
          curI += 1;
          char = '|';
          break;
      }
      if (i === Number(dist) - 1) {
        // loop back to beginning
        const nextInd = j === rows.length - 1 ? 0 : j + 1;
        const [nextDir] = rows[nextInd].split(' ');
        char = handleBend(dir, nextDir);
      }

      land[curI][curJ] = char;
    }
  }

  // console.log(land.map(row => row.join('')).join('\n'));
  writeToFile('out.txt', land.map(row => row.join('')).join('\n'));
  console.log(countArea(land));
}

main();

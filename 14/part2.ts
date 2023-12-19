import fs from 'fs';

// rotate so is equivalent to 90 degree clockwise rotation
function rotatePlatform(pattern: string[]): string[] {
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

  // flip so is equavelnt to 90 degree clockwise rotation
  const flipped = rotated.map(row => row.split('').reverse().join(''));

  return flipped;
}

// inefficient way to do this, essentially move one rock one space at a time. later can do while true loop and
// break when no rocks are moved
function tiltRow(row: string): string {
  let newRow = '';
  for (let i = 0; i < row.length; i++) {
    if (i === row.length - 1) {
      newRow += row[i];
      break;
    }
    const char = row[i];
    const next = row[i + 1];
    // can move rock
    if (char === 'O' && next === '.') {
      // flip the O and . then append the rest of the row
      newRow += '.O' + row.slice(i + 2);
      break;
    } else {
      newRow += char;
    }
  }

  return newRow;
}

function tiltPlatform(pattern: string[]): string[] {
  const rolledPattern: string[] = [];
  for (const row of pattern) {
    let prev = row;
    while (true) {
      const tilted = tiltRow(prev);
      // done tilting
      if (prev === tilted) {
        break;
      }
      prev = tilted;
    }
    rolledPattern.push(prev);
  }

  return rolledPattern;
}

function getScore(pattern: string[]): number {
  let score = 0;
  for (const row of pattern) {
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === 'O') {
        // score is dist from edge
        score += i + 1;
      }
    }
  }
  return score;
}

// takes in original non-tilted pattern
// north, then west, then south, then east
function performCycle(pattern: string[]): string[] {
  let rotated = rotatePlatform(pattern);
  let tilted = tiltPlatform(rotated);

  rotated = rotatePlatform(tilted);
  tilted = tiltPlatform(rotated);

  rotated = rotatePlatform(tilted);
  tilted = tiltPlatform(rotated);

  rotated = rotatePlatform(tilted);
  tilted = tiltPlatform(rotated);

  return tilted;
}

// essentially, I ran for a smaller number of cycles, like then I found how often the pattern of scores repeats. In this case,
// it is every 42 cycles. It also took 111 cycles to get into a loop, so i did (1000000000-111) % 42 to get the number of cycles
// after the loop starts to get the score.
function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');

  let platform = data.split('\n');
  const numCycles = 1000000000;
  const scores = [];
  for (let i = 0; i < numCycles; i++) {
    platform = performCycle(platform);
    const score = getScore(rotatePlatform(platform));
    scores.push(score);
  }
  console.log(scores);
  // console.log(getScore(rotatePlatform(platform)));
}

main();

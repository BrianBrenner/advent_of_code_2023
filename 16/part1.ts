import fs from 'fs';

interface visited {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  [key: string]: boolean;
}

interface dirToCoord {
  [key: string]: number[];
}
const dirToCoord: dirToCoord = {
  left: [0, -1],
  right: [0, 1],
  up: [-1, 0],
  down: [1, 0],
};

interface reflection {
  [key: string]: string[];
}
interface charReflection {
  [key: string]: reflection;
}

const charToReflections: charReflection = {
  '.': {
    left: ['left'],
    right: ['right'],
    up: ['up'],
    down: ['down'],
  },
  '/': {
    left: ['down'],
    right: ['up'],
    up: ['right'],
    down: ['left'],
  },
  '\\': {
    left: ['up'],
    right: ['down'],
    up: ['left'],
    down: ['right'],
  },
  '|': {
    left: ['up', 'down'],
    right: ['up', 'down'],
    up: ['up'],
    down: ['down'],
  },
  '-': {
    left: ['left'],
    right: ['right'],
    up: ['left', 'right'],
    down: ['left', 'right'],
  },
};

function traceLight(
  grid: string[][],
  tracker: visited[][],
  x: number,
  y: number,
  dir: string
) {
  if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) {
    return;
  }
  if (tracker[x][y][dir]) {
    return;
  }

  tracker[x][y][dir] = true;
  const char = grid[x][y];
  const reflections = charToReflections[char][dir];
  for (const newDir of reflections) {
    const newX = x + dirToCoord[newDir][0];
    const newY = y + dirToCoord[newDir][1];
    traceLight(grid, tracker, newX, newY, newDir);
  }
  // this is needed or else call stack will overflow...
  console.log('done');
}

function countEnergized(tracker: visited[][]) {
  let count = 0;
  for (const row of tracker) {
    for (const cell of row) {
      if (Object.values(cell).some(val => val)) {
        count++;
      }
    }
  }
  return count;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8').trim();
  // const data = fs.readFileSync('test.txt', 'utf-8');

  const grid = data.split('\n').map(line => line.split(''));
  const tracker: visited[][] = Array.from({length: grid.length}, () =>
    Array.from({length: grid[0].length}, () => ({
      left: false,
      right: false,
      up: false,
      down: false,
    }))
  );

  traceLight(grid, tracker, 0, 0, 'right');
  console.log(countEnergized(tracker));
}

main();

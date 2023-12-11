import fs from 'fs';

// change into {
//
// {
//   "|": ["N", "S"],
// }

const dirComplements = new Map<string, string>([
  ['N', 'S'],
  ['S', 'N'],
  ['E', 'W'],
  ['W', 'E'],
]);

const blocks = new Map<string, string[]>([
  ['|', ['E', 'W']],
  ['-', ['N', 'S']],
  ['L', []],
  ['J', []],
  ['7', []],
  ['F', []],
  ['.', []],
  // assume you can block with S
  ['S', []],
]);

// for part 2 use dynamic programming to find exits
const northPipes = ['|', '7', 'F', 'S'];
const eastPipes = ['-', 'J', '7', 'S'];
const westPipes = ['-', 'F', 'L', 'S'];
const southPipes = ['|', 'J', 'L', 'S'];
// the key of the map is the current position, and the value is an object containing which pipes are valid in which
// each
const valid = new Map<string, any>([
  ['|', {N: northPipes, S: southPipes}],
  ['-', {E: eastPipes, W: westPipes}],
  ['L', {N: northPipes, E: eastPipes}],
  ['J', {N: northPipes, W: westPipes}],
  ['7', {W: westPipes, S: southPipes}],
  ['F', {E: eastPipes, S: southPipes}],
  ['S', {N: northPipes, E: eastPipes, W: westPipes, S: southPipes}],
]);

const dirToCoord = new Map<string, [number, number]>([
  ['N', [-1, 0]],
  ['E', [0, 1]],
  ['W', [0, -1]],
  ['S', [1, 0]],
  ['', [0, 0]],
]);

function isValid(
  graph: tile[][],
  seen: number[][],
  curX: number,
  curJ: number,
  dir: string
): boolean {
  const [x, y] = dirToCoord.get(dir)!;
  const [nextX, nextY] = [curX + x, curJ + y];
  if (
    nextX < 0 ||
    nextX >= graph.length ||
    nextY < 0 ||
    nextY >= graph[0].length ||
    seen[nextX][nextY] === 1
  ) {
    return false;
  }

  const curValue = graph[curX][curJ].val;
  const nextValue = graph[nextX][nextY].val;
  if (
    valid.get(curValue)![dir] &&
    valid.get(curValue)![dir].includes(nextValue)
  ) {
    seen[nextX][nextY] = 1;
    graph[nextX][nextY].isPipe = true;
    return true;
  }

  return false;
}

function findStart(graph: tile[][]): [number, number] {
  for (let i = 0; i < graph.length; i++) {
    const row = graph[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j].val === 'S') {
        return [i, j];
      }
    }
  }
  return [0, 0];
}

function printPipe(graph: tile[][]) {
  for (const row of graph) {
    let str = '';
    for (const col of row) {
      if (col.isPipe) {
        str += '1';
      } else if (col.canReachExit) {
        str += '*';
      } else {
        str += '0';
      }
    }
    console.log(str);
  }
  console.log('\n');
}

function findExit(
  graph: tile[][],
  curX: number,
  curY: number,
  dir: string,
  checked: boolean[][]
): boolean {
  const curTile = graph[curX][curY];
  console.log('**');
  console.log(curTile);
  console.log(dir);
  console.log('curx, cury', curX, curY);
  if (curTile.isPipe && blocks.get(curTile.val)!.includes(dir)) {
    return false;
  }
  const [xOffset, yOffset] = dirToCoord.get(dir)!;
  const [x, y] = [curX + xOffset, curY + yOffset];
  if (x < 0 || x >= graph.length || y < 0 || y >= graph[0].length) {
    console.log('returning true');
    return true;
  }
  const tile = graph[x][y];
  console.log(tile);
  console.log('x,y', x, y);
  console.log('dir ', dir);
  if (tile.canReachExit) {
    console.log('returning true');
    return true;
  }
  if (checked[x][y]) {
    return false;
  }

  checked[x][y] = true;
  console.log(blocks.get(tile.val));
  // if (pipeDirs.get(tile.val)!.includes(dir)) {
  //   return true;
  // }

  // pipe with no ability to squeeze through
  console.log(blocks.get(tile.val)!.includes(dir));
  if (tile.isPipe && blocks.get(tile.val)!.includes(dir)) {
    console.log('returning false');
    return false;
  }

  const dirs = ['N', 'E', 'S', 'W'];
  const toRemove = dirComplements.get(dir)!;
  const filteredDirs = dirs.filter(d => toRemove !== d);

  return filteredDirs.some(d => findExit(graph, x, y, d, checked));
}

interface tile {
  val: string;
  isPipe: boolean;
  canReachExit: boolean;
}

function main() {
  // const data = fs.readFileSync('input.txt', 'utf-8');
  const data = fs.readFileSync('test3.txt', 'utf-8');
  const graph = data
    .split('\n')
    .map(line =>
      line
        .split('')
        .map(char => ({val: char, isPipe: false, canReachExit: false}) as tile)
    );
  const startPos = findStart(graph);
  // 1 means we've seen it, 0 means we haven't
  const seen = Array.from({length: graph.length}, () =>
    Array(graph[0].length).fill(0)
  );

  let curPos = startPos;
  let atStart = false;
  // we loop and find the valid pipe until we are back at the start
  while (!atStart) {
    for (const dir of ['N', 'E', 'S', 'W']) {
      const valid = isValid(graph, seen, curPos[0], curPos[1], dir);
      if (valid) {
        curPos = [
          curPos[0] + dirToCoord.get(dir)![0],
          curPos[1] + dirToCoord.get(dir)![1],
        ];
        atStart = curPos[0] === startPos[0] && curPos[1] === startPos[1];
        break;
      }
    }
  }

  // count tracks the total of steps for the whole loop, so dividing by 2 gives us the number of steps for the furthest point
  let count = 0;
  for (let x = 0; x < graph.length; x++) {
    for (let y = 0; y < graph[0].length; y++) {
      const tile = graph[x][y];
      if (tile.isPipe || tile.canReachExit) {
        continue;
      }
      const checked = Array.from({length: graph.length}, () =>
        Array(graph[0].length).fill(false)
      );
      tile.canReachExit = findExit(graph, x, y, '', checked);
      if (!tile.canReachExit) {
        count++;
      }
      printPipe(graph);
    }
  }

  console.log(count);
}

main();

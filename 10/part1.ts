import fs from 'fs';

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
]);

function isValid(
  graph: string[][],
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

  const curValue = graph[curX][curJ];
  const nextValue = graph[nextX][nextY];
  if (
    valid.get(curValue)![dir] &&
    valid.get(curValue)![dir].includes(nextValue)
  ) {
    seen[nextX][nextY] = 1;
    return true;
  }

  return false;
}

function findStart(graph: string[][]): [number, number] {
  for (let i = 0; i < graph.length; i++) {
    const row = graph[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === 'S') {
        return [i, j];
      }
    }
  }
  return [0, 0];
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test2.txt', 'utf-8');
  const graph = data.split('\n').map(line => line.split(''));
  const startPos = findStart(graph);
  // 1 means we've seen it, 0 means we haven't
  const seen = Array.from({length: graph.length}, () =>
    Array(graph[0].length).fill(0)
  );

  let count = 0;
  let curPos = startPos;
  let atStart = false;
  // we loop and find the valid pipe until we are back at the start
  while (!atStart) {
    for (const dir of ['N', 'E', 'S', 'W']) {
      const valid = isValid(graph, seen, curPos[0], curPos[1], dir);
      if (valid) {
        count++;
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
  console.log(count / 2);
}

main();

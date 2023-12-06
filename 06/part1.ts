import fs from 'fs';

// find first and last speed that will beat the records, then we know all speeds in between will also beat the records
function findNumWays(time: number, dist: number): number {
  let first = 0;
  // i is the speed
  for (let i = 0; i <= time; i++) {
    const j = time - i;
    if (i * j > dist) {
      first = i;
      break;
    }
  }

  let last = 0;
  for (let i = time; i >= 0; i--) {
    const j = time - i;
    if (i * j > dist) {
      last = i;
      break;
    }
  }

  return last - first + 1;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const [rawTime, rawDist] = data.split('\n');
  const times = rawTime
    .split(':')[1]
    .trim()
    .split(' ')
    .filter(x => x !== '')
    .map(x => Number(x));
  const dists = rawDist
    .split(':')[1]
    .trim()
    .split(' ')
    .filter(x => x !== '')
    .map(x => Number(x));

  const races = times.map((time, i) => [time, dists[i]]);
  let tot = 1;
  for (const [time, dist] of races) {
    const numWays = findNumWays(time, dist);
    tot *= numWays;
  }

  console.log(tot);
}

main();

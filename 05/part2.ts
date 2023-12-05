import TreeMap from 'ts-treemap';
import fs from 'fs';

function findDestination(
  tree: TreeMap<number, number[]>,
  current: number
): number {
  const out = tree.floorEntry(current);
  // no mapping, just return input
  if (out === undefined) {
    return current;
  }

  const start = out[0];
  const [offset, range] = out[1];
  // not in range, just return input
  if (current - start >= range) {
    return current;
  }

  return current + offset;
}

// creates treemap that maps from source to an array that includes destination's offset from the source and range of values we map to,
// for example 98 -> [-48,2] means that 98 maps to 50 (99-48), 99 maps to 51 (99-48)
// map has format: 'seed-to-soil map:\n50 98 2\n52 50 48',
function createTreeMap(map: string): TreeMap<number, number[]> {
  const treeMap = new TreeMap<number, number[]>();
  // from example above, would be: [ [ 50, 98, 2 ], [ 52, 50, 48 ] ]
  const lines = map
    .split(':\n')[1]
    .split('\n')
    .map(x => x.split(' ').map(Number));

  // from example above, 98 => [-48,2], and 50 => [2, 48]
  for (const line of lines) {
    const [dest, source, range] = line;
    treeMap.set(source, [dest - source, range]);
  }

  return treeMap;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const maps = data.split('\n\n');
  const rawSeeds = maps.shift()!.split(': ')[1].split(' ').map(Number);
  const seedPairs = [];
  for (let i = 0; i < rawSeeds.length; i += 2) {
    seedPairs.push([rawSeeds[i], rawSeeds[i + 1]]);
  }

  const treeMaps: TreeMap<number, number[]>[] = [];
  for (const map of maps) {
    treeMaps.push(createTreeMap(map));
  }

  let curMin = Infinity;
  for (const pair of seedPairs) {
    let start = pair[0];
    const end = start + pair[1];
    while (start < end) {
      let current = start;
      for (const treeMap of treeMaps) {
        current = findDestination(treeMap, current);
      }
      curMin = Math.min(curMin, current);
      start++;
    }
  }

  console.log(curMin);
}

main();

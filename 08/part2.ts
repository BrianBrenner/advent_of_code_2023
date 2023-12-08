import fs from 'fs';

interface node {
  left: string;
  right: string;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function arrayLCM(numbers: number[]): number {
  return numbers.reduce((acc, curr) => lcm(acc, curr), 1);
}

// line has form AAA = (BBB, CCC)
function createGraph(graphs: string): Map<string, node> {
  const graph = new Map<string, node>();
  for (const line of graphs.split('\n')) {
    const [node, edges] = line.split(' = ');
    // remove parentheses
    const lr = edges.substring(1, edges.length - 1).split(', ');
    graph.set(node, {left: lr[0], right: lr[1]});
  }
  return graph;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test_part2.txt', 'utf-8');
  const [steps, graphs] = data.split('\n\n');

  const graph = createGraph(graphs);
  let curNodes = [...graph.keys()].filter(key => key[key.length - 1] === 'A');
  let totalSteps = 0;
  const cycleCount = new Array(curNodes.length).fill(0);
  while (true) {
    for (const step of steps) {
      // track how many steps for first time each node reach a Z
      curNodes.forEach((key, i) => {
        if (key[key.length - 1] === 'Z' && cycleCount[i] === 0) {
          cycleCount[i] = totalSteps;
        }
      });
      // once all are at Z, find least common multiple of all cycle counts
      if (cycleCount.every(count => count !== 0)) {
        console.log(arrayLCM(cycleCount));
        return;
      }
      totalSteps++;
      if (step === 'L') {
        curNodes = curNodes.map(key => graph.get(key)!.left);
      } else {
        curNodes = curNodes.map(key => graph.get(key)!.right);
      }
    }
  }
}

main();

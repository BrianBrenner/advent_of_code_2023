import fs from 'fs';

interface node {
  left: string;
  right: string;
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
  // const data = fs.readFileSync('test2.txt', 'utf-8');
  const [steps, graphs] = data.split('\n\n');

  const graph = createGraph(graphs);
  let curKey = 'AAA';
  let totalSteps = 0;
  while (true) {
    for (const step of steps) {
      if (curKey === 'ZZZ') {
        console.log(totalSteps);
        return;
      }
      totalSteps++;
      if (step === 'L') {
        curKey = graph.get(curKey)!.left;
      } else {
        curKey = graph.get(curKey)!.right;
      }
    }
  }

  console.log(steps);
}

main();

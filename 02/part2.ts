import * as fs from 'fs';

// returns 0 if invalid, the id of the game if is valid
// game format: "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
function getPower(game: string): number {
  const draws = game.split(':')[1].split(';');
  const maxes: Map<string, number> = new Map([
    ['red', 0],
    ['green', 0],
    ['blue', 0],
  ]);

  for (const draw of draws) {
    // first entry in arr is count, second is color
    const countColors = draw.split(',').map(x => x.trim().split(' '));

    for (const [count, color] of countColors) {
      maxes.set(color, Math.max(maxes.get(color)!, Number(count)));
    }
  }

  return Array.from(maxes.values()).reduce((a, b) => a * b, 1);
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const dataArr: string[] = data.split('\n');

  let sum = 0;
  for (const game of dataArr) {
    sum += getPower(game);
  }

  console.log(sum);
}

main();

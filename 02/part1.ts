import * as fs from 'fs';

// returns 0 if invalid, the id of the game if is valid
// game format: "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
function isValid(game: string, maxes: Map<string, number>): number {
  const id = game.split(':')[0].split(' ')[1];
  const draws = game.split(':')[1].split(';');
  for (const draw of draws) {
    // first entry in arr is count, second is color
    const countColors = draw.split(',').map(x => x.trim().split(' '));

    for (const [count, color] of countColors) {
      if (!maxes.has(color)) {
        return 0;
      }
      if (Number(count) > maxes.get(color)!) {
        return 0;
      }
    }
  }

  return Number(id);
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const dataArr: string[] = data.split('\n');
  const maxes: Map<string, number> = new Map([
    ['red', 12],
    ['green', 13],
    ['blue', 14],
  ]);

  let sum = 0;
  for (const game of dataArr) {
    sum += isValid(game, maxes);
  }

  console.log(sum);
}

main();

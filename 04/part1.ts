import fs from 'fs';

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  let total = 0;
  // index is card number, value is number of cards
  for (const card of data.split('\n')) {
    const [winners, yours] = card
      .split(':')[1]
      .split('|')
      .map(x => x.trim().split(' '));

    const winSet = new Set(winners);
    const yourWinners = yours.filter(num => num !== '' && winSet.has(num));

    if (yourWinners.length === 0) {
      continue;
    }
    total += 2 ** (yourWinners.length - 1);
  }

  console.log(total);
}

main();

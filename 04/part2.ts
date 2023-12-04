import fs from 'fs';

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  // index is card number, value is number of cards
  const cards = data.split('\n');
  const cardCounts = Array(cards.length).fill(1);
  cards.forEach((card, i) => {
    const [winners, yours] = card
      .split(':')[1]
      .split('|')
      .map(x => x.trim().split(' '));

    const winSet = new Set(winners);
    const yourWinners = yours.filter(num => num !== '' && winSet.has(num));
    yourWinners.forEach((num, j) => {
      cardCounts[i + j + 1] += 1 * cardCounts[i];
    });
  });

  console.log(cardCounts.reduce((acc, curr) => acc + curr, 0));
}

main();

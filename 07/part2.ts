import fs from 'fs';

interface Hand {
  cards: string;
  bid: number;
}

function getType(cards: string): string {
  const counts = new Map<string, number>();
  for (const card of cards) {
    if (counts.has(card)) {
      counts.set(card, counts.get(card)! + 1);
    } else {
      counts.set(card, 1);
    }
  }

  // handle jokers
  if (counts.has('J')) {
    const jCount = counts.get('J')!;
    counts.delete('J');
    if (jCount === 5) {
      return 'five';
    }
    let maxKey = '';
    let maxVal = 0;
    counts.forEach((value, key) => {
      if (value > maxVal) {
        maxVal = value;
        maxKey = key;
      }
    });

    counts.set(maxKey, counts.get(maxKey)! + jCount);
  }

  if (counts.size === 1) {
    return 'five';
  }
  // full house or 4 of a kind
  if (counts.size === 2) {
    if ([...counts.values()].some(x => x === 4)) {
      return 'four';
    }
    return 'fullHouse';
  }
  // three of a kind or two pair
  if (counts.size === 3) {
    if ([...counts.values()].some(x => x === 3)) {
      return 'three';
    }
    return 'twoPair';
  }
  if (counts.size === 4) {
    return 'onePair';
  }
  return 'highCard';
}

function toHex(cards: string): number {
  const hexMap = new Map([
    ['T', 'A'],
    ['J', '1'],
    ['Q', 'C'],
    ['K', 'D'],
    ['A', 'E'],
  ]);
  let hex = '';
  for (const card of cards) {
    if (hexMap.has(card)) {
      hex += hexMap.get(card);
    } else {
      hex += card;
    }
  }

  return parseInt(hex, 16);
}

function sortHands(hands: Hand[]): Hand[] {
  const handTypes: Map<string, Hand[]> = new Map([
    ['highCard', []],
    ['onePair', []],
    ['twoPair', []],
    ['three', []],
    ['fullHouse', []],
    ['four', []],
    ['five', []],
  ]);

  for (const hand of hands) {
    const type = getType(hand.cards);
    handTypes.get(type)!.push(hand);
  }

  const sorted = [];
  for (const type of handTypes) {
    type[1].sort((a, b) => toHex(a.cards) - toHex(b.cards));
    sorted.push(...type[1]);
  }

  return sorted;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const hands = data.split('\n').map(x => {
    const [cards, bid] = x.split(' ');
    return {cards, bid: Number(bid)} as Hand;
  });

  const sortedHands = sortHands(hands);
  const tot = sortedHands.reduce((acc, cur, i) => acc + (i + 1) * cur.bid, 0);
  console.log(tot);
}

main();

import fs from 'fs';

function getBlankRows(img: string[][]): number[] {
  const blankRows: number[] = [];
  img.forEach((row, index) => {
    if (!row.some(char => char !== '.')) {
      blankRows.push(index);
    }
  });

  return blankRows;
}

function rotateImg(img: string[][]): string[][] {
  return img[0].map((_, colIndex) => img.map(row => row[colIndex]));
}

function getEmptyRowsAndCols(img: string[][]): [number[], number[]] {
  const blankRows = getBlankRows(img);
  const rotatedImg: string[][] = rotateImg(img);
  const blankCols = getBlankRows(rotatedImg);
  return [blankRows, blankCols];
}

function createRange(start: number, end: number): number[] {
  const step = start <= end ? 1 : -1;
  const result: number[] = [];
  for (let i = start + step; start <= end ? i <= end : i >= end; i += step) {
    result.push(i);
  }
  return result;
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  const img = data.split('\n').map(line => line.split(''));
  const [emptyRows, emptyCols] = getEmptyRowsAndCols(img);

  const galaxyCoords = [];
  for (let i = 0; i < img.length; i++) {
    const row = img[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === '#') {
        galaxyCoords.push([i, j]);
      }
    }
  }

  let tot = 0;
  const expansionFactor = 1000000;
  for (let i = 0; i < galaxyCoords.length; i++) {
    for (let j = 0; j < galaxyCoords.length; j++) {
      const galaxyA = galaxyCoords[i];
      const galaxyB = galaxyCoords[j];
      const xRange = createRange(galaxyA[0], galaxyB[0]);
      const yRange = createRange(galaxyA[1], galaxyB[1]);

      for (const val of xRange) {
        if (emptyRows.includes(val)) {
          tot += expansionFactor;
        } else {
          tot += 1;
        }
      }
      for (const val of yRange) {
        if (emptyCols.includes(val)) {
          tot += expansionFactor;
        } else {
          tot += 1;
        }
      }
    }
  }

  // divide by 2 since we double count, by comparing A to B and B to A
  console.log(tot / 2);
}

main();

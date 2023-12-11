import fs from 'fs';

function addBlankRows(img: string[][]): string[][] {
  const newImg: string[][] = [];
  for (const row of img) {
    // if the row is all dots, then we double it
    if (!row.some(char => char !== '.')) {
      newImg.push(row);
      newImg.push(row);
    } else {
      newImg.push(row);
    }
  }

  return newImg;
}

function rotateImg(img: string[][]): string[][] {
  return img[0].map((_, colIndex) => img.map(row => row[colIndex]));
}

function expandImg(img: string[][]): string[][] {
  const rowsAdded = addBlankRows(img);
  const rotatedImg: string[][] = rotateImg(rowsAdded);
  const allAdded = addBlankRows(rotatedImg);
  return rotateImg(allAdded);
}

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  // const data = fs.readFileSync('test.txt', 'utf-8');
  let img = data.split('\n').map(line => line.split(''));
  img = expandImg(img);
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
  for (let i = 0; i < galaxyCoords.length; i++) {
    for (let j = 0; j < galaxyCoords.length; j++) {
      const galaxyA = galaxyCoords[i];
      const galaxyB = galaxyCoords[j];
      tot +=
        Math.abs(galaxyA[0] - galaxyB[0]) + Math.abs(galaxyA[1] - galaxyB[1]);
    }
  }

  // divide by 2 since we double count, by comparing A to B and B to A
  console.log(tot / 2);
}

main();

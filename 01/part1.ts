import * as fs from 'fs';

function main() {
  const data = fs.readFileSync('input.txt', 'utf-8');
  const dataArr: string[] = data.split('\n');

  const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let sum = 0;
  for (const row of dataArr) {
    const first = row.split('').find((x: string) => nums.includes(x))!;
    const last = row
      .split('')
      .reverse()
      .find((x: string) => nums.includes(x))!;
    sum += Number(first + last);
  }

  console.log(sum);
}

main();

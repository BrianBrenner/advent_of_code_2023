function findNumberIndexes(input: string): {start: number; end: number}[] {
  const regex = /\d+/g;
  const result: {start: number; end: number}[] = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    result.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return result;
}

// Example usage:
const inputString = 'abc123def456ghi789';
const indexes = findNumberIndexes(inputString);
console.log(indexes);

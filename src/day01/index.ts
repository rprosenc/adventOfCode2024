import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const left:number[] = [];
  const right:number[] = [];
  input.split('\n').forEach(line=>{
    const [l, r] = line.split(' ').filter(c=>c).map(i=>parseInt(i));
    left.push(l);
    right.push(r);
  })
  left.sort();
  right.sort();
  
  let dist = 0;
  while (left.length) {
    const l = left.shift();
    const r = right.shift();
    const d = Math.abs(l!-r!);
    dist += d;
  }
  
  return dist;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);  
  const left:number[] = [];
  const right:number[] = [];
  input.split('\n').forEach(line=>{
    const [l, r] = line.split(' ').filter(c=>c).map(i=>parseInt(i));
    left.push(l);
    right.push(r);
  })
  const leftCache:Record<number, number> = {};
  right.sort();
  let similarity = 0;

  while (left.length) {
    const l = left.shift();
    if (leftCache[l!] === undefined) {
      let a = 0; // appearences of l in right
      for(let i=0; i<right.length && a<=right[i]; i++) {
        // go through the right list, as it is sorted, only go until hit a higher number
        if (l === right[i]) {
          a++;
        }
      }

      leftCache[l!] = a;
    }

    similarity += l! * leftCache[l!];
  }

  return similarity;
};

run({
  part1: {
    tests: [
      {
        input: `
        3   4
        4   3
        2   5
        1   3
        3   9
        3   3
        `,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        3   4
        4   3
        2   5
        1   3
        3   9
        3   3
`,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

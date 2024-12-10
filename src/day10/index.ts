import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split("").map((i) => parseInt(i) as Height));


type Height = 0|1|2|3|4|5|6|7|8|9|'.'

const moves: number[][] = [
  [-1, 0],
  [ 1, 0],
  [ 0,-1],
  [ 0, 1],
];
// for (let i = -1; i <= 1; i++) {
//   for (let j = -1; j <= 1; j++) {
//     moves.push([i, j]);
//   }
// }

let allTrailPaths: number[][][] = [];
let allDestinations: number[][] = [];

const findTrails = (
  map: Height[][],
  step: number,
  x: number,
  y: number,
  a: number,
  trailPath: number[][],
) => {
  let trails = 0;
  if (a > 9) {
    console.log('ABORT')
    return 0;
  }
  if (map[x][y] === 9) {
    // console.log("******** ", x, "/", y);
    allTrailPaths.push(trailPath);
    allDestinations.push([x,y]);
    return 1;
  }
  const nextStep = step + 1;
  moves.forEach(([i, j]) => {
    try {
      if (map[x + i][y + j] === nextStep) {
        // console.log({pos:[x,y], move:[i,j], nPos:[x+i,y+j], nVal:map[x+i][y+j], nStep:step+1})
        trails += findTrails(map, nextStep, x + i, y + j, a + 1, [
          ...trailPath,
          [ x + i, y + j],
        ]);
      }
    } catch (e) {
      return 0;
    }
  });
  return trails;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  // reset globals

  // find trailHeads
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === 0) {
        allTrailPaths = [];
        allDestinations = [];
        findTrails(input, 0, i, j, 0, [[i,j]]);
        // const flattenPaths = allTrailPaths.map(p=>p.map(coord=>coord.join('/')).join(' '));
        const uniqueDestinations = new Set(allDestinations.map(([x,y])=>`${x}/${y}`));
        const score = uniqueDestinations.size;
        result += score;

        // console.log(`${i}/${j} - ${score}`)
       }
    }
  }
// console.log(flattenPaths)
// console.log('s',(new Set(flattenPaths)).size);

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  // reset globals

  // find trailHeads
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === 0) {
        allTrailPaths = [];
        allDestinations = [];
        findTrails(input, 0, i, j, 0, [[i,j]]);
        const flattenPaths = allTrailPaths.map(p=>p.map(coord=>coord.join('/')).join(' '));
        // const uniqueDestinations = new Set(allDestinations.map(([x,y])=>`${x}/${y}`));
        const rating = flattenPaths.length;
        result += rating;

        // console.log(`${i}/${j} - ${score}`)
       }
    }
  }
// console.log(flattenPaths)
// console.log('s',(new Set(flattenPaths)).size);

  return result;};

run({
  part1: {
    tests: [
      {
        input: `
              012345678999
      `,
        expected: 1,
      },
      {
        input: `
              0999999
              1999999
              2999999
              3999999
              4999999
              5111111
              6111111
              7111111
              8111111
              9111111
      `,
        expected: 1,
      },
      {
        input: `
              0123456
              1991117
              2111118
              3111119
              4111111
              5111111
              6111111
              7111111
              8111111
              9111111
      `,
        expected: 2,
      },
      {
        input: `
              ...0...
              ...1...
              ...2...
              6543456
              7.....7
              8.....8
              9.....9
      `,
        expected: 2,
      },
      {
        input: `
            ..90..9
            ...1.98
            ...2..7
            6543456
            765.987
            876....
            987....
      `,
        expected: 4,
      },
      {
        input: `
              89010123
              78121874
              87430965
              96549874
              45678903
              32019012
              01329801
              10456732
      `,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        .....0.
        ..4321.
        ..5..2.
        ..6543.
        ..7..4.
        ..8765.
        ..9....
        `,
        expected: 3,
      },
      {
        input: `
        89010123
        78121874
        87430965
        96549874
        45678903
        32019012
        01329801
        10456732
        `,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

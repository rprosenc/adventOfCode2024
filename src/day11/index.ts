import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(" ");

const iterate = (input: string[], blinks: number) => {
  let stones: string[] = [...input];
  for (let i = 0; i < blinks; i++) {
    // console.log(stones);
    const newStones: string[] = [];
    stones.forEach((s: string) => {
      if (s === "0") {
        newStones.push("1");
      } else if (s.length % 2 === 0) {
        const left = s.substring(0, s.length / 2);
        const right = s.substring(s.length / 2);
        newStones.push(left);
        newStones.push(parseInt(right).toString());
      } else {
        newStones.push((parseInt(s) * 2024).toString());
      }
    });

    stones = newStones;
  }

  return stones;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const stones = iterate(input, 25);

  return stones.length;
};

/*
Thoughts / realizations: 
0 -> 1 in one step
1 -> 2024 -> 20,24 -> 2,0,2,4 in 3 steps
2 -> 4,0,4,8 in 3 steps
3 -> 6,0,7,2 in 3 steps
4 -> 8,0,8,6 in 3 steps
5 -> 2,0,4,8,2,8,8,0 in 5 steps
6 -> 2,4,5,7,9,4,5,6 in 5 steps
7 -> 2,8,6,7,6,0,3,2 in 5 steps
8 -> 3,2,7,,7,2,6,0,8 in 5 steps
9 -> 3,6,8,6,9,1,8,4 in 5 steps

- the order is irrelevant
- lots of multiples, behave all the same

--> 15 steps should result in all single digits.
let's try
*/
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  
  // const lookup: Record<string, string[]> = {}
  // for (let i = 0; i < 10; i++) {
  //   const s = i.toString();
  //   lookup[s] = iterate([s], 5);
  //   console.log(i, lookup[s].filter(n=>parseInt(n)>9));
  // }

  const steps = 75;
  const stepSize = 1;
  const batches = steps/stepSize

  // initial run
  let denseStorage:Record<string,number> = {};
  iterate(input, stepSize).forEach(s=>{
    if (!denseStorage[s]) {
      denseStorage[s] = 0;
    }
    denseStorage[s]++;
  });

  // remaining runs
  for (let i = 1; i<batches; i++) { // already done one run!
    console.log('iteration: ', i, 
      'stepSize: ',stepSize,
      'distinct stones: ', Object.keys(denseStorage).length,
       'stones: ', Object.keys(denseStorage).reduce((agg, stone) => agg+denseStorage[stone], 0)
    )
    // console.log(denseInput)
    const batchStorage:Record<string,number> = {};
    for (let stone of Object.keys(denseStorage)) {
      const sourceAmount = denseStorage[stone];
      const newStones = iterate([stone], stepSize);
      // console.log({batch})
      newStones.forEach(s=>{
        if (!batchStorage[s]) {
          batchStorage[s] = 0; 
        }
        batchStorage[s]+=sourceAmount; // add as many as were in the source
      });
    }
    
    denseStorage = batchStorage;
  }

  return Object.keys(denseStorage).reduce((agg, stone) => agg+denseStorage[stone], 0);
};

run({
  part1: {
    tests: [
      {
        input: `125 17`,
        expected: 55312,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: `1`,
      //   expected: 8100141,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

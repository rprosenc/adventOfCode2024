import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("").map((i) => parseInt(i));

type Block = {
  id: number;
  empty: boolean;
};

/*

import inquirer from 'inquirer';

const questions = [
  {
    type: 'input',
    name: 'name',
    message: "What's your name?",
  },
];

answers = await inquirer.prompt(questions);
 console.log(`Hi ${answers.name}!`);


*/

const EMPTY = ".";
const BLOCK = "x";

const indexes = (blocks: Block[]) => {
  const stringified = blocks.map((b) => (b.empty ? EMPTY : BLOCK)).join("");
  const lastDataIndex = stringified.lastIndexOf(BLOCK);
  const firstEmptyIndex = stringified.indexOf(EMPTY);
  return { lastDataIndex, firstEmptyIndex };
};

const part1 = (rawInput: string) => {
  const diskmap = parseInput(rawInput);
  // console.log({input})
  const fileList = [];
  const blocks: Block[] = [];
  let id = 0;
  let c: string;
  for (let i = 0; i < diskmap.length; i++) {
    const length = diskmap[i];
    if (i % 2) {
      blocks.push(...Array.from({ length }, () => ({ id: 0, empty: true })));
    } else {
      blocks.push(...Array.from({ length }, () => ({ id, empty: false })));
      id++;
    }
  }

  let i = 0;
  let idx = indexes(blocks);
  let { lastDataIndex, firstEmptyIndex } = idx;
  while (i < diskmap.length && lastDataIndex > firstEmptyIndex && firstEmptyIndex>=0) {
    i++;
    if (lastDataIndex > blocks.length || firstEmptyIndex > blocks.length) {
      console.log({
        i,
        firstFreeBlockIndex: firstEmptyIndex,
        lastFileBlockIndex: lastDataIndex,
        blocksLength: blocks.length,
      });
      break;
    }

    // move
    const firstFreeBlock = blocks[firstEmptyIndex];
    const lastFileBlock = blocks[lastDataIndex];

    // move
    blocks[firstEmptyIndex] = lastFileBlock;
    blocks[lastDataIndex] = firstFreeBlock;

    // console.log({firstEmptyIndex, lastDataIndex,blocks});

    idx = indexes(blocks);
    lastDataIndex = idx.lastDataIndex;
    firstEmptyIndex = idx.firstEmptyIndex;

    if (i % 1000 === 0) {
      console.log(i);
    }
  }

  // console.log(blocks);
  const checksum = blocks.reduce(
    (prev: number, cur: Block, i) => prev + cur.id * i,
    0,
  );
  // console.log(blocksAsString);
  // console.log(blocks.map((b) => (b.empty ? EMPTY : b.id)).join(" "));
  // console.log(blocks.map((b,i)=>`${i*b.id}`).join('+'))

  return checksum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `12345`,
        // expected: '0..111....22222' => '022111222......' => 0*0 + 1*2 + 2*2 + 3*1 + 4*1 + 5*1 + 6*2 + 7*2 + 8*2  = 60
        expected: 60,
      },
      // {
      //   input: `2333133121414131402`,
      //   // expected: '00...111...2...333.44.5555.6666.777.888899',
      //   expected: 1928,
      // },
      // {
      //   input: `101010101010101010101`,
      //   // expected: 'xxxxxxxxxxx' => 0*0 + 1*1 + 2*2 + 3*3 + 4*4 + 5*5 + 6*6 + 7*7 + 8*8 + 9*9 + 10*10  = 385
      //   expected: 385,
      // },
      // {
      //   input: `10101010101010101010192`,
      //   // expected: 'xxxxxxxxxxx' => 0*0 + 1*1 + 2*2 + 3*3 + 4*4 + 5*5 + 6*6 + 7*7 + 8*8 + 9*9 + 10*10 + 11*11  = 385
      //   expected: 385 + 11*11 + 12*11,
      // },
      // {
      //   input: `1.0.0.0.0.0.0.0.0.0.1`,
      //   // expected: 'xx.............' => 0*0 + 1*10 = 10
      //   expected: 10,
      // },
      // {
      //   input: `1.0.0.0.0.020.0.0.0.1.1`,
      //   // expected: 'xxx............' => 0*0 + 1*11 + 2*10 = 10
      //   expected: 31,
      // },
      // {
      //   input: `11101010101010101010102`,
      //   // expected: 'xxxxxxxxxxx' => 0*0 + 11*1 + 1*2 + 2*3 + 3*4 + 4*5 + 5*6 + 6*7 + 7*8 + 8*9 + 9*10 + 10*11 +11*12 = 385
      //   expected: 583,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

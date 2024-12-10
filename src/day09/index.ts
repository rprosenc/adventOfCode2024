import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("").map((i) => parseInt(i));

type Block = {
  id: number;
  empty: boolean;
};

type File = {
  id: number;
  type: "file";
  size: number;
};
type Space = {
  type: "space";
  size: number;
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
  // console.log(stringified);
  const lastDataIndex = stringified.lastIndexOf(BLOCK);
  const firstEmptyIndex = stringified.indexOf(EMPTY);
  return { lastDataIndex, firstEmptyIndex };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log({input})
  const blocks: Block[] = [];
  let id = 0;
  let c: string;
  for (let i = 0; i < input.length; i++) {
    const length = input[i];
    if (i % 2) {
      blocks.push(...Array.from({ length }, () => ({ id: 0, empty: true })));
    } else {
      blocks.push(...Array.from({ length }, () => ({ id, empty: false })));
      id++;
    }
  }
  // console.log(input);
  // console.log(blocks);

  let i = 0;
  let idx = indexes(blocks);
  let { lastDataIndex, firstEmptyIndex } = idx;
  while (
    i < input.length * 2 &&
    lastDataIndex > firstEmptyIndex &&
    firstEmptyIndex >= 0
  ) {
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
  const dataBlocks = blocks.filter((b) => !b.empty).length;
  // console.log({ i, lastDataIndex, dataBlocks });

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
  const files: (File | Space)[] = [];
  let id = 0;
  let c: string;
  for (let i = 0; i < input.length; i++) {
    const size = input[i];
    if (i % 2) {
      files.push({ size, type: "space" } as Space);
    } else {
      files.push({ id, size, type: "file" } as File);
      id++;
    }
  }
  // console.log(input);
  // console.log(files.map(f=>({size:f.size, type:f.type, id:f?.id})));

  // move last-most file into leftmost possible space
  for (let i = id; i >= 0; i--) {
    // consolidate ALL spaces
    for (let s = 0; s < files.length; s++) {
      if (files[s].type === "space") {
        for (
          let ss = s + 1;
          ss < files.length && files[ss].type === "space";

        ) {
          files[s].size = files[s].size + files[ss].size;
          files.splice(ss, 1);
        }
      }
    }

    // find file with currently moving ID
    const f = files.findIndex((_f) => _f.type === "file" && _f.id === i);
    if (f < 0) continue; // strange...

    const file = files[f];
    // look for space LEFT OF FILE
    for (let s = 0; s < f; s++) {
      let space = files[s];
      if (space.type === "space" && space.size >= file.size) {
        // found space at j

        // replace file with space (need to do before splicing)
        files[f] = { type: "space", size: file.size };

        // squeeze file in front of space
        files.splice(s, 0, file);

        // shorten available space
        space.size = space.size - file.size;

        // delete space if used up
        if (space.size <= 0) {
          files.splice(s + 1, 1);
        }
        break;
      }
    }
  }

  const blocks: Block[] = [];

  files.forEach((f) => {
    if (f.type === "file") {
      blocks.push(
        ...Array.from({ length: f.size }, () => ({ id: f.id, empty: false })),
      );
    }
    if (f.type === "space") {
      blocks.push(
        ...Array.from({ length: f.size }, () => ({ id: 0, empty: true })),
      );
    }
  });
  // console.log(blocks);
  const checksum = blocks.reduce(
    (prev: number, cur: Block, i) => prev + cur.id * i,
    0,
  );
  // console.log(blocksAsString);
  // console.log(blocks.map((b) => (b.empty ? EMPTY : b.id)).join(""));
  // console.log(blocks.map((b,i)=>`${i*b.id}`).join('+'))

  return checksum;
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
      {
        input: `13234`,
        // expected: '0...11..222' => '022211....' => 0*0 + 1*2 + 2*2 + 3*1 + 4*1 + 5*1 + 6*2 + 7*2 + 8*2  = 60
        expected: 87,
      },
      {
        input: `2333133121414131402`,
        // expected: '00...111...2...333.44.5555.6666.777.888899',
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

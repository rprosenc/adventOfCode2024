import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""));

type vec = { x: number; y: number };
type AntennasMap = Record<string, vec[]>; // no simple way to make keys 'char' typed
const dir = (a: vec, b: vec) => ({ x: b.x - a.x, y: b.y - a.y });
const add = (a: vec, dir: vec) => ({ x: a.x + dir.x, y: a.y + dir.y });
const inv = (v: vec) => ({ x: -v.x, y: -v.y });

const line = (a:vec, b:vec, maxX:number, maxY:number) => {
  const v: vec = dir(b, a);
  const result:vec[] = [];
  let A = a;
  while (A.x>=0 && A.x <= maxX && A.y>=0 && A.y <= maxY) {
    // console.log({A,a,b})
    result.push(A);
    A = add(A, v);
  }
  return result;
}

const getAntennas = (input:string[][]) => {
  const antennas: AntennasMap = {};
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const thing = input[y][x];
      if (thing !== ".") {
        const coord: vec = { x, y };
        if (!antennas[thing]) {
          antennas[thing] = [];
        }
        antennas[thing].push(coord);
      }
    }
  }
  return antennas;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const maxX = input[0].length - 1;
  const maxY = input.length - 1;
  const antennas = getAntennas(input);

  // for every antenna, calculate antinodes
  const antinodes: Set<string> = new Set();
  const save = (a: vec) => {
    if (a.x < 0 || a.y < 0 || a.x > maxX || a.y > maxY) {
      return;
    }
    antinodes.add(`${a.x}/${a.y}`);
  };
  Object.keys(antennas).forEach((antenna) => {
    // console.log(antenna);
    for (let i = 0; i < antennas[antenna].length; i++) {
      for (let j = 0; j < antennas[antenna].length; j++) {
        const a = antennas[antenna][i];
        const b = antennas[antenna][j];
        if (i===j) continue;
        const v: vec = dir(b, a);
        const A: vec = add(a, v);
        const B: vec = add(b, inv(v));
        // console.log({ a, b, v, A, B });
        save(A);
        save(B);
      }
    }
  });

  // console.log(antinodes);
  return antinodes.size;
};


const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const maxX = input[0].length - 1;
  const maxY = input.length - 1;
  const antennas = getAntennas(input);

  // for every antenna, calculate antinodes
  const antinodes: Set<string> = new Set();
  const save = (a: vec) => {
    if (a.x < 0 || a.y < 0 || a.x > maxX || a.y > maxY) {
      return;
    }
    antinodes.add(`${a.x}/${a.y}`);
  };

  Object.keys(antennas).forEach((antenna) => {
    for (let i = 0; i < antennas[antenna].length; i++) {
      for (let j = 0; j < antennas[antenna].length; j++) {
        const a = antennas[antenna][i];
        const b = antennas[antenna][j];
        if (i===j) continue;
        line(a,b, maxX, maxY).forEach(x=>save(x))
        line(b,a, maxX, maxY).forEach(x=>save(x)) 
      }
    }
  });

  // console.log(antinodes);

  // console.log(antinodes);
  return antinodes.size;
};

run({
  part1: {
    tests: [
      {
        input: `
          ............
          ........0...
          .....0......
          .......0....
          ....0.......
          ......A.....
          ............
          ............
          ........A...
          .........A..
          ............
          ............
`,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          ............
          ........0...
          .....0......
          .......0....
          ....0.......
          ......A.....
          ............
          ............
          ........A...
          .........A..
          ............
          ............
`,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

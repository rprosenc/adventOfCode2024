import run from "aocrunner";
import chalk from "chalk";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split(""));

type Vec = number[];
type VecString = `${number}|${number}`;
type Guard = "^" | ">" | "v" | "<";
type Path = Record<VecString, Direction>;
type Direction = "←" | "↑" | "→" | "↓" | "+";

interface LogOptions {
  map: string[][];
  gPos?: Vec;
  guard: Guard;
  visitedPositions?: Set<string>;
  path?: Path;
}
const log = (options: LogOptions) => {
  const { map, gPos, guard, visitedPositions, path } = options;
  console.log(
    map
      .map((line, x) =>
        line
          .map((field, y) => {
            if (gPos && x === gPos[0] && y === gPos[1]) {
              return chalk.bgRed.whiteBright(guard);
            }
            if (path && path[vec2string([x, y])]) {
              return chalk.blue(path[vec2string([x, y])]);
            }
            if (visitedPositions && visitedPositions.has(vec2string([x, y]))) {
              return chalk.gray("X");
            }
            return field;
          })
          .join(""),
      )
      .join("\n") + "\n",
  );
};

const vec2string: (v: Vec) => VecString = (v: Vec) => `${v[0]}|${v[1]}`;
const string2vec: (s: VecString) => Vec = (s: VecString) =>
  s.split("|").map((i) => parseInt(i));

const directions = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};
const rotations: Record<Guard, Guard> = {
  "^": ">",
  ">": "v",
  v: "<",
  "<": "^",
};
const pathDirs: Record<Guard, Direction> = {
  "^": "↑",
  ">": "→",
  v: "↓",
  "<": "←",
};

const part1 = (rawInput: string) => {
  const map = parseInput(rawInput);

  // initialize
  let gPos = [0, 0];
  let guard: Guard = "^";
  const visitedPositions: Set<VecString> = new Set();

  //
  // coords:
  //
  //     X ^
  //       |
  //       |
  //       +------>
  //              y
  // find guard
  map.forEach((line, x) => {
    line.forEach((field, y) => {
      if (field === "^") {
        gPos = [x, y];
        map[x][y] = "."; // repair map
        visitedPositions.add(vec2string(gPos)); // remember
      }
    });
  });
  // log({map, gPos, guard, visitedPositions})

  // move guard
  try {
    let i = 0;
    while (true) {
      i++;
      const [x, y] = gPos;
      let dir: Vec = directions[guard];
      const nextPos = [x + dir[0], y + dir[1]];
      if (
        nextPos[0] < 0 ||
        nextPos[0] >= map.length ||
        nextPos[1] < 0 ||
        nextPos[1] >= map[0].length
      ) {
        break;
      }

      if (i % 1000000 === 0) {
        console.log(i, visitedPositions.size);
        log({ map, gPos, guard, visitedPositions });
        break;
      }
      if (map[nextPos[0]][nextPos[1]] === ".") {
        visitedPositions.add(vec2string(nextPos)); // remember
        gPos = [...nextPos]; // move
        // log({map, gPos, guard, visitedPositions})
        continue;
      } else {
        guard = rotations[guard]; // turn
        continue;
      }

      break; // avoid infinite loop;
    }
  } catch (e) {}

  return visitedPositions.size;
};

const getLoop: (guard: Guard, gPos: Vec, map: string[][]) => Path = (
  guard: Guard,
  gPos: Vec,
  map: string[][],
) => {
  const visitedPositions: Set<VecString> = new Set();
  const path: Path = {};

  let i = 0;
  while (true) {
    i++;
    const [x, y] = gPos;
    let dir: Vec = directions[guard];
    visitedPositions.add(vec2string(gPos)); // remember
    const existingPath = path[vec2string(gPos)];
    path[vec2string(gPos)] =
      (existingPath && existingPath !== pathDirs[guard]) ? "+" : pathDirs[guard];

    const nextPos = [x + dir[0], y + dir[1]];
    if (
      nextPos[0] < 0 ||
      nextPos[0] >= map.length ||
      nextPos[1] < 0 ||
      nextPos[1] >= map[0].length
    ) {
      return {};
    }

    if (i % 1000000 === 0) {
      console.log(i, visitedPositions.size);
      //log({ map, gPos, guard, visitedPositions, path });
      return path;
    }
    // can move, do move stuff
    if (map[nextPos[0]][nextPos[1]] === ".") {
      //console.log({nextPos, path})
      const existingNextPath = path[vec2string(nextPos)];
      if (
        existingPath && existingNextPath && // i've been where i am, i've been where i am going to
        (existingPath!=='+' || existingNextPath !== '+') && // cannot read crossroads
        existingNextPath === pathDirs[guard]
      ) {
        // console.log({existingNextPath, existingPath})
        return path;
      }
      gPos = [...nextPos]; // move
      // log({map, gPos, guard, visitedPositions})
      continue;
    } else {
      guard = rotations[guard]; // turn
      continue;
    }

    break; // avoid infinite loop;
  }
};

const part2 = (rawInput: string) => {
  const map: string[][] = parseInput(rawInput);

  // initialize
  let startPos: Vec = [0, 0];
  const startGuard: Guard = "^";

  let gPos: Vec = [...startPos];
  let guard: Guard = startGuard;
  const visitedPositions: Set<VecString> = new Set();
  const path: Path = {};

  //
  // coords:
  //
  //     X ^
  //       |
  //       |
  //       +------>
  //              y
  // find guard
  map.forEach((line, x) => {
    line.forEach((field, y) => {
      if (field === "^") {
        gPos = [x, y];
        startPos = [x, y];
        map[x][y] = "."; // repair map
        visitedPositions.add(vec2string(gPos)); // remember
      }
    });
  });
  // log({map, gPos, guard, visitedPositions})

  // move guard

  let i = 0;
  while (true) {
    i++;
    const [x, y] = gPos;
    let dir: Vec = directions[guard];
    visitedPositions.add(vec2string(gPos)); // remember
    const existingPath = path[vec2string(gPos)];
    path[vec2string(gPos)] =
      existingPath && existingPath !== pathDirs[guard] ? "+" : pathDirs[guard];

    const nextPos = [x + dir[0], y + dir[1]];
    if (
      nextPos[0] < 0 ||
      nextPos[0] >= map.length ||
      nextPos[1] < 0 ||
      nextPos[1] >= map[0].length
    ) {
      break;
    }

    if (i % 1000000 === 0) {
      //console.log(i, visitedPositions.size);
      log({ map, gPos, guard, visitedPositions, path });
      console.log(chalk.blue("loop"));
      break;
    }
    // can move, do move stuff
    if (map[nextPos[0]][nextPos[1]] === ".") {
      gPos = [...nextPos]; // move
      // log({map, gPos, guard, visitedPositions})
      continue;
    } else {
      guard = rotations[guard]; // turn
      continue;
    }

    break; // avoid infinite loop;
  }

  // get all possible places
  const possibleObstacles: VecString[] = [];
  (Object.keys(path) as VecString[]).forEach((pos: VecString, i) => {
    possibleObstacles.push(pos);
  });

  // test
  // const possibleObstacles: VecString[] = ['6|3'];
  // TODO: test for every possible obstacle if a loop happens
  let foundLoops = 0;
  possibleObstacles.forEach((o) => {
    const _map = structuredClone(map);
    const [x, y] = string2vec(o);
    _map[x][y] = "o";
    const path = getLoop(startGuard, startPos, _map);
    if (Object.keys(path).length) {
      foundLoops++;
      //log({ map: _map, guard, path });
    }
  });

  return foundLoops;
};

run({
  part1: {
    tests: [
      {
        input: `
        ....#.....
        .........#
        ..........
        ..#.......
        .......#..
        ..........
        .#..^.....
        ........#.
        #.........
        ......#...
        `,
        expected: 41,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ....#.....
        .........#
        ..........
        ..#.......
        .......#..
        ..........
        .#..^.....
        ........#.
        #.........
        ......#...
        `,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

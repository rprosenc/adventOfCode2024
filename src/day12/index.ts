import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""));

type Coord = {
  x: number;
  y: number;
};

type Region = {
  label: string;
  area: number;
  perimeter: number;
  plots: Coord[];
};

const eq = (a: Coord, b: Coord) => a.x===b.x && a.y===b.y;
const overlap = (a: Coord[], b: Coord[]) => {
  for (let i = 0; i < a.length; i++) {
    if (b.findIndex((e) => eq(a[i],e)) >= 0) {
      return true;
    }
  }

  return false;
};

const part1 = (rawInput: string) => {
  const map = parseInput(rawInput);

  const regions: Region[] = [];
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      const position: Coord = { x, y };
      const label = map[x][y];
      const neighbors: Coord[] = []; // neighbor field WITHIN my region
      if (x > 0 && map[x - 1][y] === label) {
        neighbors.push({ x: x - 1, y });
      }
      if (x + 1 < map.length && map[x + 1][y] === label) {
        neighbors.push({ x: x + 1, y });
      }
      if (y > 0 && map[x][y - 1] === label) {
        neighbors.push({ x, y: y - 1 });
      }
      if (y + 1 < map[x].length && map[x][y + 1] === label) {
        neighbors.push({ x, y: y + 1 });
      }
      let perimeter = 0;
      perimeter += x > 0 ? +(map[x - 1][y] !== label) : 1; // either inner perimeter, or 1 for outer
      perimeter += x + 1 < map.length ? +(map[x + 1][y] !== label) : 1;
      perimeter += y > 0 ? +(map[x][y - 1] !== label) : 1;
      perimeter += y + 1 < map[x].length ? +(map[x][y + 1] !== label) : 1;

      const r = regions.findIndex(
        (r) => r.label === label && overlap(neighbors, r.plots),
      );
      // if (r>=0 && label === 'I') {
      //   console.log(regions[r], position)
      // }
      let region;
      if (r < 0) {
        region = { label, perimeter: 0, area: 0, plots: [] }
        regions.push(region);
      } else {
        region = regions[r];
      }
      region.perimeter += perimeter;
      region.area += 1;
      region.plots.push({ x, y });
    }
  }
  // console.log(regions.map(r=>({...r, plots:r.plots.map(p=>`${p.x}/${p.y}`).join(', ')})));
  console.log(regions.map(r=>({l:r.label, a:r.area, p:r.perimeter, plots:r.plots.length})));
  return Object.values(regions)
    .map((r) => r.perimeter * r.area)
    .reduce((agg, cur) => agg + cur, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      // {
      //   input: `
      //   AAAA
      //   BBCD
      //   BBCC
      //   EEEC`,
      //   expected: 140,
      // },
      // {
      //   input: `
      //   OOOOO
      //   OXOXO
      //   OOOOO
      //   OXOXO
      //   OOOOO`,
      //   expected: 772,
      // },
      {
        input: `
        RRRRIICCFF
        RRRRIICCCF
        VVRRRCCFFF
        VVRCCCJFFF
        VVVVCJJCFE
        VVIVCCJJEE
        VVIIICJJEE
        MIIIIIJJEE
        MIIISIJEEE
        MMMISSJEEE`,
        expected: 1930,
      },
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

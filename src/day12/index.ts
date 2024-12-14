import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""));

type Coord = {
  x: number;
  y: number;
};

type Pos = `${number}/${number}`;

type Plot = {
  x: number;
  y: number;
  label: string;
  position?: Pos;
};

type Region = {
  label: string;
  area: number;
  perimeter: number;
  plots: Plot[];
  sides: Side[];
};

type SidePosition = "l" | "r" | "t" | "b";

type Side = {
  position: SidePosition;
  plots: Plot[];
};

// const eq = (a: Coord, b: Coord) => a.x===b.x && a.y===b.y;
const eq = (a: Plot, b: Plot) =>
  a.x === b.x && a.y === b.y && a.label === b.label;

const findRegion = (plot: Plot, map: Plot[], region: Plot[]) => {
  if (region.find((r) => r.x === plot.x && r.y === plot.y)) return []; // abort, plot already in region
  if (region.length && region[0].label !== plot.label) return []; // abort, plot NOT part of region

  region.push(plot); // if no reason to abort, add plot

  // look at neighbors
  const left = map.find(
    (e) => e.x === plot.x - 1 && e.y === plot.y && e.label === plot.label,
  );
  const right = map.find(
    (e) => e.x === plot.x + 1 && e.y === plot.y && e.label === plot.label,
  );
  const top = map.find(
    (e) => e.x === plot.x && e.y === plot.y - 1 && e.label === plot.label,
  );
  const bottom = map.find(
    (e) => e.x === plot.x && e.y === plot.y + 1 && e.label === plot.label,
  );

  if (left) findRegion(left, map, region);
  if (right) findRegion(right, map, region);
  if (top) findRegion(top, map, region);
  if (bottom) findRegion(bottom, map, region);

  return region;
};

const sideContains = (s: Side, p: Plot) => {
  if (s.plots.length === 0) {
    return false;
  }
  return s.plots.findIndex((e) => eq(e, p)) >= 0;
};

const nextToSide = (s:Side, p:Plot) => {
  return (
  (s.position === "t" &&
    sideContains(s, {
      ...p,
      y: p.y - 1,
      position: `${p.x}/${p.y - 1}`,
    })) ||
  (s.position === "b" &&
    sideContains(s, {
      ...p,
      y: p.y + 1,
      position: `${p.x}/${p.y + 1}`,
    })) ||
  (s.position === "l" &&
    sideContains(s, {
      ...p,
      x: p.x - 1,
      position: `${p.x - 1}/${p.y}`,
    })) ||
  (s.position === "r" &&
    sideContains(s, {
      ...p,
      x: p.x + 1,
      position: `${p.x + 1}/${p.y}`,
    }))
  )
}

const mergeSidesInPlace = (sides:Side[]) => {
  for (let i = 0; i < sides.length; i++) {
    const currentSide = sides[i];
    for (let j = 0; j < sides.length; j++) {
      const otherSide = sides[j];

      if (i === j) continue;
      if (currentSide.position !== otherSide.position) continue;

      // if (i === 1) console.log(sides[i]);

      for (let plot of otherSide.plots) {
        // if (i === 1) console.log('compare', plot, 'against', currentBorder.side);

        if (nextToSide(currentSide, plot)) {
          // these are the same side, move plots over!
          currentSide.plots.push(...otherSide.plots);
          otherSide.plots = [];
        }
      }
    }
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const map: Plot[] = [];
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      map.push({ x, y, label: input[x][y] });
    }
  }
  const regions: Region[] = [];
  map.forEach((e) => {
    // element is already in a region, continue
    if (regions.find((r) => r.plots.find((p) => eq(e, p)))) return;

    regions.push({
      label: e.label,
      area: 0,
      perimeter: 0,
      plots: findRegion(e, map, []),
      sides: [],
    });
  });

  regions.forEach((r: Region) => {
    // perimeter for region is all outer sides
    r.plots.forEach((p) => {
      r.perimeter += p.x > 0 ? +(input[p.x - 1][p.y] !== p.label) : 1; // either inner perimeter, or 1 for outer
      r.perimeter +=
        p.x + 1 < input.length ? +(input[p.x + 1][p.y] !== p.label) : 1;
      r.perimeter += p.y > 0 ? +(input[p.x][p.y - 1] !== p.label) : 1;
      r.perimeter +=
        p.y + 1 < input[p.x].length ? +(input[p.x][p.y + 1] !== p.label) : 1;

      r.area += 1;
    });
  });

  // console.log(regions,1);

  return Object.values(regions)
    .map((r) => r.perimeter * r.area)
    .reduce((agg, cur) => agg + cur, 0);
};

const part2 = (rawInput: string) => {
  // console.log(rawInput);
  const input = parseInput(rawInput);
  const map: Plot[] = [];
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      map.push({ x, y, label: input[x][y] });
    }
  }
  const regions: Region[] = [];
  map.forEach((e) => {
    // element is already in a region, continue
    if (regions.find((r) => r.plots.find((p) => eq(e, p)))) return;

    regions.push({
      label: e.label,
      area: 0,
      perimeter: 0,
      plots: findRegion(e, map, []),
      sides: [],
    });
  });
  // calculate area and add position for easier access
  regions.forEach((r) => {
    r.plots.forEach((p) => {
      r.area += 1;
      p.position = `${p.x}/${p.y}` as Pos;
    });
  });

  regions.forEach((r: Region, i) => {
    let sides: Side[] = [];
    // first, create a list of trivial sides - each of length 1
    r.plots.forEach((p) => {
      // left border
      if (p.x === 0) {
        // left map border
        sides.push({ position: "t", plots: [p] });
      }
      if (p.x === input.length - 1) {
        // right map border
        sides.push({ position: "b", plots: [p] });
      }
      if (p.y === 0) {
        // top map border
        sides.push({ position: "l", plots: [p] });
      }
      if (p.y === input[p.x].length - 1) {
        // bottom map border
        sides.push({ position: "r", plots: [p] });
      }
      if (p.x > 0 && input[p.x - 1][p.y] !== p.label)
        sides.push({ position: "t", plots: [p] });
      if (p.x + 1 < input.length && input[p.x + 1][p.y] !== p.label)
        sides.push({ position: "b", plots: [p] });
      if (p.y > 0 && input[p.x][p.y - 1] !== p.label)
        sides.push({ position: "l", plots: [p] });
      if (p.y + 1 < input[p.x].length && input[p.x][p.y + 1] !== p.label)
        sides.push({ position: "r", plots: [p] });
    });
    //if (i===1)  console.log(sides.map(b=>b.side + ' ' + JSON.stringify(b.plots)));

    // merge (sub)sides that belong together
    // repeat arbitrary 4 times to avoid having to really think about what happens
    mergeSidesInPlace(sides);
    mergeSidesInPlace(sides);
    mergeSidesInPlace(sides);
    mergeSidesInPlace(sides);

    r.sides = sides.filter((b) => b.plots.length);
    // console.log(r.sides.map((b,i) => i.toString().padEnd(3, ' ') + b.plots[0].label + '  ' +b.position + " " + JSON.stringify(b.plots.map(e=>e.position))));
  });

  // console.log(
  //   regions.map((r) => ({
  //     label: r.label,
  //     area: r.area,
  //     sides: r.sides.length,
  //   })),
  // );
  return Object.values(regions)
    .map((r) => r.sides.length * r.area)
    .reduce((agg, cur) => agg + cur, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        AAAA
        BBCD
        BBCC
        EEEC`,
        expected: 140,
      },
      {
        input: `
        OOOOO
        OXOXO
        OOOOO
        OXOXO
        OOOOO`,
        expected: 772,
      },
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
      {
        input: `
        AAAA
        BBCD
        BBCC
        EEEC`,
        expected: 80,
      },
      {
        input: `
        OOOOO
        OXOXO
        OOOOO
        OXOXO
        OOOOO`,
        expected: 436,
      },
      {
        input: `
        EEEEE
        EXXXX
        EEEEE
        EXXXX
        EEEEE`,
        expected: 236,
      },
      {
        input: `
        AAAAAA
        AAABBA
        AAABBA
        ABBAAA
        ABBAAA
        AAAAAA`,
        expected: 368,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

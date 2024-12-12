import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""));

type Coord = {
  x: number;
  y: number;
};

type Plot = {
  x:number,
  y:number,
  label:string
}

type Region = {
  label: string;
  area: number;
  perimeter: number;
  plots: Plot[];
};

// const eq = (a: Coord, b: Coord) => a.x===b.x && a.y===b.y;
const eq = (a: Plot, b: Plot) => a.x===b.x && a.y===b.y && a.label===b.label;
const overlap = (a: Coord[], b: Coord[]) => {
  for (let i = 0; i < a.length; i++) {
    if (b.findIndex((e) => eq(a[i],e)) >= 0) {
      return true;
    }
  }

  return false;
};

const findRegion = (plot:Plot, map:Plot[], region:Plot[]) => {
  if (region.find(r=>r.x===plot.x && r.y===plot.y)) return []; // abort, plot already in region
  if (region.length && region[0].label !== plot.label) return []; // abort, plot NOT part of region
  
  region.push(plot); // if no reason to abort, add plot

  // look at neighbors
  const neighbors:Plot[] = [];  
  const left = map.find(e=>e.x===plot.x-1 && e.y===plot.y && e.label===plot.label);
  const right = map.find(e=>e.x===plot.x+1 && e.y===plot.y && e.label===plot.label);
  const top = map.find(e=>e.x===plot.x && e.y===plot.y-1 && e.label===plot.label);
  const bottom = map.find(e=>e.x===plot.x && e.y===plot.y+1 && e.label===plot.label);

  if (left) neighbors.push(...findRegion(left, map, region))
  if (right) neighbors.push(...findRegion(right, map, region))
  if (top) neighbors.push(...findRegion(top, map, region))
  if (bottom) neighbors.push(...findRegion(bottom, map, region))

  return region;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const map:Plot[]= []
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      map.push({x,y,label:input[x][y]});
    }
  }
  const regions:Region[] = [];
  map.forEach(e=>{
    // element is already in a region, continue
    if (regions.find(r=>r.plots.find(p=>eq(e,p)))) return;

    regions.push(
      {
        label:e.label, 
        area:0, 
        perimeter:0, 
        plots:findRegion(e, map, [])
      }
    );
  })

  regions.forEach((r:Region)=>{
    // perimeter for region is all outer borders
    r.plots.forEach(p=>{
        r.perimeter += p.x > 0 ? +(input[p.x - 1][p.y] !== p.label) : 1; // either inner perimeter, or 1 for outer
        r.perimeter += p.x + 1 < input.length ? +(input[p.x + 1][p.y] !== p.label) : 1;
        r.perimeter += p.y > 0 ? +(input[p.x][p.y - 1] !== p.label) : 1;
        r.perimeter += p.y + 1 < input[p.x].length ? +(input[p.x][p.y + 1] !== p.label) : 1;

        r.area += 1;
    });
  })

  // console.log(regions,1);

  return Object.values(regions)
    .map((r) => r.perimeter * r.area)
    .reduce((agg, cur) => agg + cur, 0);

  // const regions: Region[] = [];
  // for (let x = 0; x < map.length; x++) {
  //   for (let y = 0; y < map[x].length; y++) {
  //     const position: Coord = { x, y };
  //     const label = map[x][y];
  //     const neighbors: Coord[] = []; // neighbor field WITHIN my region
  //     if (x > 0 && map[x - 1][y] === label) {
  //       neighbors.push({ x: x - 1, y });
  //     }
  //     if (x + 1 < map.length && map[x + 1][y] === label) {
  //       neighbors.push({ x: x + 1, y });
  //     }
  //     if (y > 0 && map[x][y - 1] === label) {
  //       neighbors.push({ x, y: y - 1 });
  //     }
  //     if (y + 1 < map[x].length && map[x][y + 1] === label) {
  //       neighbors.push({ x, y: y + 1 });
  //     }
  //     let perimeter = 0;
  //     perimeter += x > 0 ? +(map[x - 1][y] !== label) : 1; // either inner perimeter, or 1 for outer
  //     perimeter += x + 1 < map.length ? +(map[x + 1][y] !== label) : 1;
  //     perimeter += y > 0 ? +(map[x][y - 1] !== label) : 1;
  //     perimeter += y + 1 < map[x].length ? +(map[x][y + 1] !== label) : 1;

  //     const r = regions.findIndex(
  //       (r) => r.label === label && overlap(neighbors, r.plots),
  //     );
  //     // if (r>=0 && label === 'I') {
  //     //   console.log(regions[r], position)
  //     // }
  //     let region;
  //     if (r < 0) {
  //       region = { label, perimeter: 0, area: 0, plots: [] }
  //       regions.push(region);
  //     } else {
  //       region = regions[r];
  //     }
  //     region.perimeter += perimeter;
  //     region.area += 1;
  //     region.plots.push({ x, y });
  //   }
  // }
  // // console.log(regions.map(r=>({...r, plots:r.plots.map(p=>`${p.x}/${p.y}`).join(', ')})));
  // console.log(regions.map(r=>({l:r.label, a:r.area, p:r.perimeter, plots:r.plots.length})));
  // return Object.values(regions)
  //   .map((r) => r.perimeter * r.area)
  //   .reduce((agg, cur) => agg + cur, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

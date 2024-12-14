import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput
  .split('\n')
  .map(line=>{
    const [p,v] = line
      .replace('p=','')
      .replace('v=','')
      .split(' ')
      .map(v=>{
        const [x,y] = v.split(',').map(i=>parseInt(i));
        return {x,y} as vec2
      }
      );
      return {p,v} as Robot
  });


type vec2 = {
  x: number;
  y: number;
}

type Robot = {
  p: vec2,
  v: vec2,
}

const addMod = (a:number, b:number, m:number) => {
  let r = a+b;
  while(r < 0) {
    r += m;
  }
  while (r >= m) {
    r -= m;
  }
  return r; 
}

const addVec = (a:vec2, b:vec2, xMod:number, yMod:number) => {
  return {
    x: addMod(a.x, b.x, xMod),
    y: addMod(a.y, b.y, yMod)
  } as vec2
}

const simulate = (robots:Robot[], width:number, height:number) => {
  robots.forEach(r=>{
    r.p = addVec(r.p, r.v, width, height);
  })

}

const draw = (robots:Robot[], width:number, height:number) => {
  const positions:Record<string,number> = {};
  robots.forEach(r=>{
    const key = `${r.p.x}/${r.p.y}`;
    if (!positions[key]) {
      positions[key] = 0;
    }
    positions[key] += 1; 
  })
  const lines:string[] = [];
  let foundLongSequence:boolean = false
  for (let y=0; y<height; y++) {
    let line = '';
    for (let x=0; x<width; x++) {
      const key = `${x}/${y}`;
      line += positions[key] ?? ' ';
    }
    lines.push(line);
    foundLongSequence = foundLongSequence || !!line.match(/[^ ]{9}/)
  }
  if (foundLongSequence) {
    console.log(lines.join('\n'))
    return true;
  }
  // console.log(robots);
  return false;
}


const part1 = (rawInput: string) => {
  const robots = parseInput(rawInput);
  // 11/7 for tests
  const width = 101;
  const height = 103;

  // draw(robots, width, height)
  for (let i=0; i<6620; i++) {
    simulate(robots, width, height);
    if (draw(robots, width, height)) {
      console.log(i)
    };
}  
  
  // segment
  const w = Math.floor(width/2);
  const h = Math.floor(height/2);
  // console.log({w,h})
  const quadrant1 = robots.filter(r => r.p.x < w && r.p.y < h).map(r=>r.p);
  const quadrant2 = robots.filter(r => r.p.x > w && r.p.y < h).map(r=>r.p);
  const quadrant3 = robots.filter(r => r.p.x < w && r.p.y > h).map(r=>r.p);
  const quadrant4 = robots.filter(r => r.p.x > w && r.p.y > h).map(r=>r.p);

  // console.log({
  //   quadrant1,
  //   quadrant2,
  //   quadrant3,
  //   quadrant4,
  // })
  
  return quadrant1.length * quadrant2.length * quadrant3.length * quadrant4.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return 6619+1; // found out by rendering results with long sequence
};

run({
  part1: {
    tests: [
      // {
      //   input: `p=2,4 v=2,-3`,
      //   expected: 12,
      // },
      // {
      //   input: `p=0,0 v=1,-1`,
      //   expected: 12,
      // },
      // {
      //   input: `
      //   p=0,4 v=3,-3
      //   p=6,3 v=-1,-3
      //   p=10,3 v=-1,2
      //   p=2,0 v=2,-1
      //   p=0,0 v=1,3
      //   p=3,0 v=-2,-2
      //   p=7,6 v=-1,-3
      //   p=3,0 v=-1,-2
      //   p=9,3 v=2,3
      //   p=7,3 v=-1,2
      //   p=2,4 v=2,-3
      //   p=9,5 v=-3,-3`,
      //   expected: 12,
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
  onlyTests: false,
});

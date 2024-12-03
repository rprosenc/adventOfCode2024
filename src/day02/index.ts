import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(l=>l.split(' ').map(i=>parseInt(i)));

const isReportSafe = (report:number[])=>{
  // test if safe or not
  const diffs:number[] = [];
  report.forEach((level, i)=>{
    if (i+1 < report.length) {
      diffs.push(report [i+1] - report[i])
    }
  });

  const allNegative = diffs.every((d)=>d<0);
  const allPositive = diffs.every((d)=>d>0);
  const spaced = diffs.every((d, i)=> {
    const abs = Math.abs(d);
    return abs >=1 && abs <=3;
  })

  return (allNegative||allPositive) && spaced ? 1 : 0;
}

const part1 = (rawInput: string) => {
  const input: number[][] = parseInput(rawInput);

  const safe = input.map(isReportSafe)

  return safe.filter(Boolean).length
};

// brute force
const part2 = (rawInput: string) => {
  const input: number[][] = parseInput(rawInput);
  let result = 0;

  for (let i=0; i<input.length; i++) {
    const report = input[i];
    if (isReportSafe(report)) {
      result++;
      continue;
    }

    for (let j=0; j<report.length; j++) {
      const shortReport = [...report];
      shortReport.splice(j,1); 
      if (isReportSafe(shortReport)) {
        result++;
        break;
      }
    }
  }

  return result;
}

// solution too low
const part2_ = (rawInput: string) => {
  const input: number[][] = parseInput(rawInput);
  const safe = input.map(report=>{
    const diffs:number[] = [];
    report.forEach((level, i)=>{
      if (i+1 < report.length) {
        diffs.push(report [i+1] - report[i])
      }
    });
    const allNegative = diffs.every((d)=>d<0);
    const allPositive = diffs.every((d)=>d>0);
    const spaced = diffs.every((d, i)=> {
      const abs = Math.abs(d);
      return abs >=1 && abs <=3;
    })

    // all good, can count that
    if ((allNegative||allPositive) && spaced) {
      return 1;
    }
  


    // search single wrong element
    let unsafeBySpace = -1; 
    if (!spaced) {
      const spacings = diffs.map((d, i)=> {
        const abs = Math.abs(d);
        return abs >=1 && abs <=3;
      })
      // too many errors, cannot fix
      if (spacings.filter(s=>!s).length > 1) return 0;
      unsafeBySpace = spacings.findIndex((v)=>!v) // the position is the same, although the arrays lengths differ by 1
    }

    let unsafeByGradient = -1; 
    if (!(allNegative||allPositive)) {
      let gradient:number[] = diffs.map(d=> d<0 ? -1 : d>0 ? 1 : 0);
      const negatives = gradient.filter(l=>l<0).length;
      const positives = gradient.filter(l=>l>0).length;
      const almostAllNegative = negatives === diffs.length-1;
      const almostAllPositive = positives === diffs.length-1;
      if (!(almostAllNegative || almostAllPositive)) {
        // too many errors, cannot fix
        return 0;
      }

      // assume more than two levels, thus almost all are either positive or negative
      if (almostAllNegative) {
        unsafeByGradient = gradient.findIndex((v=>v>=0))
      }
      if (almostAllPositive) {
        unsafeByGradient = gradient.findIndex((v=>v<=0))
      }
    }

    let safeReport:number[];

    if (unsafeByGradient === unsafeBySpace) {
      safeReport = [...report];
      safeReport.splice(unsafeByGradient,1)
      return isReportSafe(safeReport);
    }

    if (unsafeBySpace>=0) {
      safeReport = [...report];
      safeReport.splice(unsafeByGradient,1)
      return isReportSafe(safeReport);
    }

    if (unsafeByGradient>=0) {
      safeReport = [...report];
      safeReport.splice(unsafeByGradient,1)
      return isReportSafe(safeReport);
    }

    return 0;
  })


  return safe.filter(Boolean).length

};

run({
  part1: {
    tests: [
      {
        input: `
        7 6 4 2 1
        1 2 7 8 9
        9 7 6 2 1
        1 3 2 4 5
        8 6 4 4 1
        1 3 6 7 9
`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        7 6 4 2 1
        1 2 7 8 9
        9 7 6 2 1
        1 3 2 4 5
        8 6 4 4 1
        1 3 6 7 9
`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

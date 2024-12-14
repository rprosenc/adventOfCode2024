import run from "aocrunner";
import Decimal from "decimal.js";

const parseInput = (rawInput: string) => {
  const machines = rawInput.split("\n\n").map((m) => {
    const [lineA, lineB, lineP] = m.split("\n");
    const [Ax, Ay] = lineA
      .replace("Button A: X", "")
      .replace(" Y", "")
      .replaceAll("+", "")
      .split(",")
      .map((i) => new Decimal(i));
    const [Bx, By] = lineB
      .replace("Button B: X", "")
      .replace(" Y", "")
      .replaceAll("+", "")
      .split(",")
      .map((i) => new Decimal(i));
    const [Px, Py] = lineP
      .replace("Prize: X=", "")
      .replace(" Y=", "")
      .replaceAll("+", "")
      .split(",")
      .map((i) => new Decimal(i).plus("10000000000000"));
    return {
      A: [Ax, Ay],
      B: [Bx, By],
      P: [Px, Py],
    } as Machine;
  });

  return machines;
};

type Machine = {
  A: [Decimal, Decimal];
  B: [Decimal, Decimal];
  P: [Decimal, Decimal];
};

const solveForN = (point: [Decimal, Decimal], k: Decimal) => {
  return point[0].negated().times(k).plus(point[1]);
};

const calcMachine = (input: Machine) => {
  const kA = input.A[1].dividedBy(input.A[0]);
  const nA = solveForN(input.P, kA);

  const kB = input.B[1].dividedBy(input.B[0]);
  const nB = solveForN(input.P, kB);

  // case I a x b`
  const fxI = nB.dividedBy(kA.minus(kB));
  const fyI = fxI.times(kA);

  let stepsIA = fxI.dividedBy(input.A[0]);

  let stepsIB = input.P[0].minus(fxI).dividedBy(input.B[0]);

  // case I b x a`
  const fxII = nA.dividedBy(kB.minus(kA));
  const fyII = fxII.times(kA);

  let stepsIIA = fxII.dividedBy(input.B[0]);

  let stepsIIB = input.P[0].minus(fxII).dividedBy(input.B[0]);

  // fix floating point number problems
  // which should NOT OCCUR WHEN USING Decimal.js....
  if (stepsIA.toString().match(/\d+\.(\d)\1{10}/gm)) {
    stepsIA = stepsIA.round();
  }
  if (stepsIB.toString().match(/\d+\.(\d)\1{10}/gm)) {
    stepsIB = stepsIB.round();
  }
  if (stepsIIA.toString().match(/\d+\.(\d)\1{10}/gm)) {
    stepsIIA = stepsIIA.round();
  }
  if (stepsIIB.toString().match(/\d+\.(\d)\1{10}/gm)) {
    stepsIIB = stepsIIB.round();
  }

  const testIA = stepsIA.times(input.P[1]).equals(fxI);
  const testIIA = stepsIIA.times(input.P[1]).equals(fxI);

  // solution only for whole numbers
  let solutionI =
    stepsIA.modulo(1).isZero() && stepsIB.modulo(1).isZero()
      ? stepsIA.times(3).plus(stepsIB)
      : 0;
  let solutionII =
    stepsIIA.modulo(1).isZero() && stepsIIB.modulo(1).isZero()
      ? stepsIIA.times(3).plus(stepsIIB)
      : 0;

  // no more than 100 steps per button - deactivate fo part II
  // if (stepsIA.comparedTo(100)===1 || stepsIB.comparedTo(100)===1) {
  //   solutionI = 0;
  // }
  // if (stepsIIA.comparedTo(100)===1 || stepsIIB.comparedTo(100)===1) {
  //   solutionII = 0;
  // }

  if (solutionI && solutionII) {
    console.log(input);
    console.log({
      stepsIA: stepsIA.toString(),
      stepsIB: stepsIB.toString(),
      solutionI: solutionI.toString(),
      stepsIIA: stepsIIA.toString(),
      stepsIIB: stepsIIB.toString(),
      solutionII: solutionII.toString(),
      min: Decimal.min(solutionI, solutionII)
      // fxI: fxI.toString(),
    });
  }

  // smaller of two valid solutions
  if (solutionI && solutionI) {
    return Decimal.min(solutionI, solutionII);
  }

  // otherwise return the first non-zero solution or zero if there are no solutions
  return solutionI ? solutionI : solutionII;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const solutions = input.map((m) => calcMachine(m));
  // console.log(solutions);
  return solutions
    .reduce((agg: Decimal, cur) => agg.plus(cur), new Decimal(0))
    .toNumber();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const solutions = input.map((m) => calcMachine(m));
  // console.log(solutions);
  return solutions
    .reduce((agg: Decimal, cur) => agg.plus(cur), new Decimal(0))
    .toNumber();
};

run({
  part1: {
    tests: [
      // {
      //   input: `
      //     Button A: X+94, Y+34
      //     Button B: X+22, Y+67
      //     Prize: X=8400, Y=5400`,
      //   expected: 280,
      // },
      // {
      //   input: `
      //     Button A: X+17, Y+86
      //     Button B: X+84, Y+37
      //     Prize: X=7870, Y=6450`,
      //   expected: 200,
      // },
      // {
      //   input: `
      //     Button A: X+94, Y+34
      //     Button B: X+22, Y+67
      //     Prize: X=8400, Y=5400
      //     Button A: X+26, Y+66
      //     Button B: X+67, Y+21
      //     Prize: X=12748, Y=12176
      //     Button A: X+17, Y+86
      //     Button B: X+84, Y+37
      //     Prize: X=7870, Y=6450
      //     Button A: X+69, Y+23
      //     Button B: X+27, Y+71
      //     Prize: X=18641, Y=10279`,
      //   expected: 480,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Button A: X+94, Y+34
          Button B: X+22, Y+67
          Prize: X=8400, Y=5400

          Button A: X+26, Y+66
          Button B: X+67, Y+21
          Prize: X=12748, Y=12176

          Button A: X+17, Y+86
          Button B: X+84, Y+37
          Prize: X=7870, Y=6450

          Button A: X+69, Y+23
          Button B: X+27, Y+71
          Prize: X=18641, Y=10279`,
        expected: 480,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

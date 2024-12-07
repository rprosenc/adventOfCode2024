import run from "aocrunner";
import chalk from "chalk";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((equation) => {
    const [result, statement] = equation.split(": ");
    return {
      result: parseInt(result),
      operands: statement.split(" ").map((i) => parseInt(i)),
    };
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input)

  let result = 0;
  const trueEquations = new Set();
  for (let i = 0; i < input.length; i++) {
    // al equations
    const operands = input[i].operands;
    for (let j = 0; j < Math.pow(2, operands.length - 1); j++) {
      // all operator combinations
      const operators = j
        .toString(2) // make binary
        .padStart(operands.length - 1, "0")
        .replaceAll("0", "+")
        .replaceAll("1", "*")
        .split("");
      // console.log(operands, operators)
      let intermediateResult = operands[0];
      for (let k = 1; k < operands.length; k++) {
        if (operators[k - 1] === "+") {
          intermediateResult += operands[k];
        }
        if (operators[k - 1] === "*") {
          intermediateResult *= operands[k];
        }
        // console.log(operators[k-1], ': ', intermediateResult)
      }
      if (intermediateResult === input[i].result) {
        trueEquations.add(i);
        //   console.log('matching: ' + operands, operators, intermediateResult)
        // } else {
        //   console.log('wrong: ' + operands, operators, intermediateResult)
      }
    }
  }
  return (Array.from(trueEquations.values()) as number[]).reduce(
    (prev: number, cur: number) => prev + input[cur].result,
    0,
  );
};

// https://www.tutorialspoint.com/python-k-length-combinations-from-given-characters
const generate_combinations = (characters: string[], k: number) => {
  const combinations_list: string[] = [];

  const generate_helper = (
    current_combination: string,
    remaining_characters: string[],
  ) => {
    if (current_combination.length === k) {
      combinations_list.push(current_combination);
      return;
    }

    for (const char of remaining_characters) {
      generate_helper(current_combination + char, remaining_characters);
    }
  };

  generate_helper("", characters);
  return combinations_list;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  console.log();

  let result = 0;
  const trueEquations = new Set();
  for (let i = 0; i < input.length; i++) {
    // al equations
    const operands = input[i].operands;
    const operatorsList = generate_combinations(
      ["+", "*", "|"],
      operands.length - 1,
    );
    for (const op of operatorsList) {
      const operators = op.split("");
      let intermediateResult = operands[0];
      for (let k = 1; k < operands.length; k++) {
        if (operators[k - 1] === "+") {
          intermediateResult += operands[k];
        }
        if (operators[k - 1] === "*") {
          intermediateResult *= operands[k];
        }
        if (operators[k - 1] === "|") {
          intermediateResult = parseInt(`${intermediateResult}${operands[k]}`);
        }
        // console.log(operators[k-1], ': ', intermediateResult)
      }
      if (intermediateResult === input[i].result) {
        trueEquations.add(i);
        // console.log("matching: " + operands, operators, intermediateResult);
      } else {
        // console.log("wrong: " + operands, operators, intermediateResult);
      }
    }
  }
  return (Array.from(trueEquations.values()) as number[]).reduce(
    (prev: number, cur: number) => prev + input[cur].result,
    0,
  );
};

run({
  part1: {
    tests: [
      {
        input: `
        190: 10 19
        `,
        expected: 190,
      },
      {
        input: `
        3267: 81 40 27
        `,
        expected: 3267,
      },
      {
        input: `
        190: 10 19
        3267: 81 40 27
        83: 17 5
        156: 15 6
        7290: 6 8 6 15
        161011: 16 10 13
        192: 17 8 14
        21037: 9 7 18 13
        292: 11 6 16 20
        `,
        expected: 3749,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        156: 15 6
        `,
        expected: 156,
      },
      {
        input: `
        7290: 6 8 6 15
        `,
        expected: 7290,
      },
      {
        input: `
        190: 10 19
        3267: 81 40 27
        83: 17 5
        156: 15 6
        7290: 6 8 6 15
        161011: 16 10 13
        192: 17 8 14
        21037: 9 7 18 13
        292: 11 6 16 20
        `,
        expected: 11387,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

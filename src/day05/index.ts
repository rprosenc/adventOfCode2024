import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [rawRules, rawUpdates] = rawInput.split(/\n\n/);
  return {
    rules: rawRules
      .split("\n")
      .map((l) => l.split("|").map((i) => parseInt(i))),
    updates: rawUpdates
      .split("\n")
      .map((l) => l.split(",").map((i) => parseInt(i))),
  };
};

interface Input {
  rules: number[][];
  updates: number[][];
}

const isUpdateValid = (rules:number[][], update:number[]) => {
    for (let j = 0; j < rules.length; j++) {
      const rule = rules[j];
      const [before, after] = rule;
      const bIndex = update.indexOf(before);
      const aIndex = update.indexOf(after);
      if (bIndex < 0 || aIndex < 0) {
        // rule does not apply
        continue;
      }
      if (bIndex > aIndex) {
        // rule is broken
        return false
      }
    }

    return true;
}

const middlePage = (update:number[]) => update[Math.floor(update.length / 2)];


const part1 = (rawInput: string) => {
  const input: Input = parseInput(rawInput);

  let middlePagesSum = 0;
  input.updates
    .filter(update=>isUpdateValid(input.rules, update))
    .forEach(update=>middlePagesSum += middlePage(update));
    
  return middlePagesSum;
};

const part2 = (rawInput: string) => {
  const input: Input = parseInput(rawInput);

  let middlePagesSum = 0;

  const brokenUpdates = input.updates.filter(update=>!isUpdateValid(input.rules, update));

  // fix broken updates
  for (let i = 0; i < brokenUpdates.length; i++) {
    const update = brokenUpdates[i];

    let repeat = true;
    while(repeat) {
      repeat = false;
      for (let j = 0; j < input.rules.length; j++) {
        const rule = input.rules[j];
        const [before, after] = rule;
        const bIndex = update.indexOf(before);
        const aIndex = update.indexOf(after);
        if (bIndex < 0 || aIndex < 0) {
          // rule does not apply
          continue;
        }
        if (bIndex > aIndex) {
          [update[aIndex],update[bIndex]] = [update[bIndex], update[aIndex]];
          // if an error was found, make sure to repeat check of that update
          repeat = true;
        }
      }
    }
  middlePagesSum += middlePage(update);
  }

  return middlePagesSum;
};

run({
  part1: {
    tests: [
      {
        input: `
        47|53
        97|13
        97|61
        97|47
        75|29
        61|13
        75|53
        29|13
        97|29
        53|29
        61|53
        97|53
        61|29
        47|13
        75|47
        97|75
        47|61
        75|61
        47|29
        75|13
        53|13

        75,47,61,53,29
        97,61,53,29,13
        75,29,13
        75,97,47,61,53
        61,13,29
        97,13,75,29,47
`,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        47|53
        97|13
        97|61
        97|47
        75|29
        61|13
        75|53
        29|13
        97|29
        53|29
        61|53
        97|53
        61|29
        47|13
        75|47
        97|75
        47|61
        75|61
        47|29
        75|13
        53|13

        75,47,61,53,29
        97,61,53,29,13
        75,29,13
        75,97,47,61,53
        61,13,29
        97,13,75,29,47
`,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

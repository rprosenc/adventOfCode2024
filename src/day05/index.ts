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

const part1 = (rawInput: string) => {
  const input: Input = parseInput(rawInput);

  const workingUpdates = [];
  let middlePagesSum = 0;
  // console.log(input);
  for (let i = 0; i < input.updates.length; i++) {
    const update = input.updates[i];
    // console.log(input)
    let valid = true;
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
        // rule is broken
        valid = false;
        break;
      }
    }
    if (valid) {
      workingUpdates.push(update);
      middlePagesSum += update[Math.floor(update.length / 2)];
    }
  }
  return middlePagesSum;
};

const part2 = (rawInput: string) => {
  const input: Input = parseInput(rawInput);

  const workingUpdates = [];
  const brokenUpdates = [];
  const fixedUpdates = [];
  let middlePagesSum = 0;
  // console.log(input);
  for (let i = 0; i < input.updates.length; i++) {
    const update = input.updates[i];
    // console.log(input)
    let valid = true;
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
        // rule is broken
        valid = false;
        break;
      }
    }
    if (valid) {
      workingUpdates.push(update);
    } else {
      brokenUpdates.push(update);
    }
  }


  // fix broken updates
  for (let i = 0; i < brokenUpdates.length; i++) {
    const update = brokenUpdates[i];

    let repeat = 1;
    while(repeat) {
      repeat--;
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
          console.log(rule, update);
          [update[aIndex],update[bIndex]] = [update[bIndex], update[aIndex]];
          // if an error was found, make sure repeat check of that update
          repeat = 1;
        }
      }
    }
  middlePagesSum += update[Math.floor(update.length / 2)];
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

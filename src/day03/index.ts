import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const expression = new RegExp(/mul\(\d+,\d+\)/g);
  const instructions = rawInput.match(expression);
  const mul = new RegExp(/mul\((\d+),(\d+)\)/)
  return instructions?.reduce((prev,cur) => {
    const hits = mul.exec(cur);
    const [a,b] = [parseInt(hits![1]), parseInt(hits![2])]
    return prev + (a*b);
  },0)
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const expression = new RegExp(/(mul\(\d+,\d+\))|(don't\(\))|(do\(\))/g);
  const mul = new RegExp(/mul\((\d+),(\d+)\)/)
  const cmd_dont = "don't()";
  const cmd_do = 'do()';
  const instructions = rawInput.match(expression);
  let processing = true;
  return instructions?.reduce((prev,cmd) => {
    switch (cmd) {
      case cmd_do: processing = true; return prev;
      case cmd_dont: processing = false; return prev;
    }
    if (processing) {
      const hits = mul.exec(cmd);
      const [a,b] = [parseInt(hits![1]), parseInt(hits![2])]
      return prev + (a*b);
    }
    return prev;
  },0)

  return;
};

run({
  part1: {
    tests: [
      {
        input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

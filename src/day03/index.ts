import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
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
  const instructions = new RegExp(/(mul\(\d+,\d+\))|(don't\(\))|(do\(\))/g);
  const cmd_mul = new RegExp(/mul\((\d+),(\d+)\)/)
  const cmd_dont = "don't()";
  const cmd_do = 'do()';
  const program = rawInput.match(instructions);
  let processing = true;
  return program?.reduce((prev,cmd) => {
    switch (cmd) {
      case cmd_do: processing = true; return prev;
      case cmd_dont: processing = false; return prev;
    }
    if (processing) {
      const matches = cmd_mul.exec(cmd);
      const [a,b] = [parseInt(matches![1]), parseInt(matches![2])]
      return prev + (a*b);
    }
    return prev;
  },0)
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

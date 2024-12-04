import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(line=>line.split(''));


const xmas0 = (x:number, y:number, field:string[][]) => {
  if (y<3) return 0; // no space up
  return field[x][y] === 'X' && field[x][y-1] === 'M' && field[x][y-2] === 'A' && field[x][y-3] === 'S' && 1 || 0;
}
const xmas45 = (x:number, y:number, field:string[][]) => {
  if (x+3>=field.length) return 0; // no space right
  if (y<3) return 0; // no space up
  return field[x][y] === 'X' && field[x+1][y-1] === 'M' && field[x+2][y-2] === 'A' && field[x+3][y-3] === 'S' && 1 || 0;
}
const xmas90 = (x:number, y:number, field:string[][]) => {
  if (x+3>=field.length) return 0; // no space right
  return field[x][y] === 'X' && field[x+1][y] === 'M' && field[x+2][y] === 'A' && field[x+3][y] === 'S' && 1 || 0;
}
const xmas135 = (x:number, y:number, field:string[][]) => {
  if (x+3>=field.length) return 0; // no space right
  if (y+3>=field[x].length) return 0; // no space down
  return field[x][y] === 'X' && field[x+1][y+1] === 'M' && field[x+2][y+2] === 'A' && field[x+3][y+3] === 'S' && 1 || 0;
}
const xmas180 = (x:number, y:number, field:string[][]) => {
  if (y+3>=field[x].length) return 0; // no space down
  return field[x][y] === 'X' && field[x][y+1] === 'M' && field[x][y+2] === 'A' && field[x][y+3] === 'S' && 1 || 0;
}
const xmas225 = (x:number, y:number, field:string[][]) => {
  if (x<3) return 0; // no space left
  if (y+3>=field[x].length) return 0; // no space down
  return field[x][y] === 'X' && field[x-1][y+1] === 'M' && field[x-2][y+2] === 'A' && field[x-3][y+3] === 'S' && 1 || 0;
}
const xmas270 = (x:number, y:number, field:string[][]) => {
  if (x<3) return 0; // no space left
  return field[x][y] === 'X' && field[x-1][y] === 'M' && field[x-2][y] === 'A' && field[x-3][y] === 'S' && 1 || 0;
}
const xmas315 = (x:number, y:number, field:string[][]) => {
  if (x<3) return 0; // no space left
  if (y<3) return 0; // no space up
  return field[x][y] === 'X' && field[x-1][y-1] === 'M' && field[x-2][y-2] === 'A' && field[x-3][y-3] === 'S' && 1 || 0;
}

const xmas = (x:number, y:number, field:string[][]) => {
  return xmas0(x,y, field) + xmas45(x,y, field) +  xmas90(x,y, field) +  xmas135(x,y, field) +  xmas180(x,y, field) +  xmas225(x,y, field) +  xmas270(x,y, field) +  xmas315(x,y, field);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let words = 0;
    for (let x=0; x<input.length; x++) {
      for (let y=0; y<input[x].length; y++) {
        words += xmas(x,y,input);
    }
  }

  return words;
};


/**
 * 
 * PART II
 */

const mas = (x:number, y:number, field:string[][]) => {
  if (y<1) return 0; // no space up
  if (x+1>=field.length) return 0; // no space right
  if (y+1>=field[x].length) return 0; // no space down
  if (x<1) return 0; // no space left
  let matches = 0;
  const stencils = ['MMSS', 'SMSM' , 'SSMM', 'MSMS'];
  
  stencils.forEach(s=>{
    const chars= s.split('');
    matches += (
    field[x-1][y-1] === chars[0] && field[x+1][y-1] === chars[1]
               && field[x][y] === 'A' &&
    field[x-1][y+1] === chars[2] && field[x+1][y+1]  === chars[3]
    &&  1 || 0);
  })
  return matches;
}


const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let words = 0;
    for (let x=0; x<input.length; x++) {
      for (let y=0; y<input[x].length; y++) {
        words += mas(x,y,input);
    }
  }

  return words;
};

run({
  part1: {
    tests: [
      {
        input: `
        MMMSXXMASM
        MSAMXMSMSA
        AMXSXMAAMM
        MSAMASMSMX
        XMASAMXAMM
        XXAMMXXAMA
        SMSMSASXSS
        SAXAMASAAA
        MAMMMXMMMM
        MXMXAXMASX
        `,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        MMMSXXMASM
        MSAMXMSMSA
        AMXSXMAAMM
        MSAMASMSMX
        XMASAMXAMM
        XXAMMXXAMA
        SMSMSASXSS
        SAXAMASAAA
        MAMMMXMMMM
        MXMXAXMASX
        `,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

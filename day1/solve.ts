import { keys, sum, values } from "lodash";
import { solve } from "../runner/typescript";

const numbers = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function getValue(line: string): number {
  const digits = line.match(/\d/g);
  return Number(digits.at(0) + digits.at(-1));
}

function getValueWithWords(line: string): number {
  const regexString = `(${[...keys(numbers), ...values(numbers)].join("|")})`;
  const first = line.match(new RegExp(regexString))[1];
  const last = line.match(new RegExp(`.*${regexString}`))[1];
  return Number(`${numbers[first] ?? first}${numbers[last] ?? last}`);
}

solve({
  parser: (input) => input.split("\n"),
  part1: (lines) => sum(lines.map(getValue)),
  part2: (lines) => sum(lines.map(getValueWithWords)),

  test1Input: "1abc2\npqr3stu8vwx\na1b2c3d4e5f\ntreb7uchet",
  test1Output: 142,
  test2Input:
    "two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen",
  test2Output: 281,
});

/** Original bleary-eyed solution when I couldn't get the regex to work for part 2
    I can always count on recursion to save the day, especially early on 
    Update: turns out this only works as I was lucky with my input - new recursive solution works better
    */
// function part2_recursive(input: string[]): number {
//   function recursiveFind(s: string) {
//     if (!s) return [];

//     for (const [key, value] of Object.entries(numbers)) {
//       if (s.startsWith(key))
//         return [value, ...recursiveFind(s.replace(key, ""))];
//     }
//     return [...recursiveFind(s.slice(1))];
//   }

//   const getValue = (line: string): number => {
//     const digits = recursiveFind(line);
//     return Number(digits.at(0) + digits.at(-1));
//   };
//   return sum(input.map(getValue));
// }

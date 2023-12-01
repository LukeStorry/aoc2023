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
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
};

solve({
  parser: (input) => input.split("\n"),
  part1: (lines) =>
    lines
      .map((line) => {
        const digits = line.match(/\d/g);
        return Number(digits.at(0) + digits.at(-1));
      })
      .reduce((a, b) => a + b, 0),
  part2: (lines) =>
    lines
      .map((line) => {
        const regex = new RegExp(`${Object.keys(numbers).join("|")}`, "g");
        const digits = line.match(regex);
        return Number(numbers[digits.at(0)] + numbers[digits.at(-1)]);
      })
      .reduce((a, b) => a + b, 0),
  // part2: part2_recursive,

  test1Input: "1abc2\npqr3stu8vwx\na1b2c3d4e5f\ntreb7uchet",
  test1Output: 142,
  test2Input:
    "two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen",
  test2Output: 281,
});

/** Original bleary-eyed solution when I couldn't get the regex to work for part 2
    I can always count on recursion to save the day, especially early on */
function part2_recursive(input: string[]): number {
  function recursiveFind(s: string) {
    if (!s) return [];

    for (const [key, value] of Object.entries(numbers)) {
      if (s.startsWith(key))
        return [value, ...recursiveFind(s.replace(key, ""))];
    }
    return [...recursiveFind(s.slice(1))];
  }

  return input
    .map((line) => {
      const digits = recursiveFind(line);
      return Number(digits.at(0) + digits.at(-1));
    })
    .reduce((a, b) => a + b, 0);
}

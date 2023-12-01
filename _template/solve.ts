import { solve } from "../runner/typescript";

solve({
  parser: (input) => {
    return parseInt(input);
  },
  part1: (parsed) => {
    return parsed + 1;
  },
  part2: (parsed) => {
    return (parsed + 2).toString();
  },
  test1Input: "5",
  test1Output: 6,
  // test2Input: "test2",
  // test2Output: "test2",
});

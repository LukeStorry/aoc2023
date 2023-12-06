import { solve } from "../runner/typescript";
import { zip } from "lodash";

const getWins = ([totalTime, record]) =>
  [...Array(totalTime).keys()]
    .map((timeHolding) => (totalTime - timeHolding) * timeHolding)
    .filter((distance) => distance > record).length;

solve({
  parser: (input) => input.split("\n").map((l) => l.match(/\d+/g).map(Number)),

  part1: ([times, records]) =>
    zip(times, records)
      .map(getWins)
      .reduce((a, b) => a * b),

  part2: ([times, distances]) =>
    getWins([Number(times.join("")), Number(distances.join(""))]),

  part1Tests: [["Time:      7  15   30\n    Distance:  9  40  200", 288]],
  part2Tests: [["Time:      7  15   30\nDistance:  9  40  200", 71503]],
});

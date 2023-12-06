import { solve } from "../runner/typescript";
import { zip } from "lodash";

function parser(input: string) {
  return input
    .trim()
    .split("\n")
    .map((l) => l.match(/\d+/g).map(Number));
}

function getWins([time, distance]: [number, number]): number {
  const holds = [...Array(time).keys()];
  const distances = holds.map((hold) => (time - hold) * hold);
  const wins = distances.filter((d) => d > distance);
  return wins.length;
}

function part1([times, distances]: number[][]): number {
  return zip(times, distances)
    .map(getWins)
    .reduce((a, b) => a * b);
}

function part2([times, distances]: number[][]): number {
  const time = Number(times.join(""));
  const distance = Number(distances.join(""));
  return getWins([time, distance]);
}

solve({
  parser,
  part1,
  part2,
  part1Tests: [["Time:      7  15   30\n    Distance:  9  40  200\n    ", 288]],
  part2Tests: [["Time:      7  15   30\nDistance:  9  40  200", 71503]],
});

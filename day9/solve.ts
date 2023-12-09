import { solve } from "../runner/typescript";
import { sum, uniq } from "lodash";

function predict(history: number[]): number {
  if (uniq(history).length === 1) return history[0];
  const diffs = history.slice(0, -1).map((v, i) => history[i + 1] - v);
  return history.at(-1) + predict(diffs);
}
solve({
  parser: (input) => input.split("\n").map((l) => l.split(" ").map(Number)),
  part1: (report) => sum(report.map((r) => predict(r))),
  part2: (report) => sum(report.map((r) => predict(r.reverse()))),

  part1Tests: [["0 3 6 9 12 15\n1 3 6 10 15 21\n10 13 16 21 30 45", 114]],
  part2Tests: [["0 3 6 9 12 15\n1 3 6 10 15 21\n10 13 16 21 30 45", 2]],
});

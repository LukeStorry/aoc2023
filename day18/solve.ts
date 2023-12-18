import { solve } from "../runner/typescript";
import { max, sum, groupBy, range, mean, floor, meanBy, values } from "lodash";
import { printGrid } from "../utils";

type Dig = {
  direction: "R" | "L" | "U" | "D";
  length: number;
  colour: string;
};

function parser(input: string): Dig[] {
  return Array.from(input.matchAll(/([RLDU]) (\d+) \((#[0-9a-f]{6})\)/g)).map(
    ([_, d, l, c]) => ({ direction: d, length: Number(l), colour: c }) as Dig
  );
}

const deltas = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
};

function part1(digs: Dig[]): number {
  let latestDug: [number, number] = [0, 0];
  const digPath = digs.flatMap((dig) =>
    range(dig.length).map(() => {
      latestDug = [
        latestDug[0] + deltas[dig.direction][0],
        latestDug[1] + deltas[dig.direction][1],
      ] as const;
      return latestDug;
    })
  );

  // middle is a good guess to begin the flood fill
  const start = [
    floor(meanBy(digPath, ([x, _]) => x)),
    floor(meanBy(digPath, ([_, y]) => y)),
  ];
  let dug = new Set(digPath.map(([x, y]) => `${x},${y}`));
  const queue = [start];
  for (const [x, y] of queue) {
    const key = `${x},${y}`;
    if (dug.has(key)) continue;
    dug.add(key);
    queue.push(...values(deltas).map(([dx, dy]) => [x + dx, y + dy]));
  }

  return dug.size;
}

solve({
  parser,
  part1,
  // part2,
  // onlyTests: true,
  testInput:
    "R 6 (#70c710)\nD 5 (#0dc571)\nL 2 (#5713f0)\nD 2 (#d2c081)\nR 2 (#59c680)\nD 2 (#411b91)\nL 5 (#8ceee2)\nU 2 (#caa173)\nL 1 (#1b58a2)\nU 2 (#caa171)\nR 2 (#7807d2)\nU 3 (#a77fa3)\nL 2 (#015232)\nU 2 (#7a21e3)",
  part1Tests: [[, 62]],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});

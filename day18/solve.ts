import { solve } from "../runner/typescript";
import {
  max,
  sum,
  groupBy,
  range,
  mean,
  floor,
  meanBy,
  values,
  keys,
} from "lodash";
import { printGrid } from "../utils";

type Point = [number, number];
type Dig = {
  direction: keyof typeof deltas;
  length: number;
};

const deltas = {
  R: [1, 0],
  D: [0, -1],
  L: [-1, 0],
  U: [0, 1],
} as const;

function findPath(digs: Dig[]): Point[] {
  let latestDug: [number, number] = [0, 0];
  return digs.flatMap((dig) =>
    range(dig.length).map(() => {
      latestDug = [
        latestDug[0] + deltas[dig.direction][0],
        latestDug[1] + deltas[dig.direction][1],
      ] as const;
      return latestDug;
    })
  );
}

function findAreaWithinPath(path: Point[]): number {
  // Flood fill beginning in the middle
  const start = [
    floor(meanBy(path, ([x, _]) => x)),
    floor(meanBy(path, ([_, y]) => y)),
  ];
  let dug = new Set(path.map(([x, y]) => `${x},${y}`));
  const queue = [start];
  for (const [x, y] of queue) {
    const key = `${x},${y}`;
    if (dug.has(key)) continue;
    dug.add(key);
    queue.push(
      ...values(deltas)
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(([x, y]) => !dug.has(`${x},${y}`))
    );
  }

  return dug.size;
}

function part1(input: string): number {
  const digs = Array.from(
    input.matchAll(/([RLDU]) (\d+) \((#[0-9a-f]{6})\)/g)
  ).map(([_, d, l]) => ({ direction: d, length: Number(l) }) as Dig);
  const digPath = findPath(digs);
  return findAreaWithinPath(digPath);
}

function part2(input: string): number {
  const digs: Dig[] = Array.from(input.matchAll(/ \(#([0-9a-f]{6})\)/g)).map(
    ([_, hex]) => ({
      length: parseInt(hex.slice(0, 5), 16),
      direction: keys(deltas)[Number(hex[5])] as keyof typeof deltas,
    })
  );
  const digPath = findPath(digs);
  console.log(digPath.length);
  return findAreaWithinPath(digPath);
}

solve({
  part1,
  part2,
  testInput:
    "R 6 (#70c710)\nD 5 (#0dc571)\nL 2 (#5713f0)\nD 2 (#d2c081)\nR 2 (#59c680)\nD 2 (#411b91)\nL 5 (#8ceee2)\nU 2 (#caa173)\nL 1 (#1b58a2)\nU 2 (#caa171)\nR 2 (#7807d2)\nU 3 (#a77fa3)\nL 2 (#015232)\nU 2 (#7a21e3)",
  part1Tests: [
    // [, 62]
  ],
  part2Tests: [[, 952408144115]],
});

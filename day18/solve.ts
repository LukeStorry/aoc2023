import { solve } from "../runner/typescript";
import { range, sum } from "lodash";

type Dig = { direction: string; length: number };
const deltaX = { R: 1, D: 0, L: -1, U: 0 } as const;
const deltaY = { R: 0, D: -1, L: 0, U: 1 } as const;

function howMuchLava(digs: Dig[]): number {
  const vertices = [{ x: 0, y: 0 }];
  digs.forEach(({ direction, length }) =>
    vertices.push({
      x: vertices.at(-1).x + deltaX[direction] * length,
      y: vertices.at(-1).y + deltaY[direction] * length,
    })
  );

  const shoelaces = range(vertices.length - 1)
    .map((i) => [vertices[i], vertices[i + 1]])
    .map(([a, b]) => b.x * a.y - a.x * b.y);
  const area = sum(shoelaces) / 2;
  const perimeter = sum(digs.map((d) => d.length / 2));

  return area + perimeter + 1;
}

function part1(input: string): number {
  const digs = Array.from(
    input.matchAll(/(?<direction>[RLDU]) (?<length>\d+)/g)
  ).map(({ groups }) => groups as unknown as Dig);
  return howMuchLava(digs);
}

function part2(input: string): number {
  const digs = Array.from(input.matchAll(/#([0-9a-f]{5})([0-4])/g)).map(
    ([_, lenHash, dirIndex]) => ({
      length: parseInt(lenHash, 16),
      direction: "RDLU"[parseInt(dirIndex)],
    })
  );
  return howMuchLava(digs);
}

solve({
  part1,
  part2,
  testInput:
    "R 6 (#70c710)\nD 5 (#0dc571)\nL 2 (#5713f0)\nD 2 (#d2c081)\nR 2 (#59c680)\nD 2 (#411b91)\nL 5 (#8ceee2)\nU 2 (#caa173)\nL 1 (#1b58a2)\nU 2 (#caa171)\nR 2 (#7807d2)\nU 3 (#a77fa3)\nL 2 (#015232)\nU 2 (#7a21e3)",
  part1Tests: [[, 62]],
  part2Tests: [[, 952408144115]],
});

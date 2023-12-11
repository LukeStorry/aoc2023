import { solve } from "../runner/typescript";
import { sum, range } from "lodash";

type Star = readonly [number, number];

function parser(input: string): Star[] {
  return input
    .split("\n")
    .flatMap((line, y) =>
      line.split("").map((char, x) => (char == "#" ? ([x, y] as const) : null))
    )
    .filter(Boolean);
}

function findDistance(stars: Star[], expansion: number) {
  const pairs = stars.flatMap((a, i) => stars.slice(i + 1).map((b) => [a, b]));

  const distances = pairs.map(([[ax, ay], [bx, by]]) => {
    const [minY, maxY] = [Math.min(ay, by), Math.max(ay, by)];
    const [minX, maxX] = [Math.min(ax, bx), Math.max(ax, bx)];
    const starlessRowsBetween = range(minY, maxY).filter(
      (y) => !stars.some((s) => s[1] == y)
    );
    const starlessColsBetween = range(minX, maxX).filter(
      (x) => !stars.some((s) => s[0] == x)
    );
    return (
      Math.abs(by - ay) +
      Math.abs(bx - ax) +
      starlessRowsBetween.length * (expansion - 1) +
      starlessColsBetween.length * (expansion - 1)
    );
  });

  return sum(distances);
}

function part1(stars: Star[]) {
  return findDistance(stars, 2);
}

function part2(stars: Star[], isTest: boolean): number {
  return findDistance(stars, isTest ? 100 : 1000000);
}

const testInput =
  "...#......\n.......#..\n#.........\n..........\n......#...\n.#........\n.........#\n..........\n.......#..\n#...#.....";

solve({
  parser,
  part1,
  part2,
  part1Tests: [[testInput, 374]],
  part2Tests: [[testInput, 8410]],
});

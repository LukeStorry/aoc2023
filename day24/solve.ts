import { solve } from "../runner/typescript";
import { fromPairs, zip } from "lodash";

const hailstoneKeys = ["x", "y", "z", "dx", "dy", "dz"] as const;
type HailStone = { [key in (typeof hailstoneKeys)[number]]: number };

function parser(input: string): HailStone[] {
  return input.split("\n").map((line) => {
    const values = line.split(/,|@/).map(Number);
    return fromPairs(zip(hailstoneKeys, values)) as HailStone;
  });
}

function intersect(
  stoneA: HailStone,
  stoneB: HailStone,
  [min, max]: [number, number]
): boolean {
  const slopeA = stoneA.dy / stoneA.dx;
  const interceptA = stoneA.y - slopeA * stoneA.x;
  const slopeB = stoneB.dy / stoneB.dx;
  const interceptB = stoneB.y - slopeB * stoneB.x;

  const x = (interceptB - interceptA) / (slopeA - slopeB);
  const y = x * slopeA + interceptA;

  const isInFutureA = x > stoneA.x == stoneA.dx > 0;
  const isInFutureB = x > stoneB.x == stoneB.dx > 0;
  const isInsideZone = x >= min && x <= max && y >= min && y <= max;

  return isInFutureA && isInFutureB && isInsideZone;
}

function part1(stones: HailStone[], isTest): number {
  const testArea: [number, number] = isTest
    ? [7, 27]
    : [200000000000000, 400000000000000];

  let intersections = 0;
  stones.forEach((stoneA, a) => {
    stones.slice(a + 1).forEach((stoneB, b) => {
      if (intersect(stoneA, stoneB, testArea)) intersections += 1;
    });
  });

  return intersections;
}

solve({
  parser: parser,
  part1,
  // onlyTests: true,
  // part2,
  testInput:
    "19, 13, 30 @ -2,  1, -2\n18, 19, 22 @ -1, -1, -2\n20, 25, 34 @ -2, -2, -4\n12, 31, 28 @ -1, -2, -1\n20, 19, 15 @  1, -5, -3",
  part1Tests: [[, 2]],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});

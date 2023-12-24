import { solve } from "../runner/typescript";
import { fromPairs, sum, zip } from "lodash";
import { Context } from "z3-solver";

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

function part1(stones: HailStone[], isTest) {
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

async function part2(stones: HailStone[]) {
  const { init } = require('z3-solver');
  const { Context } = await init();
  const { Solver, Real } = new Context('main') as Context;

  const solver = new Solver();

  const position = Real.vector("position", 3);
  const [dx, dy, dz] = Real.vector("velocity", 3);
  const [x, y, z] = position;


  stones.forEach((stone, index) => {
    const time = Real.const(`time_${index}`);
    solver.add(time.gt(0));
    solver.add(x.add(time.mul(dx)).eq(time.mul(stone.dx).add(stone.x)));
    solver.add(y.add(time.mul(dy)).eq(time.mul(stone.dy).add(stone.y)));
    solver.add(z.add(time.mul(dz)).eq(time.mul(stone.dz).add(stone.z)));
  });

  await solver.check();
  const positions = position.map(d =>
    Number(solver.model().get(d))
  );
  return sum(positions);
}

solve({
  parser,
  part1,
  part2,
  testInput:
    "19, 13, 30 @ -2,  1, -2\n18, 19, 22 @ -1, -1, -2\n20, 25, 34 @ -2, -2, -4\n12, 31, 28 @ -1, -2, -1\n20, 19, 15 @  1, -5, -3",
  part1Tests: [[, 2]],
  part2Tests: [[, 47]],
});

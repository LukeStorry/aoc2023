import { solve } from "../runner/typescript";
import {
  max,
  sum,
  groupBy,
  range,
  orderBy,
  minBy,
  isEqual,
  intersectionWith,
  min,
  sumBy,
  difference,
} from "lodash";

type Point = [number, number, number];
type Brick = Point[];
function parser(input: string): Brick[] {
  const brickEnds = input
    .split("\n")
    .map((row) => row.match(/(\d+)/g).map(Number));
  return brickEnds.map(([x1, y1, z1, x2, y2, z2]) => {
    // also include all coordinates between the two points
    //A line like 2,2,2~2,2,2 means that both ends of the brick are at the same coordinate - in other words, that the brick is a single cube.

    // Lines like 0,0,10~1,0,10 or 0,0,10~0,1,10 both represent bricks that are two cubes in volume, both oriented horizontally.
    // The first brick extends in the x direction, while the second brick extends in the y direction.

    // A line like 0,0,1~0,0,10 represents a ten-cube brick which is oriented vertically.
    // One end of the brick is the cube located at 0, 0, 1, while the other end of the brick is located directly above it at 0, 0, 10.

    const xRange = range(Math.min(x1, x2), Math.max(x1, x2) + 1);
    const yRange = range(Math.min(y1, y2), Math.max(y1, y2) + 1);
    const zRange = range(Math.min(z1, z2), Math.max(z1, z2) + 1);

    const points = xRange.flatMap((x) =>
      yRange.flatMap((y) => zRange.map((z) => [x, y, z] satisfies Point))
    );
    return points;
  });
}

function fallToFloor(bricks: Brick[], earlyReturn?: boolean): Brick[] {
  const sortedBricks = orderBy(
    bricks,
    // [(brick) => minBy(brick, ([x, y, z]) => z)],
    [(brick) => min(brick.map(([x, y, z]) => z))]
    // ["desc"]
  );
  const finalBricks: Brick[] = [];
  const allBrickPositions = new Set(
    bricks.flatMap((b) => b.map(([x, y, z]) => `${x},${y},${z}`))
  );

  for (let brick of sortedBricks) {
    const originalPositions = new Set(
      brick.map(([x, y, z]) => `${x},${y},${z}`)
    );
    originalPositions.forEach((pos) => allBrickPositions.delete(pos));
    while (min(brick.map(([_, __, z]) => z)) > 1) {
      const oneStepLower: Brick = brick.map(([x, y, z]) => [x, y, z - 1]);
      const collision = oneStepLower.some(([x, y, z]) =>
        allBrickPositions.has(`${x},${y},${z}`)
      );
      if (collision) break;
      if (earlyReturn) return [];

      brick = oneStepLower;
    }
    brick.forEach(([x, y, z]) => allBrickPositions.add(`${x},${y},${z}`));
    finalBricks.push(brick);
  }

  return finalBricks;
}

function part1(bricks: Brick[]): number {
  console.log(bricks);
  const settled = fallToFloor(fallToFloor(fallToFloor(bricks)));

  let canRemove = 0;

  for (let i = 0; i < settled.length; i++) {
    if (i % 10 === 0) console.log(`${i}/${settled.length}`);
    const remainingBricks = [...settled.slice(0, i), ...settled.slice(i + 1)];
    const afterFall = fallToFloor(remainingBricks, true);

    // const hash = (bricks: Brick[]) =>
    //   // bricks.map((b) => b.map(([x, y, z]) => `${x},${y},${z}`)).join("|");
    //   sumBy(bricks, (b) => sumBy(b, (c) => sum(c)));

    // const aft = hash(afterFall);
    // const fore = hash(remainingBricks);

    if (afterFall.length > 1) {
      // if (aft == fore) {
      canRemove++;
    }
  }

  return canRemove;
}

function part2(bricks: Brick[]): number {
  // console.log(bricks);
  const settled = fallToFloor(fallToFloor(fallToFloor(bricks)));

  let fallen = 0;

  for (let i = 0; i < settled.length; i++) {
    if (i % 10 === 0) console.log(`${i}/${settled.length}`);
    const remainingBricks = [...settled.slice(0, i), ...settled.slice(i + 1)];
    const afterFall = fallToFloor(
      fallToFloor(
        fallToFloor(
          fallToFloor(
            fallToFloor(
              fallToFloor(
                fallToFloor(
                  fallToFloor(
                    fallToFloor(
                      fallToFloor(
                        fallToFloor(
                          fallToFloor(fallToFloor(fallToFloor(remainingBricks)))
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    );

    const hash = (bricks: Brick[]) =>
      bricks.map((b) => b.map(([x, y, z]) => `${x},${y},${z}`).join("|"));
    // sumBy(bricks, (b) => sumBy(b, (c) => sum(c)));

    const aft = hash(afterFall);
    const fore = hash(remainingBricks);
    const dd = difference(aft, fore);
    const diff = dd.length;

    fallen += diff;
  }

  return fallen;
}

solve({
  parser: parser,
  part1: part1,
  part2: part2,

  part1Tests: [
    [
      "1,0,1~1,2,1\n0,0,2~2,0,2\n0,2,3~2,2,3\n0,0,4~0,2,4\n2,0,5~2,2,5\n0,1,6~2,1,6\n1,1,8~1,1,9",
      5,
    ],
  ],
  part2Tests: [
    [
      "1,0,1~1,2,1\n0,0,2~2,0,2\n0,2,3~2,2,3\n0,0,4~0,2,4\n2,0,5~2,2,5\n0,1,6~2,1,6\n1,1,8~1,1,9",
      7,
    ],
  ],
});

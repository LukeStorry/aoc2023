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

function fallToFloor(bricks: Brick[]): Brick[] {
  // Because the snapshot was taken while the bricks were still falling, some bricks will still be in the air; you'll need to start by figuring out where they will end up. Bricks are magically stabilized, so they never rotate, even in weird situations like where a long horizontal brick is only supported on one end. Two bricks cannot occupy the same position, so a falling brick will come to rest upon the first other brick it encounters.

  //We want to return the list of bricks where all the bricks have fallen
  const sortedBricks = orderBy(
    bricks,
    [(brick) => minBy(brick, ([x, y, z]) => z)],
    ["desc"]
  );
  const finalBricks: Brick[] = [];

  sortedBricks.forEach((brick) => {
    let lowestZ = minBy(brick, ([x, y, z]) => z)[2];
    while (lowestZ > 0) {
      const oneStepLower: Brick = brick.map(([x, y, z]) => [x, y, z - 1]);
      if (
        finalBricks.some(
          (otherBrick) =>
            intersectionWith(oneStepLower, otherBrick, isEqual).length > 0
        )
      ) {
        break;
      }
      brick = oneStepLower;
      lowestZ--;
    }
    finalBricks.push(brick);
  });

  return finalBricks;
}

function part1(bricks: Brick[]): number {
  console.log(bricks);
  const settled = fallToFloor(bricks);

  let canRemove = 0;

  for (let i = 0; i < settled.length; i++) {
    console.log(i);
    const remainingBricks = [...settled.slice(0, i), ...settled.slice(i + 1)];
    const afterFall = fallToFloor(remainingBricks);

    if (isEqual(afterFall, remainingBricks)) {
      canRemove++;
    }
  }

  return canRemove;
}

// function part2(values: any[]): any[] {
//   function func2(a) {
//     return a;
//   }

//   const out1 = func2(values[0]);

//   console.log(out1);

//   return values.map(func2);
// }

solve({
  parser: parser,
  part1: part1,
  // part2: part2,

  part1Tests: [
    [
      "1,0,1~1,2,1\n0,0,2~2,0,2\n0,2,3~2,2,3\n0,0,4~0,2,4\n2,0,5~2,2,5\n0,1,6~2,1,6\n1,1,8~1,1,9",
      5,
    ],
    // ["a", 0],
  ],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});

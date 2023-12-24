import { solve } from "../runner/typescript";
import { max, sum, groupBy } from "lodash";

type HailStone = [
  px: number,
  py: number,
  pz: number,
  vx: number,
  vy: number,
  vz: number,
];
type Point = [x: number, y: number];

function parser(input: string): HailStone[] {
  return input
    .split("\n")
    .map((line) => line.split(/,|@/).map(Number) as HailStone);
}

type LineSegment = readonly [start: Point, end: Point];

function getLineSegmentInside2DZone(
  stone: HailStone,
  [min, max]: [number, number]
): LineSegment {
  const [px, py, _, vx, vy, __] = stone;
  const m = vy / vx;
  const b = py - m * px;

  const intersections: Point[] = [
    [px, py], // current position
    [min, m * min + b], // left boundary
    [max, m * max + b], // right boundary
    [(min - b) / m, min], // bottom boundary
    [(max - b) / m, max], // top boundary
  ];

  const validIntersections = intersections.filter(
    ([x, y]) =>
      x >= min &&
      x <= max &&
      y >= min &&
      y <= max && // inside the zone
      ((vx > 0 && x >= px) || (vx < 0 && x <= px)) && // in the future x direction
      ((vy > 0 && y >= py) || (vy < 0 && y <= py)) // in the future y direction
  );

  // validIntersections.sort((a, b) => (a.x - px) * vx + (a.y - py) * vy);

  const start: Point = validIntersections[0];
  const end: Point = validIntersections.at(-1);

  return [start, end] as LineSegment;
}

function intersect(
  [[aStartX, aStartY], [aEndX, aEndY]]: LineSegment,
  [[bStartX, bStartY], [bEndX, bEndY]]: LineSegment
): boolean {
  const det =
    (aEndX - aStartX) * (bEndY - bStartY) -
    (bEndX - bStartX) * (aEndY - aStartY);
  if (det === 0) return false;
  const lambda =
    ((bEndY - bStartY) * (bEndX - aStartX) +
      (bStartX - bEndX) * (bEndY - aStartY)) /
    det;

  const gamma =
    ((aStartY - aEndY) * (bEndX - aStartX) +
      (aEndX - aStartX) * (bEndY - aStartY)) /
    det;

  return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
}

function part1(stones: HailStone[], isTest): number {
  const testArea: [number, number] = isTest
    ? [7, 27]
    : [200000000000000, 400000000000000];

  const lineSegments = stones.map((stone) =>
    getLineSegmentInside2DZone(stone, testArea)
  );
  let intersections = 0;
  stones.forEach((stoneA, a) => {
    const segmentA = lineSegments[a];
    // const segmentA = getLineSegmentInside2DZone(stoneA, testArea);
    stones.slice(a + 1).forEach((stoneB, b) => {
      const segmentB = lineSegments[a + b];
      // const segmentB = getLineSegmentInside2DZone(stoneB, testArea);
      if (!segmentA[0] || !segmentB[0]) return;
      const doesIntersect = intersect(segmentA, segmentB);
      if (doesIntersect) intersections += 1;
      // console.log({
      //   stoneA,
      //   stoneB,
      //   segmentA,
      //   segmentB,
      //   doesIntersect,
      // });
    });
  });

  return intersections;
}

solve({
  parser: parser,
  part1,
  // onlyTests: true,
  // part2: part2,
  testInput:
    "19, 13, 30 @ -2,  1, -2\n18, 19, 22 @ -1, -1, -2\n20, 25, 34 @ -2, -2, -4\n12, 31, 28 @ -1, -2, -1\n20, 19, 15 @  1, -5, -3",
  part1Tests: [
    [, 2],
    // ["a", 0],
  ],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});

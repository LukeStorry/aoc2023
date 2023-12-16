import { solve } from "../runner/typescript";
import { max, range, uniq } from "lodash";

type Grid = string[][];
type Vector = readonly [number, number, number, number];

function getNext([x, y, dx, dy]: Vector, grid: Grid): Vector[] {
  const cell = grid[y]?.[x];
  const next: Vector[] = [];
  if (cell === "\\" && dx) next.push([x, y + dx, 0, dx]);
  if (cell === "\\" && dy) next.push([x + dy, y, dy, 0]);
  if (cell === "/" && dx) next.push([x, y - dx, 0, -dx]);
  if (cell === "/" && dy) next.push([x - dy, y, -dy, 0]);
  if (cell === "|" && dx) {
    next.push([x, y - 1, 0, -1]);
    next.push([x, y + 1, 0, 1]);
  }
  if (cell === "-" && dy) {
    next.push([x - 1, y, -1, 0]);
    next.push([x + 1, y, 1, 0]);
  }
  if (!next.length) next.push([x + dx, y + dy, dx, dy]);

  return next.filter(([x, y]) => !!grid[y]?.[x]);
}

function beamFollower(grid: Grid, start: Vector): number {
  let queue = [start];
  let visited = new Set<string>();
  while (queue.length) {
    const vector = queue.pop();
    const hash = JSON.stringify(vector);
    if (visited.has(hash)) continue;
    visited.add(hash);
    queue.push(...getNext(vector, grid));
  }

  const coordinates = Array.from(visited)
    .map((v) => JSON.parse(v))
    .map(([x, y]) => `${x},${y}`);
  return uniq(coordinates).length;
}

function part1(grid: Grid): number {
  return beamFollower(grid, [0, 0, 1, 0]);
}

function part2(grid: Grid): number {
  const [height, width] = [grid.length, grid[0].length];
  const entrypoints: Vector[] = [
    ...range(width).map((x) => [x, 0, 0, 1] as const),
    ...range(width).map((x) => [x, height - 1, 0, -1] as const),
    ...range(height).map((y) => [0, y, 1, 0] as const),
    ...range(height).map((y) => [width - 1, y, -1, 0] as const),
  ];
  return max(entrypoints.map((s) => beamFollower(grid, s)));
}

solve({
  parser: (input) => input.split("\n").map((line) => line.split("")) as Grid,
  part1,
  testInput: `.|...\\....\n|.-.\\.....\n.....|-...\n........|.\n..........\n.........\\\n..../.\\\\..\n.-.-/..|..\n.|....-|.\\\n..//.|....`,
  part2,
  part1Tests: [[, 46]],
  part2Tests: [[, 51]],
});

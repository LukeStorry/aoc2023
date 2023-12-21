import { floor } from "lodash";
import { solve } from "../runner/typescript";
import { printGrid } from "../utils";

type Grid = string[][];
type Point = [number, number] | number[];

function getNext([x, y]: Point, grid: Grid): Point[] {
  const [width, height] = [grid[0].length, grid.length];
  const wrap = (a, b) => ((a % b) + b) % b;
  return [
    [x, y - 1],
    [x, y + 1],
    [x + 1, y],
    [x - 1, y],
  ].filter(([x, y]) => {
    const cell = grid[wrap(y, height)][wrap(x, width)];
    return ".S".includes(cell);
  });
}
function walkGarden(grid: Grid, maxSteps: number): number {
  const starts = grid
    .flatMap((row, y) => row.map((cell, x) => (cell === "S" ? [x, y] : null)))
    .filter(Boolean);
  const start = starts[floor(starts.length / 2)];

  let queue: [Point, number][] = [[start, 0]];
  let visited = new Set<string>();
  let finalSpots = new Set<string>();
  while (queue.length) {
    if (visited.size > 20000) {
      printGrid(grid, [...visited].map((v) => v.split(",").map(Number)) as any);
      return 0;
    }
    const [current, steps] = queue.shift();
    const visitedHash = `${current},${steps}`;
    if (visited.has(visitedHash)) continue;
    visited.add(visitedHash);
    if (steps === maxSteps) {
      finalSpots.add(`${current}`);
      continue;
    }
    const next = getNext(current, grid);

    queue.push(...next.map((v) => [v, steps + 1] as any));
  }

  return finalSpots.size;
}
function part1(grid: Grid, isTest: boolean): number {
  const steps = isTest ? 6 : 64;

  return walkGarden(grid, steps);
}

function part2(grid: Grid, isTest: boolean): number {
  const steps = isTest ? 100 : 26501365;

  const multiplier = isTest ? 15 : 3;
  const bigGrid = Array(multiplier)
    .fill(grid)
    .flat()
    .map((row) => Array(multiplier).fill(row).flat());

  const newLocal = walkGarden(bigGrid, steps);

  throw new Error("Not finished");
  return newLocal;
}

solve({
  parser: (input) => input.split("\n").map((line) => line.split("")) as Grid,
  // part1,
  testInput:
    "...........\n.....###.#.\n.###.##..#.\n..#.#...#..\n....#.#....\n.##..S####.\n.##..#...#.\n.......##..\n.##.#.####.\n.##..##.##.\n...........",
  part2,
  // onlyTests: true,
  // part1Tests: [[, 16]],
  // part2Tests: [[, 6536]],
});

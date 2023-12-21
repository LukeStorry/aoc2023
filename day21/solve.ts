import { solve } from "../runner/typescript";
import { printGrid } from "../utils";

type Grid = string[][];
type Point = [number, number] | number[];

function getNext([x, y]: Point, grid: Grid): Point[] {
  return [
    [x, y - 1],
    [x, y + 1],
    [x + 1, y],
    [x - 1, y],
  ].filter(([x, y]) => ".S".includes(grid[y]?.[x]));
}
function walkGarden(grid: Grid, start: Point, maxSteps: number): number {
  let queue: [Point, number][] = [[start, 0]];
  let visited = new Set<string>();
  let finalSpots = new Set<string>();
  while (queue.length) {
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
  const start = grid
    .flatMap((row, y) => row.map((cell, x) => (cell === "S" ? [x, y] : null)))
    .find(Boolean);

  return walkGarden(grid, start, steps);
}

solve({
  parser: (input) => input.split("\n").map((line) => line.split("")) as Grid,
  part1,
  testInput: `.|...\\....\n|.-.\\.....\n.....|-...\n........|.\n..........\n.........\\\n..../.\\\\..\n.-.-/..|..\n.|....-|.\\\n..//.|....`,
  // part2,
  part1Tests: [
    [
      "...........\n.....###.#.\n.###.##..#.\n..#.#...#..\n....#.#....\n.##..S####.\n.##..#...#.\n.......##..\n.##.#.####.\n.##..##.##.\n...........",
      16,
    ],
    // ["a", 0],
  ],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});

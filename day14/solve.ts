import { solve } from "../runner/typescript";
import { max, sum, groupBy, fromPairs } from "lodash";

// type Point = readonly [number, number];
// type RockMap = { [key: Point]: "O" | "#" };
type Grid = string[][];
function parser(input: string): Grid {
  // const grid = input.split("\n").flatMap((row, y) =>
  //   row
  //     .split("")
  //     .map((cell, x) => [[x, y], cell])
  //     .filter(([_, cell]) => cell !== ".")
  // );
  // const map: RockMap = fromPairs(grid);
  // return map;

  const grid = input.split("\n").map((row) => row.split(""));
  return grid;
}

function part1(grid: Grid): number {
  function rollNorth(x: number, y: number) {
    while (grid[y - 1]?.[x] == ".") {
      grid[y][x] = ".";
      grid[y - 1][x] = "O";
      y--;
    }
  }
  const rollable = getRollable(grid);
  // console.log(rollable);
  rollable.forEach(([x, y, cell]) => rollNorth(x, y));
  const load = sum(getRollable(grid).map(([x, y, cell]) => grid.length - y));

  return load;
}

function getRollable(grid: Grid) {
  return grid
    .flatMap((row, y) =>
      row.map((cell, x) => (cell == "O" ? ([x, y, cell] as const) : null))
    )
    .filter(Boolean);
}

function part2(grid: Grid): number {
  function rollNorth(x: number, y: number) {
    while (grid[y - 1]?.[x] == ".") {
      grid[y][x] = ".";
      grid[y - 1][x] = "O";
      y--;
    }
  }
  function rollEast(x: number, y: number) {
    while (grid[y]?.[x + 1] == ".") {
      grid[y][x] = ".";
      grid[y][x + 1] = "O";
      x++;
    }
  }
  function rollWest(x: number, y: number) {
    while (grid[y]?.[x - 1] == ".") {
      grid[y][x] = ".";
      grid[y][x - 1] = "O";
      x--;
    }
  }
  function rollSouth(x: number, y: number) {
    while (grid[y + 1]?.[x] == ".") {
      grid[y][x] = ".";
      grid[y + 1][x] = "O";
      y++;
    }
  }

  const rollable = getRollable(grid);
  for (let cycle = 0; cycle < 1000000000; cycle++) {
    getRollable(grid).forEach(([x, y, cell]) => rollNorth(x, y));
    getRollable(grid).forEach(([x, y, cell]) => rollNorth(x, y));
    getRollable(grid).forEach(([x, y, cell]) => rollWest(x, y));
    getRollable(grid).forEach(([x, y, cell]) => rollWest(x, y));
    getRollable(grid).forEach(([x, y, cell]) => rollWest(x, y));
    getRollable(grid).forEach(([x, y, cell]) => rollSouth(x, y));
    getRollable(grid).forEach(([x, y, cell]) => rollSouth(x, y));
    getRollable(grid).forEach(([x, y, cell]) => rollSouth(x, y));
    getRollable(grid).forEach(([x, y, cell]) => rollEast(x, y));
    getRollable(grid).forEach(([x, y, cell]) => rollEast(x, y));
    getRollable(grid).forEach(([x, y, cell]) => rollEast(x, y));
    if (cycle % 10000 == 0)
      console.log(
        sum(getRollable(grid).map(([x, y, cell]) => grid.length - y))
      );
  }
  rollable.forEach(([x, y, cell]) => rollNorth(x, y));
  const load = sum(getRollable(grid).map(([x, y, cell]) => grid.length - y));

  return load;
}

solve({
  parser,
  // part1,
  part2,

  part1Tests: [
    [
      "O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....",
      136,
    ],
  ],
  part2Tests: [
    // [
    //   "O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....",
    //   64,
    // ],
  ],
});

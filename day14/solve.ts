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
  console.log(rollable);
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

function part2(values: any[]): any[] {
  function func2(a) {
    return a;
  }

  const out1 = func2(values[0]);

  console.log(out1);

  return values.map(func2);
}

solve({
  parser,
  part1,
  // part2: part2,

  part1Tests: [
    [
      "O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....",
      136,
    ],
  ],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});

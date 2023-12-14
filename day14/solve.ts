import { solve } from "../runner/typescript";
import { sum, zip } from "lodash";

type Grid = ("O" | "#" | ".")[][];

function getCircles(grid: Grid) {
  return grid.flatMap((row, y) =>
    row
      .map((cell, x) => (cell == "O" ? ([x, y] as const) : null))
      .filter(Boolean)
  );
}

function roll(grid: Grid) {
  getCircles(grid).forEach(([x, y]) => {
    grid[y][x] = ".";
    while (grid[y - 1]?.[x] == ".") {
      y--;
    }
    grid[y][x] = "O";
  });
}

function score(grid: Grid) {
  return sum(getCircles(grid).map(([_, y]) => grid.length - y));
}

function part1(grid: Grid) {
  roll(grid);
  return score(grid);
}

function part2(grid: Grid) {
  let previous: { [key: string]: { score: number; spin: number } } = {};
  let spin = 0;
  while (spin < 1000000000) {
    spin++;
    ["n", "w", "s", "e"].forEach(() => {
      roll(grid);
      // Just rotate the grid as four rotation functions got messy
      grid = zip(...grid.reverse());
    });

    let hash = JSON.stringify(grid);
    const alreadySeen = previous[hash];
    if (alreadySeen) {
      const cycleLength = spin - alreadySeen.spin;
      const remainingSpins = 1000000000 - spin;
      const cyclesToSkip = Math.floor(remainingSpins / cycleLength);
      spin += cyclesToSkip * cycleLength;
    }

    previous[hash] = { spin, score: score(grid) };
  }

  return score(grid);
}

solve({
  parser: (input) => input.split("\n").map((row) => row.split("")) as Grid,
  part1,
  part2,
  testInput:
    "O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....",
  part1Tests: [[, 136]],
  part2Tests: [[, 64]],
});

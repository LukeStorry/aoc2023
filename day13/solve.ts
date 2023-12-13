import { solve } from "../runner/typescript";
import { cloneDeep, reverse, sum } from "lodash";

type Grid = string[][];
function parser(input: string): Grid[] {
  return input.split("\n\n").map((g) => g.split("\n").map((l) => l.split("")));
}

function getMirror(
  grid: Grid,
  direction: "vertical" | "horizontal",
  ignore?: number
): number {
  if (direction === "horizontal") {
    grid = grid[0].map((_, i) => grid.map((line) => line[i]));
  }
  const possiblePerLine = grid.map((line) =>
    line
      .map((_, i) => {
        const left = line.slice(i - Math.min(i, line.length - i), i).join("");
        const right = reverse(line.slice(i, i * 2)).join("");
        return left === right ? i : null;
      })
      .filter(Boolean)
  );

  return possiblePerLine[0].find((m) =>
    possiblePerLine.every((set) => set.includes(m) && m !== ignore)
  );
}

function summarise(grid: Grid, ignore?: number) {
  return (
    getMirror(grid, "vertical", ignore) ??
    getMirror(grid, "horizontal", ignore / 100) * 100
  );
}

function fixSmudgeAndSummarise(grid: Grid): number {
  const originalSummary = summarise(grid);

  return grid
    .flatMap((line, y) =>
      line.map((_, x) => {
        const newGrid = cloneDeep(grid);
        newGrid[y][x] = grid[y][x] === "#" ? "." : "#";
        return newGrid;
      })
    )
    .map((possible) => summarise(possible, originalSummary))
    .find(Boolean);
}

function part1(grids: Grid[]): number {
  return sum(grids.map(summarise));
}

function part2(grids: Grid[]): number {
  return sum(grids.map(fixSmudgeAndSummarise));
}

const testInput =
  "#.##..##.\n..#.##.#.\n##......#\n##......#\n..#.##.#.\n..##..##.\n#.#.##.#.\n\n#...##..#\n#....#..#\n..##..###\n#####.##.\n#####.##.\n..##..###\n#....#..#";

solve({
  parser,
  part1,
  part2,

  part1Tests: [[testInput, 405]],
  part2Tests: [[testInput, 400]],
});

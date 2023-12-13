import { solve } from "../runner/typescript";
import { sum, uniq } from "lodash";

type Grid = string[][];
function parser(input: string): Grid[] {
  return input.split("\n\n").map((g) => g.split("\n").map((l) => l.split("")));
}

function getReflections(line: string[]) {
  const len = line.length;
  const reflections: number[] = [];
  for (let i = 1; i < len; i++) {
    const right = line
      .slice(i, i * 2)
      .reverse()
      .join("");

    const left = line.slice(i - right.length, i).join("");

    if (left === right) {
      reflections.push(i);
    }
  }
  return reflections;
}

function func(grid: Grid) {
  // console.log(grid.map((l) => l.join("")));

  const rotated = grid[0].map((_, i) => grid.map((line) => line[i]));

  const verticals = grid.map(getReflections);
  const horizontals = rotated.map(getReflections);
  // console.log(verticals, horizontals);

  let total = 0;

  for (const possibleVertical of uniq(verticals.flat())) {
    if (verticals.every((v) => v.includes(possibleVertical))) {
      // total += possibleVertical;
      // console.log("vertical", possibleVertical);
      return possibleVertical;
    }
  }

  for (const possibleHorizontal of uniq(horizontals.flat())) {
    if (horizontals.every((v) => v.includes(possibleHorizontal))) {
      // total += possibleHorizontal * 100;
      // console.log("horizontal", possibleHorizontal);

      return possibleHorizontal * 100;
    }
  }
  console.log("none");
  return total;
}

function part1(grids: Grid[]): number {
  return sum(grids.map(func));
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
  // part2,

  part1Tests: [
    [
      "#.##..##.\n..#.##.#.\n##......#\n##......#\n..#.##.#.\n..##..##.\n#.#.##.#.\n\n#...##..#\n#....#..#\n..##..###\n#####.##.\n#####.##.\n..##..###\n#....#..#",
      405,
    ],
  ],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});

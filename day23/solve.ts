import { solve } from "../runner/typescript";
import { max, values } from "lodash";
type Point = [number, number];
type Grid = string[][];

const directions = { "^": [0, -1], ">": [1, 0], v: [0, 1], "<": [-1, 0] };

function findLongest(grid: Grid, slippery: boolean): number {
  const start = [grid[0].indexOf("."), 0] satisfies Point;
  const end = [grid.at(-1).indexOf("."), grid.length - 1];
  const possiblePaths = [];

  const queue: [Point, string][] = [[start, ""]];

  while (queue.length) {
    const [[x, y], visited] = queue.shift();
    if (x === end[0] && y === end[1]) {
      const size = visited.split("|").length - 1;
      possiblePaths.push(size);
      console.log(size);
      continue;
    }
    const cell = grid[y][x];
    const deltas =
      slippery && cell in directions ? [directions[cell]] : values(directions);

    const nextPoints = deltas
      .map(([dx, dy]) => [x + dx, y + dy] satisfies Point)
      .filter(([nx, ny]) => !!grid[ny]?.[nx] && grid[ny][nx] !== "#")
      .filter(([nx, ny]) => !visited.includes(`|${nx},${ny}|`));

    nextPoints.forEach(([x, y]) => {
      queue.push([[x, y], `${visited}|${x},${y}`]);
    });
  }
  return max(possiblePaths);
}

function part1(grid: Grid): number {
  return findLongest(grid, true);
}

function part2(grid: Grid): number {
  return findLongest(grid, false);
}

solve({
  parser: (input: string) => input.split("\n").map((row) => row.split("")),
  part1: part1,
  part2: part2,

  testInput:
    "#.#####################\n#.......#########...###\n#######.#########.#.###\n###.....#.>.>.###.#.###\n###v#####.#v#.###.#.###\n###.>...#.#.#.....#...#\n###v###.#.#.#########.#\n###...#.#.#.......#...#\n#####.#.#.#######.#.###\n#.....#.#.#.......#...#\n#.#####.#.#.#########v#\n#.#...#...#...###...>.#\n#.#.#v#######v###.###v#\n#...#.>.#...>.>.#.###.#\n#####v#.#.###v#.#.###.#\n#.....#...#...#.#.#...#\n#.#########.###.#.#.###\n#...###...#...#...#.###\n###.###.#.###v#####v###\n#...#...#.#.>.>.#.>.###\n#.###.###.#.###.#.#v###\n#.....###...###...#...#\n#####################.#",
  part1Tests: [[, 94]],
  part2Tests: [[, 154]],
});

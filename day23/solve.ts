import { solve } from "../runner/typescript";
import { max, sum, groupBy, some, values } from "lodash";
type Point = [number, number];
type Grid = string[][];

const directions = { "^": [0, -1], ">": [1, 0], v: [0, 1], "<": [-1, 0] };

function getNext([x, y]: Point, visited: Set<string>, grid: Grid): Point[] {
  const cell = grid[y]?.[x];
  const deltas = cell in directions ? [directions[cell]] : values(directions);
  // There's a map of nearby hiking trails (your puzzle input) that indicates paths (.), forest (#), and steep slopes (^, >, v, and <).
  // You're currently on the single path tile in the top row; your goal is to reach the single path tile in the bottom row.
  // Because of all the mist from the waterfall, the slopes are probably quite icy;
  // if you step onto a slope tile, your next step must be downhill(in the direction the arrow is pointing).
  // To make sure you have the most scenic hike possible, never step onto the same tile twice.What is the longest hike you can take ?

  return deltas
    .map(([dx, dy]) => [x + dx, y + dy] satisfies Point)
    .filter(([nx, ny]) => !visited.has(`${nx},${ny}`))
    .filter(([nx, ny]) => !!grid[ny]?.[nx] && grid[ny][nx] !== "#");
}

function findLongest(grid: Grid): number {
  const start = [grid[0].indexOf("."), 0] satisfies Point;
  const end = [grid.at(-1).indexOf("."), grid.length - 1];
  const possiblePaths = [];

  const queue: [[number, number], Set<string>][] = [[start, new Set()]];
  while (queue.length) {
    const [point, visited] = queue.shift();
    if (point[0] === end[0] && point[1] === end[1]) {
      possiblePaths.push(visited.size);
      continue;
    }
    const nextPoints = getNext(point, visited, grid);
    nextPoints.forEach(([x, y]) => {
      queue.push([[x, y], new Set(visited).add(`${x},${y}`)]);
    });
  }
  console.log(possiblePaths);
  return max(possiblePaths);
}

function part1(grid: Grid): number {
  return findLongest(grid);
}

solve({
  parser: (input: string) => input.split("\n").map((row) => row.split("")),
  part1: part1,
  // part2: part2,

  part1Tests: [
    [
      "#.#####################\n#.......#########...###\n#######.#########.#.###\n###.....#.>.>.###.#.###\n###v#####.#v#.###.#.###\n###.>...#.#.#.....#...#\n###v###.#.#.#########.#\n###...#.#.#.......#...#\n#####.#.#.#######.#.###\n#.....#.#.#.......#...#\n#.#####.#.#.#########v#\n#.#...#...#...###...>.#\n#.#.#v#######v###.###v#\n#...#.>.#...>.>.#.###.#\n#####v#.#.###v#.#.###.#\n#.....#...#...#.#.#...#\n#.#########.###.#.#.###\n#...###...#...#...#.###\n###.###.#.###v#####v###\n#...#...#.#.>.>.#.>.###\n#.###.###.#.###.#.#v###\n#.....###...###...#...#\n#####################.#",
      94,
    ],
    // ["a", 0],
  ],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});

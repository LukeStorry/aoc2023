import { solve } from "../runner/typescript";
import { entries, keys, maxBy, values } from "lodash";
type Grid = string[][];
type Node = [number, number, number];
type Graph = { [key: string]: Node[] };
const directions = { "^": [0, -1], ">": [1, 0], v: [0, 1], "<": [-1, 0] };

function makeGraph(grid: string[][], slippery: boolean): Graph {
  const graph = {} as Graph;
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "#") return;
      const deltas =
        slippery && cell in directions
          ? [directions[cell]]
          : values(directions);
      const next = deltas
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(([nx, ny]) => !!grid[ny]?.[nx] && grid[ny][nx] != "#")
        .map(([nx, ny]) => [nx, ny, 1] satisfies Node);
      graph[`${x},${y}`] = next;
    });
  });

  // make new compressed graph of just just junctions
  const compressedGraph = {} as Graph;
  const junctions = entries(graph).filter(([_, next]) => next.length != 2);
  junctions.forEach(([name, nexts]) => {
    const newNextNodes: Node[] = [];
    for (const next of nexts) {
      let [nx, ny] = next;
      const seen = new Set<string>([name]);
      while (true) {
        let weight = 1;
        const nextName = `${nx},${ny}`;
        seen.add(nextName);
        let nextNexts = graph[nextName];
        if (nextNexts.length != 2) {
          newNextNodes.push([nx, ny, weight] satisfies Node);
          break;
        }
        [nx, ny] = nextNexts.find(([x, y]) => !seen.has(`${x},${y}`));
        weight += 1;
      }
    }
    compressedGraph[name] = newNextNodes;
  });

  console.log({
    total: keys(graph).length,
    compressed: keys(compressedGraph).length,
  });

  return graph;
}

function findLongest(graph: Graph): number {
  const end = maxBy(values(graph).flat(), ([_, y]) => y);
  let longestPath = 0;

  const queue: [number, number, number, string][] = [[1, 0, 0, ""]];

  while (queue.length) {
    const [x, y, pathLength, visited] = queue.shift();
    if (x === end[0] && y === end[1]) {
      console.log(pathLength, queue.length);
      if (pathLength > longestPath) longestPath = pathLength;
      continue;
    }

    graph[`${x},${y}`]
      .filter(([nx, ny, _]) => !visited.includes(`|${nx},${ny}|`))
      .forEach(([x, y, weight]) => {
        queue.push([x, y, pathLength + weight, `${visited}|${x},${y}`]);
      });
  }
  return longestPath;
}

function part1(grid: Grid): number {
  const graph = makeGraph(grid, true);
  return findLongest(graph);
}

function part2(grid: Grid): number {
  const graph = makeGraph(grid, false);
  return findLongest(graph);
}

solve({
  parser: (input) => input.split("\n").map((row) => row.split("")),
  part1,
  part2,

  testInput:
    "#.#####################\n#.......#########...###\n#######.#########.#.###\n###.....#.>.>.###.#.###\n###v#####.#v#.###.#.###\n###.>...#.#.#.....#...#\n###v###.#.#.#########.#\n###...#.#.#.......#...#\n#####.#.#.#######.#.###\n#.....#.#.#.......#...#\n#.#####.#.#.#########v#\n#.#...#...#...###...>.#\n#.#.#v#######v###.###v#\n#...#.>.#...>.>.#.###.#\n#####v#.#.###v#.#.###.#\n#.....#...#...#.#.#...#\n#.#########.###.#.#.###\n#...###...#...#...#.###\n###.###.#.###v#####v###\n#...#...#.#.>.>.#.>.###\n#.###.###.#.###.#.#v###\n#.....###...###...#...#\n#####################.#",
  part1Tests: [[, 94]],
  part2Tests: [[, 154]],
});

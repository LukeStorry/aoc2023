import { solve } from "../runner/typescript";
import { fromPairs, keys, values } from "lodash";
type Node = [string, number];
type Graph = { [key: string]: Node[] };

const directionBySlope = { "^": [0, -1], ">": [1, 0], v: [0, 1], "<": [-1, 0] };

function makeGraph(input: string, ignoreSlopes = false): Graph {
  const grid = input.split("\n").map((row) => row.split(""));

  function getConnectionsForCell([x, y]: [number, number]) {
    const char = grid[y][x];
    if (char == "#") return [];
    const deltas =
      char in directionBySlope && !ignoreSlopes
        ? [directionBySlope[char]]
        : values(directionBySlope);

    return deltas
      .map(([dx, dy]) => [x + dx, y + dy] satisfies [number, number])
      .filter(([nx, ny]) => !!grid[ny]?.[nx] && grid[ny][nx] != "#");
  }

  const cellsWithConnections = grid
    .flatMap((row, y) => row.map((_, x) => [x, y]))
    .map((cell: [number, number]) => {
      const name = String(cell);
      const connections = getConnectionsForCell(cell);
      if (connections.length == 0) return null;

      // Optimise by compressing corridors - removing all nodes that have exactly two connections
      if (connections.length == 2) return null;

      const compressedConnections = connections.map((connection) => {
        let weight = 1;
        const seen = new Set([name]);
        while (true) {
          const connectionName = String(connection);
          const nextConnections = getConnectionsForCell(connection);
          if (nextConnections.length != 2)
            return [connectionName, weight] satisfies Node;

          connection = nextConnections.find((c) => !seen.has(String(c)));
          weight += 1;
          seen.add(connectionName);
        }
      });

      return [name, compressedConnections];
    });

  return fromPairs(cellsWithConnections.filter(Boolean));
}

function findLongest(graph: Graph): number {
  const [start, end] = [keys(graph).at(0), keys(graph).at(-1)];
  let longestPath = -1;
  const queue: [string, number, string[]][] = [[start, 0, []]];
  while (queue.length) {
    const [node, pathLength, visited] = queue.pop();
    if (node == end) {
      longestPath = Math.max(longestPath, pathLength);
      continue;
    }
    for (const [next, weight] of graph[node]) {
      if (visited.includes(next)) continue;
      queue.push([next, pathLength + weight, visited.concat(next)]);
    }
  }
  return longestPath;
}

solve({
  part1: (input: string) => findLongest(makeGraph(input)),
  part2: (input: string) => findLongest(makeGraph(input, true)),

  testInput:
    "#.#####################\n#.......#########...###\n#######.#########.#.###\n###.....#.>.>.###.#.###\n###v#####.#v#.###.#.###\n###.>...#.#.#.....#...#\n###v###.#.#.#########.#\n###...#.#.#.......#...#\n#####.#.#.#######.#.###\n#.....#.#.#.......#...#\n#.#####.#.#.#########v#\n#.#...#...#...###...>.#\n#.#.#v#######v###.###v#\n#...#.>.#...>.>.#.###.#\n#####v#.#.###v#.#.###.#\n#.....#...#...#.#.#...#\n#.#########.###.#.#.###\n#...###...#...#...#.###\n###.###.#.###v#####v###\n#...#...#.#.>.>.#.>.###\n#.###.###.#.###.#.#v###\n#.....###...###...#...#\n#####################.#",
  part1Tests: [[, 94]],
  part2Tests: [[, 154]],
});

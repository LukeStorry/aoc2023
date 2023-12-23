import { solve } from "../runner/typescript";
import { entries, fromPairs, maxBy, values } from "lodash";
type Node = [number, number, number];
type Graph = { [key: string]: Node[] };
const directions = { "^": [0, -1], ">": [1, 0], v: [0, 1], "<": [-1, 0] };

function makeGraph(input: string, canWalkUpSteep = false): Graph {
  const grid = input.split("\n").map((row) => row.split(""));

  function getConnectionsForCell(x: number, y: number): [number, number][] {
    const cell = grid[y][x];
    const deltas =
      cell in directions && !canWalkUpSteep
        ? [directions[cell]]
        : values(directions);
    return deltas
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([nx, ny]) => !!grid[ny]?.[nx] && grid[ny][nx] != "#")
      .map(([nx, ny]) => [nx, ny]);
  }
  const cells = grid.flatMap((row, y) =>
    row
      .map((cell, x) => [x, y, cell] as const)
      .filter(([_, __, cell]) => cell !== "#");
      
  const fullGraph = fromPairs(
    cells
        .map(([x, y]) => [`${x},${y}`, getConnectionsForCell(x, y)])
    )
  );

  function followConnectionUntilNextJunction(
    name: string,
    oldConnection: [number, number]
  ) {
    let [nx, ny] = oldConnection;
    let weight = 1;
    const seen = new Set<string>([name]);
    while (true) {
      const name = `${nx},${ny}`;
      let nextConnection = fullGraph[name];
      if (nextConnection.length != 2) return [nx, ny, weight] satisfies Node;
      [nx, ny] = nextConnection.find(([x, y]) => !seen.has(`${x},${y}`));
      weight += 1;
      seen.add(name);
    }
  }

  // make new compressed graph of just junctions
  const compressedGraph = fromPairs(
    entries(fullGraph)
      .filter(([_, connections]) => connections.length != 2)
      .map(([name, connections]) => [
        name,
        connections.map((c) => followConnectionUntilNextJunction(name, c)),
      ])
  );
  return compressedGraph;
}

function findLongest(graph: Graph): number {
  const end = maxBy(values(graph).flat(), ([_, y]) => y);
  let longestPath = -1;
  const queue: [Node, string[]][] = [[[1, 0, 0], []]];
  while (queue.length) {
    const [[x, y, pathLength], visited] = queue.pop();

    if (x === end[0] && y === end[1]) {
      longestPath = Math.max(longestPath, pathLength);
      continue;
    }

    for (const [nx, ny, weight] of graph[`${x},${y}`]) {
      const name = `${nx},${ny}`;
      if (visited.includes(name)) continue;
      queue.push([[nx, ny, pathLength + weight], visited.concat(name)]);
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

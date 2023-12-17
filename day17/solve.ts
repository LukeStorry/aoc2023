import { printGrid } from "../day16/printGrid";
import { solve } from "../runner/typescript";
import { max, sum, groupBy, min } from "lodash";

type Node = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  steps: number;
  heat: number;
};
function getNextSteps(node: Node, map: number[][]): Node[] {
  const potentialNextSteps: Node[] = [];

  // Continue straight
  if (node.steps < 3) {
    potentialNextSteps.push({
      x: node.x + node.dx,
      y: node.y + node.dy,
      dx: node.dx,
      dy: node.dy,
      steps: node.steps + 1,
      heat: node.heat + map[node.y + node.dy]?.[node.x + node.dx],
    });
  }

  // Turn left
  potentialNextSteps.push({
    x: node.x - node.dy,
    y: node.y + node.dx,
    dx: -node.dy,
    dy: node.dx,
    steps: 1,
    heat: node.heat + map[node.y + node.dx]?.[node.x - node.dy],
  });

  // Turn right
  potentialNextSteps.push({
    x: node.x + node.dy,
    y: node.y - node.dx,
    dx: node.dy,
    dy: -node.dx,
    steps: 1,
    heat: node.heat + map[node.y - node.dx]?.[node.x + node.dy],
  });

  return potentialNextSteps.filter(
    (node) =>
      node.x >= 0 &&
      node.x < map[0].length &&
      node.y >= 0 &&
      node.y < map.length
  );
}
function part1(map: number[][]): number {
  const results = [];
  const queue: Node[] = [
    { x: 0, y: 0, dx: 1, dy: 0, steps: 0, heat: 0 }, // Start at top-left, moving right
  ];
  const visited = new Map<string, number>();

  while (queue.length > 0) {
    const node = queue.shift()!;
    const key = `${node.x},${node.y},${node.dx},${node.dy},${node.steps}`;

    if (visited.has(key) && visited.get(key)! <= node.heat) continue;
    visited.set(key, node.heat);

    if (node.x === map[0].length - 1 && node.y === map.length - 1) {
      // Reached the destination
      results.push(node.heat);
    }

    const nextSteps = getNextSteps(node, map);
    queue.push(...nextSteps);
    queue.sort((a, b) => a.heat - b.heat); // Turn the queue into a priority queue
  }

  console.log(results);
  return min(results);
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
  parser: (input) =>
    input.split("\n").map((line) => line.split("").map(Number)),
  part1: part1,
  // part2: part2,
  testInput:
    "2413432311323\n3215453535623\n3255245654254\n3446585845452\n4546657867536\n1438598798454\n4457876987766\n3637877979653\n4654967986887\n4564679986453\n1224686865563\n2546548887735\n4322674655533",
  part1Tests: [
    [, 102],
    // ["a", 0],
  ],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});

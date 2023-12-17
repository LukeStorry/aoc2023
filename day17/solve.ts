import { solve } from "../runner/typescript";
import PriorityQueue from "ts-priority-queue";

type Grid = number[][];
type Node = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  steps: number;
  heat: number;
};

function getNextSteps(
  node: Node,
  grid: Grid,
  canContinue: (node: Node) => boolean,
  canTurn: (node: Node) => boolean
): Node[] {
  function create(dx, dy, steps) {
    const [x, y] = [node.x + dx, node.y + dy];
    if (!grid[y]?.[x]) return null;
    const heat = node.heat + grid[y][x];
    return { x, y, dx, dy, steps, heat };
  }
  return [
    canContinue(node) ? create(node.dx, node.dy, node.steps + 1) : null,
    canTurn(node) ? create(-node.dy, node.dx, 1) : null,
    canTurn(node) ? create(node.dy, -node.dx, 1) : null,
  ].filter(Boolean);
}

function findMinPath(
  grid: Grid,
  canContinue = (n: Node) => true,
  canTurn = (n: Node) => true
): number {
  const [width, height] = [grid[0].length - 1, grid.length - 1];
  const previousHeats = new Map<string, number>();
  const queue = new PriorityQueue({
    comparator: (a, b) => a.heat - b.heat,
    initialValues: [
      { x: 0, y: 0, dx: 1, dy: 0, steps: 0, heat: 0 },
      { x: 0, y: 0, dx: 0, dy: 1, steps: 0, heat: 0 },
    ],
  });
  while (queue.length > 0) {
    const node = queue.dequeue();
    const key = `${node.x},${node.y},${node.dx},${node.dy},${node.steps}`;
    if (previousHeats.get(key) <= node.heat) continue;
    previousHeats.set(key, node.heat);
    if (node.x === width && node.y === height && canTurn(node))
      return node.heat;
    const nextSteps = getNextSteps(node, grid, canContinue, canTurn);
    nextSteps.forEach((n) => queue.queue(n));
  }

  throw new Error("No solution found");
}

function part1(grid: Grid): number {
  const canContinue = (n) => n.steps < 3;
  return findMinPath(grid, canContinue);
}

function part2(grid: Grid): number {
  const canContinue = (n) => n.steps < 10;
  const canTurn = (n) => n.steps >= 4;
  return findMinPath(grid, canContinue, canTurn);
}

solve({
  parser: (input) => input.split("\n").map((l) => l.split("").map(Number)),
  part1,
  part2,
  testInput:
    "2413432311323\n3215453535623\n3255245654254\n3446585845452\n4546657867536\n1438598798454\n4457876987766\n3637877979653\n4654967986887\n4564679986453\n1224686865563\n2546548887735\n4322674655533",
  part1Tests: [[, 102]],
  part2Tests: [
    [, 94],
    [
      "111111111111\n999999999991\n999999999991\n999999999991\n999999999991",
      71,
    ],
  ],
});

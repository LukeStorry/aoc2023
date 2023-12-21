import { countBy, fromPairs, groupBy, sum, toPairs, values, zip } from "lodash";
import { solve } from "../runner/typescript";

type Point = [number, number, number, number];
type Grid = string[][];
type Data = { start: Point; grid: Grid };

function parser(input: string): Data {
  const grid = input.split("\n").map((row) => row.split(""));
  const start = grid.flatMap((row, y) =>
    row
      .map((cell, x) => (cell == "S" ? ([x, y, 0, 0] satisfies Point) : null))
      .filter(Boolean)
  )[0];
  return { grid, start };
}

function getNext([x, y, offsetX, offsetY]: Point, grid: Grid): Point[] {
  const [width, height] = [grid[0].length, grid.length];
  const sameGrid = zip([-1, 0, 1, 0], [0, -1, 0, 1])
    .map(([dx, dy]) => [x + dx, y + dy, offsetX, offsetY] satisfies Point)
    .filter(([nx, ny]) => "S.".includes(grid[ny]?.[nx]));
  const nextGrid = [
    x === 0 ? ([width - 1, y, offsetX - 1, offsetY] satisfies Point) : null,
    x === width - 1 ? ([0, y, offsetX + 1, offsetY] satisfies Point) : null,
    y === 0 ? ([x, height - 1, offsetX, offsetY - 1] satisfies Point) : null,
    y === height - 1 ? ([x, 0, offsetX, offsetY + 1] satisfies Point) : null,
  ].filter(Boolean);

  return [...sameGrid, ...nextGrid];
}

function finalDestinations(start: Point, grid: Grid, steps: number): Point[] {
  let points = { [`${start}`]: start };
  for (let i = 0; i < steps; i++) {
    // if (i % 10 === 0) console.log(`${i}/${steps}`);
    const nextPoints = values(points).flatMap((p) => getNext(p, grid));
    points = fromPairs(nextPoints.map((p) => [`${p}`, p]));
  }
  return values(points);
}

function part1({ start, grid }: Data, isTest: boolean) {
  const steps = isTest ? 6 : 64;
  const visited = finalDestinations(start, grid, steps);
  return visited.length;
}

function part2({ start, grid }: Data, isTest: boolean) {
  const width = grid[0].length;
  const gridsToFill = isTest ? 3 : 2; // cycles to run until stablilises
  const totalSteps = isTest ? 5000 : 26501365;
  const hopefullyEnoughSteps = width * gridsToFill + (totalSteps % width);

  const visited = finalDestinations(start, grid, hopefullyEnoughSteps);

  const gridCounts = fromPairs(
    toPairs(groupBy(visited, ([_, __, ___, yOffset]) => yOffset)).map(
      ([offsetY, values]) => {
        const rowCount = countBy(values, ([_, __, xOffset]) => xOffset);
        return [offsetY, rowCount];
      }
    )
  );

  const corners = [
    gridCounts[-gridsToFill][0],
    gridCounts[gridsToFill][0],
    gridCounts[0][-gridsToFill],
    gridCounts[0][gridsToFill],
  ];

  const mostlyEmptyEdges = [
    gridCounts[-gridsToFill][-1],
    gridCounts[-gridsToFill][1],
    gridCounts[gridsToFill][-1],
    gridCounts[gridsToFill][1],
  ];

  const mostlyFullEdges = [
    gridCounts[-1][1 - gridsToFill],
    gridCounts[-1][gridsToFill - 1],
    gridCounts[1][1 - gridsToFill],
    gridCounts[1][gridsToFill - 1],
  ];

  const evenFullGrids = gridCounts[0][gridsToFill % 2];
  const oddFullGrids = gridCounts[0][(gridsToFill % 2) - 1];

  const cycleSize = Math.floor(totalSteps / width);
  return (
    sum(corners) +
    sum(mostlyEmptyEdges) * cycleSize +
    sum(mostlyFullEdges) * (cycleSize - 1) +
    oddFullGrids * cycleSize ** 2 +
    evenFullGrids * (cycleSize - 1) ** 2
  );
}

solve({
  parser,
  part1,
  testInput:
    "...........\n.....###.#.\n.###.##..#.\n..#.#...#..\n....#.#....\n.##..S####.\n.##..#...#.\n.......##..\n.##.#.####.\n.##..##.##.\n...........",
  part2,
  part1Tests: [[, 16]],
  part2Tests: [[, 16733044]],
});

import { countBy, fromPairs, groupBy, sum, toPairs, values, zip } from "lodash";
import { solve } from "../runner/typescript";

type Point = [number, number] | number[];
type MultiGridPoint = { pointInGrid: Point; gridOffset: Point };
type Data = {
  width: number;
  height: number;
  start: MultiGridPoint;
  graph: Record<string, Point[]>;
};

function parser(input: string): Data {
  const grid: string[][] = input.split("\n").map((row) => row.split(""));
  const start = grid
    .flatMap((row, y) =>
      row.map((cell, x) =>
        cell == "S"
          ? ({
              pointInGrid: [x, y],
              gridOffset: [0, 0],
            } satisfies MultiGridPoint)
          : null
      )
    )
    .find(Boolean);

  const cellsWithConnections = grid
    .flatMap((row, y) =>
      row.map((cell, x) => {
        if (cell == "#") return null;
        const connections = zip([-1, 0, 1, 0], [0, -1, 0, 1])
          .map(([dx, dy]) => [x + dx, y + dy] satisfies Point)
          .filter(([nx, ny]) => "S.".includes(grid[ny]?.[nx]));
        return [`${x},${y}`, connections];
      })
    )
    .filter(Boolean);

  return {
    start,
    width: grid[0].length,
    height: grid.length,
    graph: fromPairs(cellsWithConnections),
  };
}

function finalDestinations(
  { graph, width, height, start }: Data,
  steps: number
): MultiGridPoint[] {
  // keys work as a Set, but with cheap access to full object.
  let points = { [`${start.gridOffset}|${start.pointInGrid}`]: start };

  for (let i = 0; i < steps; i++) {
    const nextPoints = values(points).flatMap(
      ({ pointInGrid: [x, y], gridOffset: [offsetX, offsetY] }) => {
        const sameGrid: MultiGridPoint[] = graph[`${x},${y}`].map(
          (neighbor) => ({
            pointInGrid: neighbor,
            gridOffset: [offsetX, offsetY],
          })
        );

        const nextGrid: MultiGridPoint[] = [
          x === 0
            ? {
                pointInGrid: [width - 1, y],
                gridOffset: [offsetX - 1, offsetY],
              }
            : null,
          x === width - 1
            ? {
                pointInGrid: [0, y],
                gridOffset: [offsetX + 1, offsetY],
              }
            : null,
          y === 0
            ? {
                pointInGrid: [x, height - 1],
                gridOffset: [offsetX, offsetY - 1],
              }
            : null,
          y === height - 1
            ? {
                pointInGrid: [x, 0],
                gridOffset: [offsetX, offsetY + 1],
              }
            : null,
        ].filter(Boolean);

        const result = [...sameGrid, ...nextGrid];
        return result;
      }
    );

    points = fromPairs(
      nextPoints.map((p) => [
        `${p.pointInGrid.map(Number)}|${p.gridOffset.map(Number)}`,
        p,
      ])
    );
  }

  return values(points);
}

function part1(data: Data, isTest: boolean) {
  const steps = isTest ? 6 : 64;
  const visited = finalDestinations(data, steps);
  return visited.length;
}

function part2(data: Data, isTest: boolean) {
  const steps = isTest ? 5000 : 26501365;
  const repeats = Math.floor(steps / data.width);
  const hopefullyEnoughSteps = data.width * 2 + (steps % data.width);

  const visited = finalDestinations(data, hopefullyEnoughSteps);

  const gridCounts = fromPairs(
    toPairs(groupBy(visited, ({ gridOffset: [_, y] }) => y)).map(
      ([offsetY, values]) => [
        offsetY,
        countBy(values, ({ gridOffset: [x, _] }) => x),
      ]
    )
  );

  const corners = [
    gridCounts[-2][0],
    gridCounts[2][0],
    gridCounts[0][-2],
    gridCounts[0][2],
  ];

  const mostlyEmptyEdges = [
    gridCounts[-2][-1],
    gridCounts[-2][1],
    gridCounts[2][-1],
    gridCounts[2][1],
  ];

  const mostlyFullEdges = [
    gridCounts[-1][-1],
    gridCounts[-1][1],
    gridCounts[1][-1],
    gridCounts[1][1],
  ];

  const evenFullGrids = gridCounts[0][0];
  const oddFullGrids = gridCounts[0][1];

  return (
    sum(corners) +
    sum(mostlyEmptyEdges) * repeats +
    sum(mostlyFullEdges) * (repeats - 1) +
    oddFullGrids * repeats ** 2 +
    evenFullGrids * (repeats - 1) ** 2
  );
}

solve({
  parser,
  part1,
  testInput:
    "...........\n.....###.#.\n.###.##..#.\n..#.#...#..\n....#.#....\n.##..S####.\n.##..#...#.\n.......##..\n.##.#.####.\n.##..##.##.\n...........",
  part2,
  part1Tests: [[, 16]],
  // part2Tests: [[, 16733044]],
});

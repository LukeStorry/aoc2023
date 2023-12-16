import { solve } from "../runner/typescript";
import { uniq } from "lodash";

type Cell = "." | "\\" | "/" | "-" | "|";
type Grid = Cell[][];
type CoordinateWithDirection = readonly [number, number, number, number];
type VisitedHash = `${number},${number},${number},${number}`;

function printGrid(
  grid: Grid,
  visited: Set<VisitedHash>,
  currentX?: number,
  currentY?: number
) {
  const visitedCoords = new Set(getCoordsFromVisitedHash(visited));

  const asString = grid
    .map((line, y) => {
      const cells = line.map((cell, x) => {
        if (x === currentX && y === currentY) return "•";
        if (visitedCoords.has(`${x},${y}`)) return "#";
        if (cell === ".") return " ";
        return cell;
      });
      return cells.join("");
    })
    .join("\n");
  console.clear();
  console.log(asString);
}

function getCoordsFromVisitedHash(visited: Iterable<VisitedHash>) {
  return [...visited].map((coord) => {
    const [x, y] = coord.split(",", 2);
    return `${x},${y}`;
  });
}

function getNextCoords(
  [x, y, dx, dy]: CoordinateWithDirection,
  currentCell: Cell
): CoordinateWithDirection[] {
  if (currentCell === "\\" && dx) return [[x, y + dx, 0, dx]];
  if (currentCell === "\\" && dy) return [[x + dy, y, dy, 0]];
  if (currentCell === "/" && dx) return [[x, y - dx, 0, -dx]];
  if (currentCell === "/" && dy) return [[x - dy, y, -dy, 0]];
  if (currentCell === "|" && dx) {
    return [
      [x, y - 1, 0, -1],
      [x, y + 1, 0, 1],
    ];
  }
  if (currentCell === "-" && dy) {
    return [
      [x - 1, y, -1, 0],
      [x + 1, y, 1, 0],
    ];
  }
  return [[x + dx, y + dy, dx, dy]];
}

function beamFollower(grid: Grid): number {
  const start: CoordinateWithDirection = [0, 0, 1, 0];
  let queue = [start];
  const visited = new Set<VisitedHash>();

  while (queue.length) {
    const current = queue.pop();

    // printGrid(grid, visited, current[0], current[1]);
    const cell = grid[current[1]]?.[current[0]];
    const newVisited = current.join(",") as VisitedHash;
    if (!cell || visited.has(newVisited)) continue;

    visited.add(newVisited);

    const nextCoords = getNextCoords(current, cell);
    queue.push(...nextCoords);
  }
  const coords = uniq(getCoordsFromVisitedHash(visited));
  return coords.length;
}

function part1(grid: Grid, isTest): number {
  // if (!isTest) throw new Error("Not ready");
  const visitedCells = beamFollower(grid);
  return visitedCells;
}

const testInput = `.|...\\....\n|.-.\\.....\n.....|-...\n........|.\n..........\n.........\\\n..../.\\\\..\n.-.-/..|..\n.|....-|.\\\n..//.|....`;

// function part2(grid: string[][]): number {
//   const energised = beamFollower(grid, 0, 0, 1, 0);

//   return energised.length;
// }

solve({
  parser: (input) => input.split("\n").map((line) => line.split("")) as Grid,
  part1,
  testInput: testInput,
  // part2: part2,

  part1Tests: [[, 46]],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});
